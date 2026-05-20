import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  signAccessToken,
  createSession,
  setAuthCookies,
  getRequestIpAndUa,
} from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";
import { checkLimit, getClientIp } from "@/lib/rate-limit";

const RegisterSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => v === undefined || /^\+?[0-9 \-]{7,20}$/.test(v), {
      message: "Invalid phone",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  acceptedTerms: z.literal(true, { message: "You must accept the terms" }),
  marketingConsent: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = checkLimit("register", ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const passwordHash = await hashPassword(data.password);
  const verificationToken = randomBytes(32).toString("base64url");

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: "USER",
        emailVerificationToken: verificationToken,
        termsAcceptedAt: new Date(),
        marketingConsent: data.marketingConsent,
        notificationPreferences: { email: true, payment: true, content: true },
        preferredLanguage: "TA",
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const target = (e.meta?.target as string[] | undefined)?.[0];
      const field = target?.includes("email") ? "Email" : target?.includes("phone") ? "Phone" : "Account";
      return NextResponse.json({ error: `${field} is already registered` }, { status: 409 });
    }
    throw e;
  }

  // Create a session immediately so the user is signed in after register
  // (soft email-verify policy — they can browse without verifying).
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

  // Fire verification email (stubbed to console if no SMTP)
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  const tpl = emailTemplates.verifyEmail(user.name, verifyLink);
  await sendEmail({
    to: user.email,
    emailType: "verify-email",
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    userId: user.id,
  });

  // Audit
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entityType: "User",
      entityId: String(user.id),
      ipAddress: ip,
      userAgent,
    },
  });

  const res = NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  setAuthCookies(res, accessToken, session.refreshTokenRaw);
  return res;
}
