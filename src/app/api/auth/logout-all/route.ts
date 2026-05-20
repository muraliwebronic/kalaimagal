import { NextResponse } from "next/server";
import { clearAuthCookies, getCurrentUser, revokeAllSessions, getRequestIpAndUa } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const count = await revokeAllSessions(user.id);

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "LOGOUT",
      entityType: "User",
      entityId: String(user.id),
      changes: { revokedSessionCount: count },
      ipAddress: ip,
      userAgent,
    },
  });

  const res = NextResponse.json({ ok: true, revoked: count });
  clearAuthCookies(res);
  return res;
}
