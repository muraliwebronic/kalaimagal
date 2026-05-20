"use client";

/**
 * Progressive blur overlay shown over the last visible page when a
 * non-subscriber hits the paywall. The page underneath still renders
 * (so they see *something* exists past the gate), but it's unreadable.
 *
 * The actual paywall (with title/author/CTA) is rendered separately in
 * SubscriptionPanel.tsx on top of this.
 */
export function PreviewBlur() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] backdrop-blur-md" />
    </div>
  );
}
