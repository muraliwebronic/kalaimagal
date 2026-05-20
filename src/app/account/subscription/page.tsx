import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

  const isActive = subscription?.status === "ACTIVE" && subscription.expiresAt > new Date();

  return (
    <div className="flex flex-col gap-8">
      {isActive && subscription ? (
        <section className="frame" style={{ padding: 28 }}>
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="eyebrow">
              <span data-bi lang="ta">தற்போதைய சந்தா · Current plan</span>
              <span data-bi lang="en">Current plan</span>
            </div>
            <span className="badge-km badge-km-free">
              <span data-bi lang="ta">செயலில்</span>
              <span data-bi lang="en">Active</span>
            </span>
          </div>
          <p lang="ta" className="ta-display text-burgundy" style={{ fontSize: 28 }}>
            {subscription.plan.nameTamil}
          </p>
          <p
            className="text-ink-3"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, marginTop: 4 }}
          >
            {subscription.plan.nameEnglish}
          </p>
          <hr className="my-5 border-border-warm" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <KV label={{ ta: "விலை", en: "Price" }}>
              ₹{subscription.plan.priceInr.toString()} / {subscription.plan.durationDays} days
            </KV>
            <KV label={{ ta: "செல்லுபடியாகும் வரை", en: "Active until" }}>
              {subscription.expiresAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </KV>
          </div>
        </section>
      ) : (
        monthlyPlan &&
        fullUser && (
          <section>
            <div className="mb-6">
              <div className="eyebrow mb-2">
                <span data-bi lang="ta">வாசிக்கத் தொடங்குங்கள் · Start reading</span>
                <span data-bi lang="en">Start reading</span>
              </div>
              <h2 className="ta-display text-burgundy" style={{ fontSize: 30 }}>
                <span data-bi lang="ta">முழு நூலகத்துக்கு அணுகல்</span>
                <span data-bi lang="en">Unlock the whole library</span>
              </h2>
              <p
                className="text-ink-2 mt-2"
                style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.6 }}
              >
                {subscription?.status === "EXPIRED" ? (
                  <>
                    <span data-bi lang="ta">
                      உங்கள் சந்தா {subscription.expiresAt.toLocaleDateString()} அன்று காலாவதியானது. தொடர புதுப்பிக்கவும்.
                    </span>
                    <span data-bi lang="en">
                      Your subscription expired on {subscription.expiresAt.toLocaleDateString()}. Renew to continue reading.
                    </span>
                  </>
                ) : (
                  <>
                    <span data-bi lang="ta">தமிழ் இலக்கியத்தின் சிறந்த படைப்புகளை அணுக சந்தா செலுத்தவும்.</span>
                    <span data-bi lang="en">Subscribe to access the best of Tamil literature.</span>
                  </>
                )}
              </p>
            </div>

            <div className="max-w-md">
              <SubscribePricingCard
                user={{ name: fullUser.name, email: fullUser.email, phone: fullUser.phone }}
                plan={{
                  slug: monthlyPlan.slug,
                  priceInr: monthlyPlan.priceInr.toString(),
                  durationDays: monthlyPlan.durationDays,
                  nameTamil: monthlyPlan.nameTamil,
                  nameEnglish: monthlyPlan.nameEnglish,
                }}
              />
            </div>
          </section>
        )
      )}

      {/* Payment history */}
      <section className="frame" style={{ padding: 28 }}>
        <div className="eyebrow mb-4">
          <span data-bi lang="ta">கட்டண வரலாறு · Payment history</span>
          <span data-bi lang="en">Payment history</span>
        </div>
        {payments.length === 0 ? (
          <p className="text-ink-2" style={{ fontSize: 14 }}>
            <span data-bi lang="ta">கட்டண பதிவுகள் இல்லை.</span>
            <span data-bi lang="en">No payments yet.</span>
          </p>
        ) : (
          <ul className="divide-y divide-border-warm">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p
                    className="text-ink"
                    style={{ fontFamily: "var(--font-display)", fontSize: 14 }}
                  >
                    {p.plan?.nameEnglish ?? "—"} ·{" "}
                    <span
                      className={
                        p.status === "PAID"
                          ? "text-peacock"
                          : p.status === "REFUNDED"
                            ? "text-gold"
                            : "text-kumkum"
                      }
                    >
                      {p.status}
                    </span>
                  </p>
                  <p className="eyebrow eyebrow-sm mt-1">
                    {p.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-ink" style={{ fontFamily: "var(--font-display)", fontSize: 17, fontVariantNumeric: "tabular-nums" }}>
                  ₹{p.netAmount.toString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function KV({
  label,
  children,
}: {
  label: { ta: string; en: string };
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow eyebrow-sm mb-1">
        <span data-bi lang="ta">{label.ta}</span>
        <span data-bi lang="en">{label.en}</span>
      </div>
      <div className="text-ink" style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>
        {children}
      </div>
    </div>
  );
}
