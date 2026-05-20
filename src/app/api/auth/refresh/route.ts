import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_REFRESH,
  findActiveSessionByRefreshToken,
  signAccessToken,
  setAuthCookies,
  createRefreshToken,
  touchSession,
} from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Refresh the access token using the refresh-token cookie.
 *
 * Rotates the refresh token (writes a fresh hash to Session.tokenHash)
 * so that a stolen refresh can't be replayed once the legitimate user
 * has refreshed once.
 */
export async function POST() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_REFRESH)?.value;
  if (!raw) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const session = await findActiveSessionByRefreshToken(raw);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
  if (!session.user.isActive || session.user.deletedAt) {
    return NextResponse.json({ error: "Account disabled" }, { status: 403 });
  }

  // Rotate refresh token
  const next = createRefreshToken();
  await prisma.session.update({
    where: { id: session.id },
    data: { tokenHash: next.hash, lastUsedAt: new Date() },
  });

  const accessToken = await signAccessToken({
    sub: String(session.user.id),
    sid: session.id,
    role: session.user.role,
    email: session.user.email,
  });

  await touchSession(session.id);

  const res = NextResponse.json({ ok: true });
  setAuthCookies(res, accessToken, next.raw);
  return res;
}
