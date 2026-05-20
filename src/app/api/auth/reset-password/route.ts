import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, revokeAllSessions, getRequestIpAndUa } from "@/lib/auth";

const Schema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Token and a password of 8+ characters required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: parsed.data.token,
      passwordResetExpiresAt: { gt: new Date() },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Reset link is invalid or expired" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiresAt: null,
      forcePasswordChangeOnNextLogin: false,
    },
  });

  // Revoke all sessions — force re-login everywhere after a password reset
  const revoked = await revokeAllSessions(user.id);

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "PASSWORD_RESET",
      entityType: "User",
      entityId: String(user.id),
      changes: { revokedSessionCount: revoked },
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
