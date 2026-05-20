import "server-only";
import { prisma } from "@/lib/db";

/**
 * Email sender — Phase 1 stub.
 *
 * Behavior:
 * 1. Always writes an EmailLog row (status QUEUED, then SENT or FAILED).
 * 2. If SMTP creds are configured (Phase 4.1), sends via Nodemailer.
 * 3. If not, logs the would-be email to console (so dev can copy verification
 *    + reset links from the terminal). Marks the EmailLog as SENT with a
 *    providerMessageId of `console:{id}` so it's clear this was stubbed.
 *
 * Swap the implementation when SMTP_HOST is filled in .env.local —
 * the call sites and EmailLog rows stay identical.
 */

export interface SendEmailParams {
  to: string;
  emailType: string;       // e.g., "verify-email", "password-reset"
  subject: string;
  html: string;
  text?: string;
  userId?: number | null;
  templateId?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ id: number; ok: boolean }> {
  const log = await prisma.emailLog.create({
    data: {
      userId: params.userId ?? null,
      toEmail: params.to,
      emailType: params.emailType,
      subject: params.subject,
      templateId: params.templateId,
      status: "QUEUED",
    },
  });

  const hasSmtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

  if (!hasSmtp) {
    // Dev / stub mode — log to console so the developer can copy auth links.
    /* eslint-disable no-console */
    console.log("\n──────────────── 📧 EMAIL (stub) ────────────────");
    console.log(` To:      ${params.to}`);
    console.log(` Type:    ${params.emailType}`);
    console.log(` Subject: ${params.subject}`);
    if (params.text) {
      console.log(" ───── text ─────");
      console.log(params.text);
    } else {
      console.log(" ───── html (preview) ─────");
      console.log(params.html.replace(/<[^>]+>/g, "").trim().slice(0, 600));
    }
    console.log("─────────────────────────────────────────────────\n");
    /* eslint-enable no-console */

    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "SENT",
        providerMessageId: `console:${log.id}`,
        sentAt: new Date(),
      },
    });
    return { id: log.id, ok: true };
  }

  // Real SMTP path (Phase 4.1) — dynamically require nodemailer so the
  // module remains optional until creds are present.
  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "SENT",
        providerMessageId: info.messageId,
        sentAt: new Date(),
      },
    });
    return { id: log.id, ok: true };
  } catch (err) {
    await prisma.emailLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        errorMessage: err instanceof Error ? err.message : String(err),
      },
    });
    return { id: log.id, ok: false };
  }
}

/** Pre-built templates used by the auth flow. */
export const emailTemplates = {
  verifyEmail(name: string, link: string) {
    return {
      subject: "உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email",
      text: `வணக்கம் ${name},\n\nகலைமகளில் சேர்ந்ததற்கு நன்றி. கீழுள்ள இணைப்பை அழுத்தி உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் (24 மணி நேரம் செல்லுபடியாகும்):\n\n${link}\n\nஇந்த மின்னஞ்சலை நீங்கள் பதிவு செய்யவில்லை எனில் தயவுசெய்து புறக்கணியுங்கள்.\n\n— கலைமகள் / Kalaimagal\n\n---\nHi ${name}, please confirm your email by clicking: ${link} (valid 24h). If you didn't sign up, ignore this email.`,
      html: `<p>வணக்கம் ${name},</p><p>கலைமகளில் சேர்ந்ததற்கு நன்றி. கீழுள்ள இணைப்பை அழுத்தி உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள்:</p><p><a href="${link}">${link}</a></p><p style="color:#888">இந்த இணைப்பு 24 மணி நேரம் செல்லுபடியாகும். நீங்கள் பதிவு செய்யவில்லை எனில் தயவுசெய்து புறக்கணியுங்கள்.</p><hr/><p>Hi ${name}, please confirm your email by clicking the link above (valid for 24 hours). If you didn't sign up, just ignore this email.</p><p>— Kalaimagal / கலைமகள்</p>`,
    };
  },
  passwordReset(name: string, link: string) {
    return {
      subject: "கடவுச்சொல்லை மீட்டமைக்க — Reset your password",
      text: `வணக்கம் ${name},\n\nஉங்கள் கடவுச்சொல்லை மீட்டமைக்க கீழுள்ள இணைப்பை அழுத்துங்கள் (15 நிமிடம் செல்லுபடியாகும்):\n\n${link}\n\nநீங்கள் இதைக் கேட்கவில்லை எனில் இந்த மின்னஞ்சலை புறக்கணியுங்கள்.\n\n— கலைமகள்\n\n---\nReset your Kalaimagal password: ${link} (valid 15 min). If you didn't request this, ignore this email.`,
      html: `<p>வணக்கம் ${name},</p><p>உங்கள் கடவுச்சொல்லை மீட்டமைக்க கீழுள்ள இணைப்பை அழுத்துங்கள்:</p><p><a href="${link}">${link}</a></p><p style="color:#888">இந்த இணைப்பு 15 நிமிடம் மட்டுமே செல்லுபடியாகும்.</p><hr/><p>Reset your Kalaimagal password at the link above. Valid for 15 minutes. If you didn't request this, just ignore this email.</p>`,
    };
  },
  welcomeAfterPayment(name: string, expiresAt: Date) {
    const date = expiresAt.toLocaleDateString();
    return {
      subject: "உங்கள் சந்தா இயக்கப்பட்டது — Welcome to Kalaimagal",
      text: `வணக்கம் ${name},\n\nஉங்கள் சந்தா இப்போது செயல்படுகிறது, ${date} வரை. கலைமகளில் இருந்து தமிழ் இலக்கியத்தை அனுபவிக்க தயாராக இருங்கள்.\n\n— கலைமகள்`,
      html: `<p>வணக்கம் ${name},</p><p>உங்கள் சந்தா செயல்படுகிறது — செல்லுபடியாகும் தேதி: <strong>${date}</strong>.</p><p>கலைமகளில் தமிழ் இலக்கியத்தை அனுபவிக்க தயாராக இருங்கள்.</p><hr/><p>Your Kalaimagal subscription is active until <strong>${date}</strong>. Enjoy.</p>`,
    };
  },
};
