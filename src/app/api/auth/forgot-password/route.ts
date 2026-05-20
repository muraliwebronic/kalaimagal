import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { sendEmail, emailTemplates } from "@/lib/email";
import { checkLimit, getClientIp } from "@/lib/rate-limit";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

/**
 * POST /api/auth/forgot-password
 *
 * Always returns 200 to prevent user-enumeration. If the email is valid and
 * belongs to a real account, generates a 15-min reset token and emails it.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  const limit = checkLimit("passwordReset", ip, parsed.data.email);
  if (!limit.allowed) {
    // Still return 200 to avoid leaking — but skip work
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user && user.isActive && !user.deletedAt && !user.isBanned) {
    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiresAt: expiresAt,
      },
    });

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const tpl = emailTemplates.passwordReset(user.name, link);
    await sendEmail({
      to: user.email,
      emailType: "password-reset",
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      userId: user.id,
    });
  }

  return NextResponse.json({ ok: true });
}
