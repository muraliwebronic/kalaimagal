import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LogoutButton } from "./LogoutButton";

export const metadata = { title: "சுயவிவரம் — Profile" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { welcome } = await searchParams;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE", expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "desc" },
    include: { plan: true },
  });

  return (
    <div className="flex flex-col gap-6">
      {welcome && (
        <div
          className="frame frame-burgundy"
          style={{ padding: "20px 24px", background: "var(--paper)" }}
        >
          <p lang="ta" className="ta-display text-burgundy" style={{ fontSize: 18 }}>
            <span data-bi lang="ta">வரவேற்கிறோம், {user.name}.</span>
            <span data-bi lang="en">Welcome, {user.name}.</span>
          </p>
          <p
            className="text-ink-2 mt-1"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
          >
            <span data-bi lang="ta">உங்கள் மின்னஞ்சலை உறுதிப்படுத்த இணைப்பு அனுப்பப்பட்டது.</span>
            <span data-bi lang="en">A verification link has been sent to your inbox.</span>
          </p>
        </div>
      )}

      {/* Profile snapshot */}
      <section className="frame" style={{ padding: 28 }}>
        <div className="eyebrow mb-3.5">
          <span data-bi lang="ta">விவரம் · Details</span>
          <span data-bi lang="en">Account details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <KV label={{ ta: "பெயர்", en: "Name" }}>{user.name}</KV>
          <KV label={{ ta: "மின்னஞ்சல்", en: "Email" }}>{user.email}</KV>
          <KV label={{ ta: "பங்கு", en: "Role" }}>
            <span className="badge-km">{user.role}</span>
          </KV>
          <KV label={{ ta: "உறுதி", en: "Email verified" }}>
            {user.emailVerifiedAt ? (
              <span className="badge-km badge-km-free">
                <span data-bi lang="ta">உறுதியானது</span>
                <span data-bi lang="en">Verified</span>
              </span>
            ) : (
              <span className="badge-km badge-km-gold">
                <span data-bi lang="ta">நிலுவையில்</span>
                <span data-bi lang="en">Pending</span>
              </span>
            )}
          </KV>
        </div>
      </section>

      {/* Subscription summary */}
      <section className="frame" style={{ padding: 28 }}>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="eyebrow">
            <span data-bi lang="ta">சந்தா · Subscription</span>
            <span data-bi lang="en">Subscription</span>
          </div>
          {subscription && (
            <span className="badge-km badge-km-free">
              <span data-bi lang="ta">செயலில்</span>
              <span data-bi lang="en">Active</span>
            </span>
          )}
        </div>

        {subscription ? (
          <div>
            <p lang="ta" className="ta-display text-ink" style={{ fontSize: 22 }}>
              {subscription.plan.nameTamil}
            </p>
            <p
              className="text-ink-3"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14, marginTop: 4 }}
            >
              {subscription.plan.nameEnglish}
            </p>
            <hr className="my-4 border-border-warm" />
            <p
              className="text-ink-2"
              style={{ fontFamily: "var(--font-display)", fontSize: 14 }}
            >
              ₹{subscription.plan.priceInr.toString()} every {subscription.plan.durationDays} days
              <span style={{ color: "var(--gold)", margin: "0 10px" }}>·</span>
              <span data-bi lang="ta">செல்லுபடியாகும் வரை: {subscription.expiresAt.toLocaleDateString()}</span>
              <span data-bi lang="en">Active until: {subscription.expiresAt.toLocaleDateString()}</span>
            </p>
          </div>
        ) : (
          <p className="text-ink-2" style={{ fontSize: 14 }}>
            <span data-bi lang="ta">இப்போது சந்தா எதுவும் இல்லை. </span>
            <span data-bi lang="en">No active subscription. </span>
            <a
              href="/account/subscription"
              className="text-burgundy hover:text-kumkum"
              style={{ borderBottom: "1px solid currentColor" }}
            >
              <span data-bi lang="ta">சந்தா திட்டத்தைப் பார்</span>
              <span data-bi lang="en">View plans</span>
            </a>
          </p>
        )}
      </section>

      <div className="pt-2">
        <LogoutButton />
      </div>
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
