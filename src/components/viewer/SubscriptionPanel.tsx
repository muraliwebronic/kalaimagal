"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

interface SubscriptionPanelProps {
  titleTamil: string;
  titleEnglish?: string | null;
  authorNameTamil?: string | null;
  priceInr?: number;
  isLoggedIn: boolean;
  /**
   * Logged-in user info needed to pre-fill the Razorpay checkout. Required
   * when isLoggedIn=true — anonymous viewers are sent to /register first.
   */
  user?: { name: string; email: string; phone?: string | null } | null;
}

/**
 * Slide-up paywall panel. Appears over PreviewBlur when a non-subscriber
 * tries to read past the free-page limit.
 *
 * Logged-in viewers: opens Razorpay checkout directly inside the panel.
 * Anonymous viewers: routed to /register first (they need an account).
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
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-xl">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            <span data-bi lang="ta">முழுவதையும் வாசிக்க</span>
            <span data-bi lang="en">Continue reading</span>
          </p>
          {titleEnglish ? (
            <>
              <h3 data-bi lang="ta" className="font-heading text-2xl md:text-3xl tracking-tight">
                {titleTamil}
              </h3>
              <h3 data-bi lang="en" className="font-heading text-2xl md:text-3xl tracking-tight">
                {titleEnglish}
              </h3>
            </>
          ) : (
            <h3 lang="ta" className="font-heading text-2xl md:text-3xl tracking-tight">
              {titleTamil}
            </h3>
          )}
          {authorNameTamil && (
            <p lang="ta" className="text-sm text-muted-foreground">{authorNameTamil}</p>
          )}
          <p data-bi lang="ta" className="text-sm text-muted-foreground leading-relaxed pt-2">
            மாதம் ₹{priceInr} — அனைத்து புத்தகங்கள் + கட்டுரைகள், வரம்பற்ற அணுகல்.
          </p>
          <p data-bi lang="en" className="text-sm text-muted-foreground leading-relaxed pt-2">
            ₹{priceInr}/month — unlimited access to all books and articles.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            {isLoggedIn && user ? (
              <RazorpayButton
                user={user}
                label={`₹${priceInr} / month — சந்தா செலுத்து`}
                successHref="/account/subscription?welcome=1"
              />
            ) : (
              <>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  ₹{priceInr} / month — சந்தா செலுத்து
                </Link>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <span lang="ta">உள்நுழைய</span>
                  <span className="ml-1.5 text-xs text-muted-foreground">/ Login</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
