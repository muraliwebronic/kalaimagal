import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

interface SubscribePricingCardProps {
  /** Logged-in user info for Razorpay pre-fill. null = anon → CTA routes to /register */
  user: { name: string; email: string; phone?: string | null } | null;
  plan: {
    slug: string;
    priceInr: string;            // "99.00" string from Prisma Decimal
    durationDays: number;
    nameTamil: string;
    nameEnglish: string;
  };
  /** Where to land after successful payment. Default: /account/subscription?welcome=1 */
  successHref?: string;
  /** Show the "FEATURED" sash + accent ring. */
  featured?: boolean;
  /** Visual variant: 'full' = standalone card, 'compact' = embedded in a section */
  variant?: "full" | "compact";
}

const FEATURES = [
  {
    ta: "அனைத்து புத்தகங்களுக்கும் வரம்பற்ற அணுகல்",
    en: "Unlimited access to all books",
  },
  {
    ta: "முதன்மை கட்டுரைகள் அனைத்தும்",
    en: "All premium articles included",
  },
  {
    ta: "மொபைல் + டெஸ்க்டாப் வாசிப்பு",
    en: "Mobile + desktop reading",
  },
  {
    ta: "எப்போது வேண்டுமானாலும் ரத்து செய்யலாம்",
    en: "Cancel anytime — no questions",
  },
];

export function SubscribePricingCard({
  user,
  plan,
  successHref = "/account/subscription?welcome=1",
  featured = true,
  variant = "full",
}: SubscribePricingCardProps) {
  const price = Math.round(Number(plan.priceInr));
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        featured && "ring-1 ring-primary/30 shadow-lg",
        isCompact ? "p-6 md:p-8" : "p-8 md:p-10",
      )}
    >
      {featured && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
          <Sparkles className="size-3" />
          <span data-bi lang="ta">பரிந்துரை</span>
          <span data-bi lang="en">Recommended</span>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          <span data-bi lang="ta">திட்டம்</span>
          <span data-bi lang="en">Plan</span>
        </p>
        <h3 className="mt-1 font-heading text-2xl md:text-3xl tracking-tight">
          <span data-bi lang="ta">{plan.nameTamil}</span>
          <span data-bi lang="en">{plan.nameEnglish}</span>
        </h3>
      </div>

      {/* Price */}
      <div className="mb-6 flex items-baseline gap-2">
        <span className="font-heading text-5xl md:text-6xl tracking-tight text-primary tabular-nums">
          ₹{price}
        </span>
        <span className="text-base text-muted-foreground">
          <span data-bi lang="ta">/ {plan.durationDays} நாட்கள்</span>
          <span data-bi lang="en">/ {plan.durationDays} days</span>
        </span>
      </div>

      {/* Features */}
      <ul className="mb-8 space-y-3">
        {FEATURES.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 grid place-items-center size-5 shrink-0 rounded-full bg-primary/10 text-primary">
              <Check className="size-3" />
            </span>
            <span>
              <span data-bi lang="ta">{f.ta}</span>
              <span data-bi lang="en">{f.en}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {user ? (
        <RazorpayButton
          user={user}
          planSlug={plan.slug}
          successHref={successHref}
          className="w-full [&_button]:w-full"
          label={`₹${price} / month — Subscribe`}
        />
      ) : (
        <Link
          href={`/register?next=${encodeURIComponent("/account/subscription")}`}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          <span data-bi lang="ta">பதிவு செய்து சந்தா செலுத்து</span>
          <span data-bi lang="en">Register to subscribe</span>
        </Link>
      )}

      {/* Fine print */}
      <p className="mt-4 text-center text-xs text-muted-foreground leading-relaxed">
        <span data-bi lang="ta">
          பாதுகாப்பான கட்டணம் · Razorpay UPI / கார்டு / நெட்பேங்கிங்
        </span>
        <span data-bi lang="en">
          Secure checkout · Razorpay UPI / card / net-banking
        </span>
      </p>
    </Card>
  );
}
