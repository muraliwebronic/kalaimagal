import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

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
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg tracking-tight">
                <span lang="ta">தற்போதைய சந்தா</span>
                <span className="ml-1.5 text-sm text-muted-foreground">/ Current plan</span>
              </h3>
            </div>
            {isActive && (
              <Badge>
                <span lang="ta">செயலில்</span>
                <span className="ml-1.5 text-xs">/ Active</span>
              </Badge>
            )}
          </div>

          {subscription ? (
            <div className="text-sm space-y-1">
              <p>
                <span lang="ta" className="font-medium">{subscription.plan.nameTamil}</span>
                <span className="ml-2 text-muted-foreground">/ {subscription.plan.nameEnglish}</span>
              </p>
              <p className="text-muted-foreground">
                ₹{subscription.plan.priceInr.toString()} every {subscription.plan.durationDays} days
              </p>
              <p className="text-muted-foreground">
                {isActive ? "செல்லுபடியாகும்" : "முடிந்தது"}: {subscription.expiresAt.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span lang="ta">இப்போது சந்தா எதுவும் இல்லை.</span>{" "}
                <span lang="en" className="italic">No active subscription.</span>
              </p>
              {monthlyPlan && fullUser && (
                <RazorpayButton
                  planSlug={monthlyPlan.slug}
                  label={`₹${monthlyPlan.priceInr.toString()} / month — சந்தா செலுத்து`}
                  user={{ name: fullUser.name, email: fullUser.email, phone: fullUser.phone }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span lang="ta">கட்டண வரலாறு</span>
            <span className="ml-1.5 text-sm text-muted-foreground">/ Payment history</span>
          </h3>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              <span lang="ta">கட்டண பதிவுகள் இல்லை.</span>{" "}
              <span lang="en" className="italic">No payments yet.</span>
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
                  <p className="font-medium">₹{p.netAmount.toString()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
