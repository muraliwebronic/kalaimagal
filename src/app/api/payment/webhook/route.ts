import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { sendEmail, emailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface WebhookEnvelope {
  event: string;
  payload?: {
    payment?: { entity?: PaymentEntity };
    order?: { entity?: { id: string } };
  };
  created_at?: number;
}

interface PaymentEntity {
  id: string;
  order_id: string;
  amount: number; // paise
  currency: string;
  status: string;
  method?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, string>;
  error_code?: string;
  error_description?: string;
  captured?: boolean;
}

/**
 * POST /api/payment/webhook
 *
 * Razorpay → us. Verify HMAC, dedup via WebhookLog (unique on
 * (source, eventId)), then handle the event. We care about payment.captured
 * for v1 — that's when we extend / create the Subscription row.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let envelope: WebhookEnvelope;
  try {
    envelope = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId =
    envelope.payload?.payment?.entity?.id ??
    envelope.payload?.order?.entity?.id ??
    null;

  // Dedup — WebhookLog unique on (source, eventId)
  try {
    await prisma.webhookLog.create({
      data: {
        source: "RAZORPAY",
        eventType: envelope.event,
        eventId: eventId,
        payload: envelope as unknown as Prisma.InputJsonValue,
        signature,
        status: "RECEIVED",
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // We've already seen this event id → idempotent ack
      return NextResponse.json({ ok: true, duplicate: true });
    }
    throw e;
  }

  // Dispatch
  try {
    if (envelope.event === "payment.captured") {
      await handlePaymentCaptured(envelope.payload?.payment?.entity);
    } else if (envelope.event === "payment.failed") {
      await handlePaymentFailed(envelope.payload?.payment?.entity);
    }
    // Mark log processed
    if (eventId) {
      await prisma.webhookLog.updateMany({
        where: { source: "RAZORPAY", eventId },
        data: { status: "PROCESSED", processedAt: new Date() },
      });
    }
  } catch (e) {
    console.error("[razorpay webhook] handler failed:", e);
    if (eventId) {
      await prisma.webhookLog.updateMany({
        where: { source: "RAZORPAY", eventId },
        data: {
          status: "FAILED",
          processedAt: new Date(),
          errorMessage: e instanceof Error ? e.message : String(e),
        },
      });
    }
    // Still return 200 — Razorpay retries on non-2xx; we have the log row.
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ ok: true });
}

async function handlePaymentCaptured(entity?: PaymentEntity) {
  if (!entity) return;

  // Find the Payment row we created when the order was placed
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: entity.order_id },
    include: { plan: true, user: true },
  });

  if (!payment) {
    console.warn(`[razorpay webhook] no Payment row for order ${entity.order_id}`);
    return;
  }
  if (payment.status === "PAID") {
    // Already activated via /api/payment/verify (client side) — idempotent
    return;
  }
  if (!payment.plan) {
    console.warn(`[razorpay webhook] Payment ${payment.id} has no plan`);
    return;
  }

  await activateSubscription({
    paymentId: payment.id,
    razorpayPaymentId: entity.id,
    method: entity.method,
    userId: payment.userId,
    planId: payment.plan.id,
    durationDays: payment.plan.durationDays,
    couponId: payment.couponId,
  });

  // Welcome email
  const expiresAt = new Date(Date.now() + payment.plan.durationDays * 86_400_000);
  const tpl = emailTemplates.welcomeAfterPayment(payment.user.name, expiresAt);
  await sendEmail({
    to: payment.user.email,
    emailType: "welcome-paid",
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    userId: payment.userId,
  });
}

async function handlePaymentFailed(entity?: PaymentEntity) {
  if (!entity) return;
  await prisma.payment.updateMany({
    where: { razorpayOrderId: entity.order_id, status: { not: "PAID" } },
    data: {
      status: "FAILED",
      razorpayPaymentId: entity.id,
      failureReason: entity.error_description ?? entity.error_code ?? null,
    },
  });
}

/** Idempotent activate-and-link helper, shared with /api/payment/verify. */
export async function activateSubscription(args: {
  paymentId: number;
  razorpayPaymentId: string;
  method?: string;
  userId: number;
  planId: number;
  durationDays: number;
  couponId: number | null;
}): Promise<void> {
  const now = new Date();
  const newExpiry = new Date(now.getTime() + args.durationDays * 86_400_000);

  await prisma.$transaction(async (tx) => {
    // 1. Mark payment PAID
    await tx.payment.update({
      where: { id: args.paymentId },
      data: {
        status: "PAID",
        razorpayPaymentId: args.razorpayPaymentId,
        paymentMethod: normalizeMethod(args.method),
        paidAt: now,
      },
    });

    // 2. Extend existing active subscription, else create new
    const existing = await tx.subscription.findFirst({
      where: { userId: args.userId, expiresAt: { gt: now } },
      orderBy: { expiresAt: "desc" },
    });

    let subscriptionId: number;
    if (existing) {
      const updated = await tx.subscription.update({
        where: { id: existing.id },
        data: {
          status: "ACTIVE",
          expiresAt: new Date(existing.expiresAt.getTime() + args.durationDays * 86_400_000),
          lastPaymentId: args.paymentId,
          planId: args.planId,
        },
      });
      subscriptionId = updated.id;
    } else {
      const created = await tx.subscription.create({
        data: {
          userId: args.userId,
          planId: args.planId,
          startedAt: now,
          expiresAt: newExpiry,
          status: "ACTIVE",
          lastPaymentId: args.paymentId,
        },
      });
      subscriptionId = created.id;
    }

    // 3. Link payment → subscription
    await tx.payment.update({
      where: { id: args.paymentId },
      data: { subscriptionId },
    });

    // 4. Coupon usage row + bump counter
    if (args.couponId) {
      const payment = await tx.payment.findUnique({
        where: { id: args.paymentId },
        select: { discountAmount: true },
      });
      await tx.couponUsage.create({
        data: {
          couponId: args.couponId,
          userId: args.userId,
          paymentId: args.paymentId,
          discountApplied: payment?.discountAmount ?? "0",
        },
      });
      await tx.coupon.update({
        where: { id: args.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }
  });
}

function normalizeMethod(m?: string): "CARD" | "UPI" | "NETBANKING" | "WALLET" | "EMI" | undefined {
  if (!m) return undefined;
  const upper = m.toUpperCase();
  if (upper === "CARD" || upper === "UPI" || upper === "NETBANKING" || upper === "WALLET" || upper === "EMI") {
    return upper;
  }
  return undefined;
}
