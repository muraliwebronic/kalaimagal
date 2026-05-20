import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const PatchSchema = z.object({
  code: z.string().trim().min(1).max(50).regex(/^[A-Z0-9_-]+$/).optional(),
  type: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  perUserLimit: z.coerce.number().int().min(1).max(100).optional(),
  validUntil: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const couponId = Number(id);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  await prisma.coupon.update({
    where: { id: couponId },
    data: {
      ...parsed.data,
      validUntil:
        parsed.data.validUntil === undefined
          ? undefined
          : parsed.data.validUntil
            ? new Date(parsed.data.validUntil)
            : null,
    },
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "UPDATE",
      entityType: "Coupon",
      entityId: String(couponId),
      changes: parsed.data as object,
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const couponId = Number(id);

  await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive: false },
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "DELETE",
      entityType: "Coupon",
      entityId: String(couponId),
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
