import "server-only";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/* ============================================================================
   Constants
   ============================================================================ */

export const COOKIE_ACCESS = "kalaimagal_at";
export const COOKIE_REFRESH = "kalaimagal_rt";

const ACCESS_TTL_SECONDS = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 900);          // 15 min
const REFRESH_TTL_SECONDS = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 2_592_000);  // 30 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

/* ============================================================================
   Password hashing
   ============================================================================ */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ============================================================================
   Access JWT — short-lived, signed
   ============================================================================ */

export interface AccessTokenClaims {
  sub: string;          // user id
  sid: number;          // session id (for revocation)
  role: string;
  email: string;
}

export async function signAccessToken(claims: AccessTokenClaims): Promise<string> {
  return new SignJWT({ ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .setIssuer("kalaimagal")
    .setAudience("kalaimagal-app")
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "kalaimagal",
      audience: "kalaimagal-app",
    });
    return {
      sub: String(payload.sub ?? ""),
      sid: Number(payload.sid),
      role: String(payload.role ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}

/* ============================================================================
   Refresh tokens — opaque, hashed in Session.tokenHash
   ============================================================================ */

export function createRefreshToken(): { raw: string; hash: string } {
  const raw = randomBytes(48).toString("base64url");
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/* ============================================================================
   Sessions — DB-backed, enables logout-all + device tracking
   ============================================================================ */

interface CreateSessionInput {
  userId: number;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function createSession(input: CreateSessionInput): Promise<{
  sessionId: number;
  refreshTokenRaw: string;
  expiresAt: Date;
}> {
  const { raw, hash } = createRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);

  const session = await prisma.session.create({
    data: {
      userId: input.userId,
      tokenHash: hash,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      deviceInfo: deriveDeviceInfo(input.userAgent),
      expiresAt,
    },
  });

  return { sessionId: session.id, refreshTokenRaw: raw, expiresAt };
}

export async function revokeSession(sessionId: number): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllSessions(userId: number): Promise<number> {
  const res = await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return res.count;
}

/** Find an active (non-revoked, non-expired) session by raw refresh token. */
export async function findActiveSessionByRefreshToken(raw: string) {
  const hash = hashToken(raw);
  const now = new Date();
  return prisma.session.findFirst({
    where: {
      tokenHash: hash,
      revokedAt: null,
      expiresAt: { gt: now },
    },
    include: { user: true },
  });
}

/** Mark a session as used (touches lastUsedAt). */
export async function touchSession(sessionId: number): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { lastUsedAt: new Date() },
  });
}

/** Best-effort device label from UA — keep it short. */
function deriveDeviceInfo(ua?: string | null): string | null {
  if (!ua) return null;
  const m = /(Chrome|Firefox|Safari|Edge|Opera)[\/\s](\d+)/.exec(ua);
  const os = /Windows|Mac OS|Linux|Android|iPhone|iPad/.exec(ua)?.[0];
  if (!m && !os) return ua.slice(0, 120);
  return [os, m?.[1]].filter(Boolean).join(" · ").slice(0, 120);
}

/* ============================================================================
   Cookies — applied via NextResponse.cookies
   ============================================================================ */

interface CookieAttrs {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
}

function cookieAttrs(): CookieAttrs {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshTokenRaw: string,
): void {
  res.cookies.set(COOKIE_ACCESS, accessToken, {
    ...cookieAttrs(),
    maxAge: ACCESS_TTL_SECONDS,
  });
  res.cookies.set(COOKIE_REFRESH, refreshTokenRaw, {
    ...cookieAttrs(),
    maxAge: REFRESH_TTL_SECONDS,
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set(COOKIE_ACCESS, "", { ...cookieAttrs(), maxAge: 0 });
  res.cookies.set(COOKIE_REFRESH, "", { ...cookieAttrs(), maxAge: 0 });
}

/* ============================================================================
   Server-side user resolution (for server components + API routes)
   ============================================================================ */

export type CurrentUser = {
  id: number;
  email: string;
  name: string;
  role: "USER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
  emailVerifiedAt: Date | null;
  forcePasswordChangeOnNextLogin: boolean;
  sessionId: number;
};

/**
 * Resolve the current user from cookies. Returns null if not signed in or
 * if the session has been revoked. Does NOT auto-refresh — callers that
 * need refresh should call /api/auth/refresh.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_ACCESS)?.value;
  if (!token) return null;

  const claims = await verifyAccessToken(token);
  if (!claims) return null;

  // Verify the Session row hasn't been revoked. (JWT alone is not enough
  // because we want logout-all to take effect immediately.)
  const session = await prisma.session.findUnique({ where: { id: claims.sid } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(claims.sub) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerifiedAt: true,
      forcePasswordChangeOnNextLogin: true,
      isActive: true,
      deletedAt: true,
    },
  });
  if (!user || !user.isActive || user.deletedAt) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
    forcePasswordChangeOnNextLogin: user.forcePasswordChangeOnNextLogin,
    sessionId: session.id,
  };
}

/** Require a logged-in user; throw if not present (use in protected routes). */
export async function requireUser(): Promise<CurrentUser> {
  const u = await getCurrentUser();
  if (!u) throw new AuthError("UNAUTHENTICATED");
  return u;
}

/** Require one of the given roles. */
export async function requireRole(
  ...allowed: Array<"USER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN">
): Promise<CurrentUser> {
  const u = await requireUser();
  if (!allowed.includes(u.role)) throw new AuthError("FORBIDDEN");
  return u;
}

export class AuthError extends Error {
  constructor(public code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code);
  }
}

/* ============================================================================
   Request metadata helpers
   ============================================================================ */

export async function getRequestIpAndUa(): Promise<{ ip: string; userAgent: string | null }> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  const ip = xff?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}
