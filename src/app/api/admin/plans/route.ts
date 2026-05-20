import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const Schema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  nameTamil: z.string().trim().min(1),
  nameEnglish: z.string().trim().min(1),
  descriptionTamil: z.string().trim().optional(),
  descriptionEnglish: z.string().trim().optional(),
  priceInr: z.string().regex(/^\d+(\.\d{1,2})?$/),
  durationDays: z.coerce.number().int().min(1).max(3650),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
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
    const plan = await prisma.subscriptionPlan.create({
      data: {
        slug: parsed.data.slug,
        nameTamil: parsed.data.nameTamil,
        nameEnglish: parsed.data.nameEnglish,
        descriptionTamil: parsed.data.descriptionTamil,
        descriptionEnglish: parsed.data.descriptionEnglish,
        priceInr: parsed.data.priceInr,
        durationDays: parsed.data.durationDays,
        isActive: parsed.data.isActive,
        isFeatured: parsed.data.isFeatured,
      },
    });

    const { ip, userAgent } = await getRequestIpAndUa();
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "CREATE",
        entityType: "SubscriptionPlan",
        entityId: String(plan.id),
        changes: parsed.data,
        ipAddress: ip,
        userAgent,
      },
    });

    return NextResponse.json({ id: plan.id });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
    throw e;
  }
}
