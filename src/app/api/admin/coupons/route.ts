import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const Schema = z.object({
  code: z.string().trim().min(1).max(50).regex(/^[A-Z0-9_-]+$/),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/),
  maxUses: z.number().int().min(1).nullable().optional(),
  perUserLimit: z.coerce.number().int().min(1).max(100).default(1),
  validUntil: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        maxUses: parsed.data.maxUses ?? null,
        perUserLimit: parsed.data.perUserLimit,
        validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
        isActive: parsed.data.isActive,
        createdById: admin.id,
      },
    });
    return NextResponse.json({ id: coupon.id });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Code already in use" }, { status: 409 });
    }
    throw e;
  } finally {
    const { ip, userAgent } = await getRequestIpAndUa();
    await prisma.auditLog
      .create({
        data: {
          userId: admin.id,
          action: "CREATE",
          entityType: "Coupon",
          changes: { code: parsed.data.code },
          ipAddress: ip,
          userAgent,
        },
      })
      .catch(() => {});
  }
}
