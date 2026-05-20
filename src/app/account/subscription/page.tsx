import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscribePricingCard } from "@/components/payment/SubscribePricingCard";

export const metadata = { title: "சந்தா — Subscription" };

export default async function SubscriptionPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, phone: true },
  });

  const [subscription, payments, monthlyPlan] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    }),
    prisma.payment.findMany({
      where: { userId: user.id, status: { in: ["PAID", "REFUNDED", "PARTIAL_REFUND"] } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { plan: true },
    }),
    prisma.subscriptionPlan.findUnique({ where: { slug: "monthly" } }),
  ]);

  const isActive =
    subscription?.status === "ACTIVE" && subscription.expiresAt > new Date();

  return (
    <div className="space-y-6">
      {isActive && subscription ? (
        // Active subscriber — small status card
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg tracking-tight">
                  <span data-bi lang="ta">தற்போதைய சந்தா</span>
                  <span data-bi lang="en">Current plan</span>
                </h3>
              </div>
              <Badge>
                <span data-bi lang="ta">செயலில்</span>
                <span data-bi lang="en">Active</span>
              </Badge>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <span data-bi lang="ta" className="font-medium">{subscription.plan.nameTamil}</span>
                <span data-bi lang="en" className="font-medium">{subscription.plan.nameEnglish}</span>
              </p>
              <p className="text-muted-foreground">
                ₹{subscription.plan.priceInr.toString()} every {subscription.plan.durationDays} days
              </p>
              <p className="text-muted-foreground">
                <span data-bi lang="ta">செல்லுபடியாகும் வரை: {subscription.expiresAt.toLocaleDateString()}</span>
                <span data-bi lang="en">Active until: {subscription.expiresAt.toLocaleDateString()}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // No active subscription — show the full pricing card
        monthlyPlan && fullUser && (
          <div>
            <div className="mb-6">
              <h3 className="font-heading text-2xl md:text-3xl tracking-tight">
                <span data-bi lang="ta">வாசிக்கத் தொடங்குங்கள்</span>
                <span data-bi lang="en">Start reading today</span>
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {subscription?.status === "EXPIRED" ? (
                  <>
                    <span data-bi lang="ta">
                      உங்கள் சந்தா {subscription.expiresAt.toLocaleDateString()} அன்று காலாவதியானது.
                      தொடர புதுப்பிக்கவும்.
                    </span>
                    <span data-bi lang="en">
                      Your subscription expired on {subscription.expiresAt.toLocaleDateString()}. Renew to continue.
                    </span>
                  </>
                ) : (
                  <>
                    <span data-bi lang="ta">
                      தமிழ் இலக்கியத்தின் மிகச்சிறந்த உள்ளடக்கங்களை அணுக சந்தா செலுத்தவும்.
                    </span>
                    <span data-bi lang="en">
                      Subscribe to access the best of Tamil literature.
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="max-w-md">
              <SubscribePricingCard
                user={{
                  name: fullUser.name,
                  email: fullUser.email,
                  phone: fullUser.phone,
                }}
                plan={{
                  slug: monthlyPlan.slug,
                  priceInr: monthlyPlan.priceInr.toString(),
                  durationDays: monthlyPlan.durationDays,
                  nameTamil: monthlyPlan.nameTamil,
                  nameEnglish: monthlyPlan.nameEnglish,
                }}
              />
            </div>
          </div>
        )
      )}

      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span data-bi lang="ta">கட்டண வரலாறு</span>
            <span data-bi lang="en">Payment history</span>
          </h3>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              <span data-bi lang="ta">கட்டண பதிவுகள் இல்லை.</span>
              <span data-bi lang="en">No payments yet.</span>
            </p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  <div>
                    <p>
                      {p.plan?.nameEnglish ?? "—"} · {p.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">₹{p.netAmount.toString()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
