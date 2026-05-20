import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const PatchSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/).optional(),
  nameTamil: z.string().trim().min(1).optional(),
  nameEnglish: z.string().trim().min(1).optional(),
  descriptionTamil: z.string().trim().nullable().optional(),
  descriptionEnglish: z.string().trim().nullable().optional(),
  priceInr: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  durationDays: z.coerce.number().int().min(1).max(3650).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const planId = Number(id);

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

  const updated = await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: parsed.data,
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "UPDATE",
      entityType: "SubscriptionPlan",
      entityId: String(planId),
      changes: parsed.data as object,
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true, plan: { id: updated.id } });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  const { id } = await params;
  const planId = Number(id);

  // Check for active subscriptions on this plan
  const activeCount = await prisma.subscription.count({
    where: { planId, status: "ACTIVE", expiresAt: { gt: new Date() } },
  });
  if (activeCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete — ${activeCount} active subscriptions on this plan. Deactivate it instead.` },
      { status: 409 },
    );
  }

  // Soft-delete by marking inactive (preserves payment history FKs)
  await prisma.subscriptionPlan.update({
    where: { id: planId },
    data: { isActive: false, isFeatured: false },
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "DELETE",
      entityType: "SubscriptionPlan",
      entityId: String(planId),
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
