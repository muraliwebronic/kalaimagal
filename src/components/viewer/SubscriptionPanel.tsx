"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionPanelProps {
  titleTamil: string;
  titleEnglish?: string | null;
  authorNameTamil?: string | null;
  priceInr?: number;
  isLoggedIn: boolean;
  /** Where to send the user — /register if anon, /account/subscription if logged in. */
  ctaHref?: string;
}

/**
 * Slide-up paywall panel. Appears over PreviewBlur when a non-subscriber
 * tries to read past the free-page limit.
 */
export function SubscriptionPanel({
  titleTamil,
  titleEnglish,
  authorNameTamil,
  priceInr = 99,
  isLoggedIn,
  ctaHref,
}: SubscriptionPanelProps) {
  const href = ctaHref ?? (isLoggedIn ? "/account/subscription" : "/register");

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 md:pb-8 animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-xl">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            <span lang="ta">முழுவதையும் வாசிக்க</span>
            <span className="ml-1.5 italic">/ Continue reading</span>
          </p>
          <h3 lang="ta" className="font-heading text-2xl md:text-3xl tracking-tight">
            {titleTamil}
          </h3>
          {(titleEnglish || authorNameTamil) && (
            <p className="text-sm text-muted-foreground">
              {authorNameTamil && <span lang="ta">{authorNameTamil}</span>}
              {authorNameTamil && titleEnglish && <span className="mx-2">·</span>}
              {titleEnglish && <span lang="en" className="italic">{titleEnglish}</span>}
            </p>
          )}
          <p lang="ta" className="text-sm text-muted-foreground leading-relaxed pt-2">
            மாதம் ₹{priceInr} — அனைத்து புத்தகங்கள் + கட்டுரைகள், வரம்பற்ற அணுகல்.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={href}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              ₹{priceInr} / month — சந்தா செலுத்து
            </Link>
            {!isLoggedIn && (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <span lang="ta">உள்நுழைய</span>
                <span className="ml-1.5 text-xs text-muted-foreground">/ Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
