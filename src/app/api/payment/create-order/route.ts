import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, getRequestIpAndUa } from "@/lib/auth";
import { razorpay, buildReceipt } from "@/lib/razorpay";

const Schema = z.object({
  planSlug: z.string().trim().min(1).default("monthly"),
  couponCode: z.string().trim().toUpperCase().optional(),
});

/**
 * POST /api/payment/create-order
 *
 * 1. Require an authenticated user
 * 2. Look up the requested SubscriptionPlan
 * 3. Optionally apply a Coupon (validates code + expiry + per-user limit)
 * 4. Create a Razorpay Order via the Orders API
 * 5. Insert a Payment row in CREATED state
 * 6. Return { orderId, amount, currency, keyId } for the Razorpay checkout
 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to subscribe" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const parsed = Schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { planSlug, couponCode } = parsed.data;

  // 2. Plan
  const plan = await prisma.subscriptionPlan.findUnique({ where: { slug: planSlug } });
  if (!plan || !plan.isActive) {
    return NextResponse.json({ error: "Plan unavailable" }, { status: 404 });
  }

  // 3. Coupon (optional)
  const subtotal = Number(plan.priceInr);
  let discount = 0;
  let coupon: { id: number; code: string } | null = null;

  if (couponCode) {
    const row = await prisma.coupon.findUnique({ where: { code: couponCode } });
    const now = new Date();
    if (
      !row ||
      !row.isActive ||
      (row.validUntil && row.validUntil < now) ||
      row.validFrom > now ||
      (row.maxUses !== null && row.usedCount >= row.maxUses)
    ) {
      return NextResponse.json({ error: "Coupon is invalid or expired" }, { status: 400 });
    }

    // Per-user limit
    const myUses = await prisma.couponUsage.count({
      where: { couponId: row.id, userId: user.id },
    });
    if (myUses >= row.perUserLimit) {
      return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
    }

    if (row.type === "PERCENTAGE") {
      discount = (subtotal * Number(row.value)) / 100;
    } else {
      discount = Number(row.value);
    }
    discount = Math.min(discount, subtotal);
    coupon = { id: row.id, code: row.code };
  }

  const netAmount = +(subtotal - discount).toFixed(2);
  if (netAmount < 1) {
    return NextResponse.json({ error: "Amount must be at least ₹1" }, { status: 400 });
  }
  const amountPaise = Math.round(netAmount * 100);

  // 4. Razorpay order (paise)
  let order;
  try {
    order = await razorpay().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: buildReceipt(user.id, plan.slug),
      notes: {
        userId: String(user.id),
        planSlug: plan.slug,
        couponCode: coupon?.code ?? "",
      },
    });
  } catch (e) {
    console.error("razorpay order create failed:", e);
    return NextResponse.json({ error: "Payment provider error" }, { status: 502 });
  }

  // 5. Payment row in CREATED state
  const { ip } = await getRequestIpAndUa();
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      planId: plan.id,
      couponId: coupon?.id ?? null,
      razorpayOrderId: order.id,
      amount: plan.priceInr,
      discountAmount: discount,
      netAmount,
      currency: "INR",
      status: "CREATED",
      ipAddress: ip,
    },
    select: { id: true },
  });

  return NextResponse.json({
    paymentId: payment.id,
    orderId: order.id,
    amount: amountPaise,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    plan: {
      slug: plan.slug,
      nameEnglish: plan.nameEnglish,
      nameTamil: plan.nameTamil,
      priceInr: plan.priceInr.toString(),
      durationDays: plan.durationDays,
    },
    discountAmount: discount,
    netAmount,
  });
}
