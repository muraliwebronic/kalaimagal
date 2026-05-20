import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  signAccessToken,
  createSession,
  setAuthCookies,
  getRequestIpAndUa,
} from "@/lib/auth";
import { checkLimit, getClientIp } from "@/lib/rate-limit";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  // Rate limit by (IP, email) — protects against per-account brute-force
  const limit = checkLimit("login", ip, email);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run bcrypt to avoid timing-attack discrimination of email existence
  const passwordOk = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, "$2a$12$invalidinvalidinvalidinvaliduUM37hZ3nIA8L5jGZyDc5lOLmEbDi");

  if (!user || !passwordOk) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.isActive || user.deletedAt) {
    return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
  }
  if (user.isBanned) {
    return NextResponse.json(
      { error: "This account has been suspended", reason: user.banReason ?? undefined },
      { status: 403 },
    );
  }

  // Create session
  const { userAgent } = await getRequestIpAndUa();
  const session = await createSession({
    userId: user.id,
    ipAddress: ip,
    userAgent,
  });

  const accessToken = await signAccessToken({
    sub: String(user.id),
    sid: session.sessionId,
    role: user.role,
    email: user.email,
  });

  // Update login bookkeeping
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastActiveAt: new Date(),
      loginCount: { increment: 1 },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      entityType: "User",
      entityId: String(user.id),
      ipAddress: ip,
      userAgent,
    },
  });

  const res = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      forcePasswordChangeOnNextLogin: user.forcePasswordChangeOnNextLogin,
    },
  });
  setAuthCookies(res, accessToken, session.refreshTokenRaw);
  return res;
}
