import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_REFRESH,
  clearAuthCookies,
  findActiveSessionByRefreshToken,
  revokeSession,
  getRequestIpAndUa,
} from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_REFRESH)?.value;

  if (refreshToken) {
    const session = await findActiveSessionByRefreshToken(refreshToken);
    if (session) {
      await revokeSession(session.id);
      const { ip, userAgent } = await getRequestIpAndUa();
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "LOGOUT",
          entityType: "Session",
          entityId: String(session.id),
          ipAddress: ip,
          userAgent,
        },
      });
    }
  }

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
