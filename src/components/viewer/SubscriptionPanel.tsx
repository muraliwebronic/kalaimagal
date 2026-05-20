"use client";

import Link from "next/link";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

interface SubscriptionPanelProps {
  titleTamil: string;
  titleEnglish?: string | null;
  authorNameTamil?: string | null;
  priceInr?: number;
  isLoggedIn: boolean;
  user?: { name: string; email: string; phone?: string | null } | null;
}

/**
 * Slide-up paywall panel that appears over the blurred preview page when
 * a non-subscriber views a premium book past the free limit.
 *
 * Editorial framed treatment: manuscript paper with burgundy/gold accents,
 * traditional divider, primary subscribe CTA.
 */
export function SubscriptionPanel({
  titleTamil,
  titleEnglish,
  authorNameTamil,
  priceInr = 99,
  isLoggedIn,
  user,
}: SubscriptionPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 md:pb-8 animate-in slide-in-from-bottom duration-300">
      <div
        className="mx-auto max-w-xl frame frame-burgundy p-6 md:p-10 text-center"
        style={{ background: "var(--paper)" }}
      >
        <div className="eyebrow mb-4">
          <span data-bi lang="ta">முழுவதையும் வாசிக்க</span>
          <span data-bi lang="en">Continue reading</span>
        </div>

        <h3
          lang="ta"
          className="ta-display text-burgundy"
          style={{ fontSize: 28, lineHeight: 1.2 }}
        >
          {titleTamil}
        </h3>
        {titleEnglish && (
          <p
            lang="en"
            className="text-ink-2 mt-2"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16 }}
          >
            {titleEnglish}
          </p>
        )}
        {authorNameTamil && (
          <p lang="ta" className="ta text-ink-3 text-sm mt-2">
            {authorNameTamil}
          </p>
        )}

        <hr className="my-5 border-border-warm" />

        <p
          className="text-ink-2"
          style={{ fontFamily: "var(--font-display)", fontSize: 16, lineHeight: 1.55 }}
        >
          <span data-bi lang="ta">
            மாதம் ₹{priceInr} — அனைத்து புத்தகங்கள், கட்டுரைகள், வரம்பற்ற வாசிப்பு.
          </span>
          <span data-bi lang="en">
            ₹{priceInr}/month — unlimited reading across all books and articles.
          </span>
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {isLoggedIn && user ? (
            <RazorpayButton
              user={user}
              label={`₹${priceInr}/மாதம் · Subscribe`}
              successHref="/account/subscription?welcome=1"
            />
          ) : (
            <>
              <Link href="/register?next=/account/subscription" className="btn btn-primary">
                <span data-bi lang="ta">₹{priceInr}/மாதம் சேர்</span>
                <span data-bi lang="en">Subscribe ₹{priceInr}/mo</span>
              </Link>
              <Link href="/login" className="btn btn-ghost">
                <span data-bi lang="ta">உள்நுழை</span>
                <span data-bi lang="en">Sign in</span>
              </Link>
            </>
          )}
        </div>

        <p
          className="mt-3 text-ink-3"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 11 }}
        >
          UPI · Cards · Net Banking · Razorpay
        </p>
      </div>
    </div>
  );
}
