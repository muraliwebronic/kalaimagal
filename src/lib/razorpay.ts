import "server-only";
import Razorpay from "razorpay";
import { createHmac } from "node:crypto";

/**
 * Razorpay server-side client + signature helpers.
 *
 * Phase 1 uses **test mode** end-to-end. The keys live in .env.local
 * (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET / RAZORPAY_WEBHOOK_SECRET).
 *
 * We use the Orders API only (not the Subscriptions API) per the locked
 * decision in task.md — manual 30-day renewal, no auto-recurring.
 */

let cached: Razorpay | null = null;

export function razorpay(): Razorpay {
  if (cached) return cached;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set");
  }
  cached = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return cached;
}

/**
 * Verify the HMAC signature on the checkout return payload (client →
 * /api/payment/verify). Razorpay docs:
 *   expected = HMAC_SHA256(`${orderId}|${paymentId}`, KEY_SECRET)
 *   match expected === razorpay_signature
 */
export function verifyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return timingSafeEquals(expected, input.signature);
}

/**
 * Verify the X-Razorpay-Signature header on a webhook POST.
 * Compute HMAC_SHA256(rawBody, WEBHOOK_SECRET) and compare.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay] RAZORPAY_WEBHOOK_SECRET is not set — rejecting all webhooks");
    return false;
  }
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEquals(expected, signature);
}

function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Build a deterministic receipt id for a Razorpay order. */
export function buildReceipt(userId: number, planSlug: string): string {
  const ts = Date.now().toString(36);
  return `klm-${userId}-${planSlug}-${ts}`.slice(0, 40);
}
