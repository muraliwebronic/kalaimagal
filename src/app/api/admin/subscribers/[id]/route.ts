import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";

const ActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("extend"), days: z.number().int().min(1).max(365) }),
  z.object({ action: z.literal("ban"), reason: z.string().max(500).optional() }),
  z.object({ action: z.literal("unban") }),
  z.object({ action: z.literal("send-password-reset") }),
]);

/** POST /api/admin/subscribers/[id]  body: { action, ...params } */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = ActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid action", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { ip, userAgent } = await getRequestIpAndUa();
  const audit = async (
    action: "SUBSCRIPTION_OVERRIDE" | "USER_BAN" | "USER_UNBAN" | "PASSWORD_RESET",
    changes: object,
  ) =>
    prisma.auditLog.create({
      data: {
        userId: admin.id,
        action,
        entityType: "User",
        entityId: String(target.id),
        changes,
        ipAddress: ip,
        userAgent,
      },
    });

  if (parsed.data.action === "extend") {
    const days = parsed.data.days;
    const now = new Date();

    // Find latest subscription (active or expired)
    const existing = await prisma.subscription.findFirst({
      where: { userId: target.id },
      orderBy: { expiresAt: "desc" },
      include: { plan: true },
    });

    // If there's an active or recently-expired sub, push expiresAt out
    // by `days`. Otherwise create a fresh subscription on the monthly plan.
    if (existing && existing.expiresAt > now) {
      const newExpiry = new Date(existing.expiresAt.getTime() + days * 86_400_000);
      await prisma.subscription.update({
        where: { id: existing.id },
        data: { expiresAt: newExpiry, status: "ACTIVE" },
      });
      await audit("SUBSCRIPTION_OVERRIDE", {
        type: "extend",
        days,
        prevExpiresAt: existing.expiresAt,
        newExpiresAt: newExpiry,
      });
      return NextResponse.json({ ok: true, message: `Extended to ${newExpiry.toLocaleDateString()}` });
    }

    // No active sub — create one on monthly plan
    const monthly = await prisma.subscriptionPlan.findUnique({ where: { slug: "monthly" } });
    if (!monthly) {
      return NextResponse.json(
        { error: "Monthly plan not found — create one first" },
        { status: 500 },
      );
    }
    const newExpiry = new Date(now.getTime() + days * 86_400_000);
    const sub = await prisma.subscription.create({
      data: {
        userId: target.id,
        planId: monthly.id,
        startedAt: now,
        expiresAt: newExpiry,
        status: "ACTIVE",
      },
    });
    await audit("SUBSCRIPTION_OVERRIDE", {
      type: "create",
      days,
      subscriptionId: sub.id,
      expiresAt: newExpiry,
    });
    return NextResponse.json({ ok: true, message: `Active until ${newExpiry.toLocaleDateString()}` });
  }

  if (parsed.data.action === "ban") {
    await prisma.user.update({
      where: { id: target.id },
      data: {
        isBanned: true,
        banReason: parsed.data.reason ?? null,
      },
    });
    // Revoke all sessions so they're kicked out immediately
    await prisma.session.updateMany({
      where: { userId: target.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await audit("USER_BAN", { reason: parsed.data.reason ?? null });
    return NextResponse.json({ ok: true, message: "User banned and sessions revoked" });
  }

  if (parsed.data.action === "unban") {
    await prisma.user.update({
      where: { id: target.id },
      data: { isBanned: false, banReason: null },
    });
    await audit("USER_UNBAN", {});
    return NextResponse.json({ ok: true, message: "User unbanned" });
  }

  if (parsed.data.action === "send-password-reset") {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: target.id },
      data: { passwordResetToken: token, passwordResetExpiresAt: expiresAt },
    });
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const tpl = emailTemplates.passwordReset(target.name, link);
    await sendEmail({
      to: target.email,
      emailType: "password-reset",
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      userId: target.id,
    });
    await audit("PASSWORD_RESET", { triggeredByAdmin: admin.id });
    return NextResponse.json({ ok: true, message: "Reset email sent (check dev console)" });
  }

  return NextResponse.json({ error: "Unhandled action" }, { status: 400 });
}
