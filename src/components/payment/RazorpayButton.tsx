"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayCheckoutResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayCtor {
  new (options: RazorpayOptions): { open: () => void };
}

declare global {
  interface Window {
    Razorpay?: RazorpayCtor;
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

async function ensureRazorpayLoaded(): Promise<RazorpayCtor> {
  if (typeof window === "undefined") {
    throw new Error("Razorpay can only be loaded in the browser");
  }
  if (window.Razorpay) return window.Razorpay;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Razorpay script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Razorpay script failed"));
    document.head.appendChild(s);
  });
  if (!window.Razorpay) throw new Error("Razorpay constructor missing after load");
  return window.Razorpay;
}

interface RazorpayButtonProps {
  planSlug?: string;
  couponCode?: string;
  /** Where to navigate after a successful payment. Default: /account/subscription?welcome=1 */
  successHref?: string;
  /** Override CTA label */
  label?: string;
  /** Pre-fill the checkout from the current user — pass these from the server. */
  user: { name: string; email: string; phone?: string | null };
  className?: string;
  size?: "default" | "lg" | "sm";
}

export function RazorpayButton({
  planSlug = "monthly",
  couponCode,
  successHref = "/account/subscription?welcome=1",
  label = "Subscribe",
  user,
  className,
  size = "lg",
}: RazorpayButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);

    // 1. Create order on the server
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug, couponCode }),
    });
    const orderData = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok) {
      setError(orderData.error ?? "Could not start payment");
      setBusy(false);
      return;
    }

    // 2. Open the Razorpay checkout modal
    let Razorpay: RazorpayCtor;
    try {
      Razorpay = await ensureRazorpayLoaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load checkout");
      setBusy(false);
      return;
    }

    const rzp = new Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Kalaimagal · கலைமகள்",
      description: orderData.plan?.nameEnglish ?? "Subscription",
      order_id: orderData.orderId,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone ?? undefined,
      },
      notes: { planSlug },
      theme: { color: "#7A1F2B" },
      modal: {
        ondismiss: () => setBusy(false),
      },
      handler: async (response) => {
        // 3. Verify payment server-side. The webhook will also fire and
        //    is idempotent — first one wins.
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok) {
          setError(verifyData.error ?? "Payment verification failed");
          setBusy(false);
          return;
        }
        // Hard navigation so server components re-read the new subscription
        window.location.href = successHref;
      },
    });
    rzp.open();
  }

  return (
    <div className={className}>
      <Button onClick={onClick} disabled={busy} size={size}>
        {busy ? "Opening checkout…" : label}
      </Button>
      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
