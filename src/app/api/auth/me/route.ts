import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Fetch active subscription + sessions list for /account
  const [subscription, sessions] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: user.id, status: "ACTIVE", expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: "desc" },
      include: { plan: true },
    }),
    prisma.session.findMany({
      where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastUsedAt: "desc" },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      forcePasswordChangeOnNextLogin: user.forcePasswordChangeOnNextLogin,
    },
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          startedAt: subscription.startedAt,
          expiresAt: subscription.expiresAt,
          plan: {
            slug: subscription.plan.slug,
            nameTamil: subscription.plan.nameTamil,
            nameEnglish: subscription.plan.nameEnglish,
            priceInr: subscription.plan.priceInr.toString(),
            durationDays: subscription.plan.durationDays,
          },
        }
      : null,
    sessions: sessions.map((s) => ({
      ...s,
      isCurrent: s.id === user.sessionId,
    })),
  });
}
