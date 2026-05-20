import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getRequestIpAndUa } from "@/lib/auth";

const VerifySchema = z.object({
  token: z.string().min(20),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: parsed.data.token },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid or used verification link" }, { status: 400 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
    },
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entityType: "User",
      entityId: String(user.id),
      changes: { emailVerifiedAt: new Date().toISOString() },
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
