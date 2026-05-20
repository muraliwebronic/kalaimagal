import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail, emailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/expiry-check
 *
 * Daily-cron endpoint (Vercel Cron or external uptime ping). Sends two
 * emails per Subscription lifecycle:
 *   1. T-3 days reminder — to ACTIVE subs expiring exactly 3 days from now
 *   2. Expired notice — to subs whose expiresAt is in the past AND status
 *      is still ACTIVE; flips them to EXPIRED while we're here.
 *
 * Auth: requires `?secret=$CRON_SECRET` query param OR
 *       `Authorization: Bearer $CRON_SECRET` header.
 *
 * Idempotency: we track sent reminders via EmailLog rows. The query for
 * each phase filters out users who've already received that emailType in
 * the last 24h, so accidental same-day re-runs don't double-email.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const renewLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account/subscription`;
  const now = new Date();

  // Window for "expiring in ~3 days": expiresAt between (now+3d) and (now+3d+24h)
  const in3DaysStart = new Date(now.getTime() + 3 * 86_400_000);
  const in3DaysEnd = new Date(in3DaysStart.getTime() + 86_400_000);
  // De-dup window: didn't already send this emailType in the last 24h
  const yesterday = new Date(now.getTime() - 86_400_000);

  // ---- 1. T-3 reminders ------------------------------------------------
  const expiringSoon = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { gte: in3DaysStart, lt: in3DaysEnd },
    },
    include: { user: true },
  });

  let remindersSent = 0;
  let remindersSkipped = 0;
  for (const sub of expiringSoon) {
    const u = sub.user;
    // Already reminded today?
    const recentLog = await prisma.emailLog.findFirst({
      where: {
        userId: u.id,
        emailType: "expiry-reminder-3d",
        sentAt: { gt: yesterday },
        status: "SENT",
      },
    });
    if (recentLog) {
      remindersSkipped += 1;
      continue;
    }
    const tpl = emailTemplates.expiryReminder3Days(u.name, sub.expiresAt, renewLink);
    await sendEmail({
      to: u.email,
      emailType: "expiry-reminder-3d",
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      userId: u.id,
    });
    remindersSent += 1;
  }

  // ---- 2. Expired notices + flip status to EXPIRED --------------------
  const expired = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    include: { user: true },
  });

  let expiryNoticesSent = 0;
  let expiryNoticesSkipped = 0;
  for (const sub of expired) {
    const u = sub.user;
    // Flip the row first so /account/subscription reads ACCURATE state
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "EXPIRED" },
    });

    // De-dup expired email
    const recentLog = await prisma.emailLog.findFirst({
      where: {
        userId: u.id,
        emailType: "expired-notice",
        sentAt: { gt: yesterday },
        status: "SENT",
      },
    });
    if (recentLog) {
      expiryNoticesSkipped += 1;
      continue;
    }
    const tpl = emailTemplates.expired(u.name, sub.expiresAt, renewLink);
    await sendEmail({
      to: u.email,
      emailType: "expired-notice",
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      userId: u.id,
    });
    expiryNoticesSent += 1;
  }

  return NextResponse.json({
    ok: true,
    runAt: now.toISOString(),
    reminders: {
      candidates: expiringSoon.length,
      sent: remindersSent,
      skipped: remindersSkipped,
    },
    expired: {
      candidates: expired.length,
      sent: expiryNoticesSent,
      skipped: expiryNoticesSkipped,
    },
  });
}

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Vercel Cron sends Authorization: Bearer $CRON_SECRET
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;
  // Allow ?secret=… for manual / external uptime pings
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}
