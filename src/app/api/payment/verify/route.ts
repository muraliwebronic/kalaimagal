import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { activateSubscription } from "../webhook/route";

const Schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * POST /api/payment/verify
 *
 * Client-side handler after Razorpay checkout closes successfully. This
 * runs in parallel with the webhook and is idempotent — whichever arrives
 * first activates the subscription, the other becomes a no-op.
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  // 1. HMAC signature check
  if (
    !verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })
  ) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  // 2. Look up the Payment row
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: razorpay_order_id, userId: user.id },
    include: { plan: true },
  });
  if (!payment) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }
  if (payment.status === "PAID") {
    return NextResponse.json({ ok: true, alreadyActive: true });
  }
  if (!payment.plan) {
    return NextResponse.json({ error: "Plan missing on payment" }, { status: 500 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpaySignature: razorpay_signature },
  });

  await activateSubscription({
    paymentId: payment.id,
    razorpayPaymentId: razorpay_payment_id,
    userId: payment.userId,
    planId: payment.plan.id,
    durationDays: payment.plan.durationDays,
    couponId: payment.couponId,
  });

  return NextResponse.json({ ok: true });
}
