import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const Schema = z.object({
  updates: z
    .array(
      z.object({
        key: z.string().min(1).max(150),
        value: z.unknown(),
      }),
    )
    .min(1)
    .max(50),
});

export async function PATCH(req: Request) {
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

  await prisma.$transaction(
    parsed.data.updates.map((u) =>
      prisma.setting.update({
        where: { key: u.key },
        data: {
          value: u.value as Parameters<typeof prisma.setting.update>[0]["data"]["value"],
          updatedById: admin.id,
        },
      }),
    ),
  );

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "UPDATE",
      entityType: "Setting",
      changes: { updatedKeys: parsed.data.updates.map((u) => u.key) },
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true, updated: parsed.data.updates.length });
}
