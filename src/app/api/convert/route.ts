import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { storage, storageKeys } from "@/lib/storage";
import {
  renderPdfPageToBaseWebp,
  applyWatermarkToWebp,
} from "@/lib/pdf-render";
import { COOKIE_ACCESS, verifyAccessToken } from "@/lib/auth";
import { checkLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  doc_id: z.string().min(1),
  page: z.coerce.number().int().min(1).max(10000),
  /** Optional JWT for clients that can't send cookies (e.g., img-tag fallback). */
  token: z.string().optional(),
});

const FREE_PAGE_LIMIT = 2;

/**
 * GET /api/convert?doc_id=<contentId>&page=<n>
 *
 * Streams a WebP for the requested PDF page. Enforces:
 *   1. Origin/Referer must match NEXT_PUBLIC_APP_URL
 *   2. JWT must be valid (cookie OR ?token=)
 *   3. If content.isPremium AND user has no ACTIVE Subscription:
 *      page > FREE_PAGE_LIMIT → HTTP 403
 *   4. Per-user rate limit: 60/min
 *
 * Caches each rendered page in storage/cache/{docId}/page_{n}.webp.
 * Subsequent hits stream the cached buffer.
 */
export async function GET(req: Request) {
  // --- 1. Origin / Referer check ----------------------------------------
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");
  const isDev = process.env.NODE_ENV === "development";

  let sameOrigin = false;
  if (!origin && !referer) {
    sameOrigin = true; // Allow direct access or strict policies that strip these
  } else {
    if (origin && (origin === appUrl || (isDev && host && origin.includes(host)))) {
      sameOrigin = true;
    }
    if (referer && (referer.startsWith(appUrl) || (isDev && host && referer.includes(host)))) {
      sameOrigin = true;
    }
  }

  if (!sameOrigin) {
    return new NextResponse("Forbidden (origin)", { status: 403 });
  }

  // --- 2. Query validation ----------------------------------------------
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { doc_id: docId, page, token: queryToken } = parsed.data;

  // --- 3. Auth: cookie token preferred, ?token= fallback ----------------
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_ACCESS)?.value;
  const rawToken = cookieToken ?? queryToken;
  let userId: number | null = null;
  let userRole: string | null = null;
  if (rawToken) {
    const claims = await verifyAccessToken(rawToken);
    if (claims) {
      userId = Number(claims.sub);
      userRole = claims.role;
    }
  }
  const isStaff =
    userRole === "EDITOR" || userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  // --- 4. Rate limit (anonymous users keyed by IP) ----------------------
  const ip = getClientIp(req);
  const limit = checkLimit("convert", userId ? `u${userId}` : `ip:${ip}`);
  if (!limit.allowed) {
    return new NextResponse("Rate limited", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) },
    });
  }

  // --- 5. Look up content + check tier ----------------------------------
  // Treat doc_id as numeric (Content.id) — admin upload + cover URL both
  // use this. Slug-based lookup added later if needed.
  const contentId = Number(docId);
  if (!Number.isFinite(contentId)) {
    return new NextResponse("Bad doc_id", { status: 400 });
  }

  const content = await prisma.content.findFirst({
    where: {
      id: contentId,
      type: "PDF",
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: {
      id: true,
      isPremium: true,
      filePath: true,
      pageCount: true,
    },
  });

  if (!content || !content.filePath) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (content.pageCount && page > content.pageCount) {
    return new NextResponse("Page out of range", { status: 404 });
  }

  // --- 6. Tier check: premium + no paid access + page > free limit → 403
  // Paid access = active Subscription row OR admin/editor staff role
  // (staff bypass the paywall — they're internal users, not customers).
  // Watermark text is the subscriber's name + email so leaks are traceable.
  // Phone is deliberately excluded — email already identifies the account.
  let hasPaidAccess = false;
  let watermarkText = "PREVIEW";
  if (userId) {
    const [activeSub, user] = await Promise.all([
      isStaff
        ? Promise.resolve(null)
        : prisma.subscription.findFirst({
            where: { userId, status: "ACTIVE", expiresAt: { gt: new Date() } },
            select: { id: true },
          }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
    ]);
    if (isStaff || activeSub) {
      hasPaidAccess = true;
      const name = user?.name?.trim();
      const email = user?.email?.trim();
      watermarkText =
        name && email ? `${name} · ${email}` : email ?? name ?? "Kalaimagal";
    }
  }
  if (content.isPremium && !hasPaidAccess && page > FREE_PAGE_LIMIT) {
    return new NextResponse("Subscription required", { status: 403 });
  }

  // --- 7. Layered cache -------------------------------------------------
  // Layer B (output): shared PREVIEW renders are cached for non-subscribers.
  // Subscriber output is never persisted — the watermark carries PII.
  const docKey = String(content.id);
  const previewKey = storageKeys.previewPage(docKey, page);
  if (!hasPaidAccess) {
    const cached = await storage().get(previewKey);
    if (cached) {
      return new NextResponse(new Uint8Array(cached), {
        status: 200,
        headers: cacheHeaders(),
      });
    }
  }

  // Layer A (base): pre-rendered by the upload cron. If present, skip the
  // heavy pdfjs/canvas rasterise step entirely — just composite the watermark.
  const baseKey = storageKeys.baseRaster(docKey, page);
  let baseWebp = await storage().get(baseKey);

  if (!baseWebp) {
    // Cron hasn't reached this page yet (or it's a legacy book uploaded
    // before the queue existed). Render on-demand and persist for next time.
    const pdfBuffer = await storage().get(content.filePath);
    if (!pdfBuffer) {
      console.error(`PDF missing at key ${content.filePath} for content ${content.id}`);
      return new NextResponse("PDF asset missing", { status: 500 });
    }
    baseWebp = await renderPdfPageToBaseWebp({ pdfBuffer, page, scale: 2.0 });
    // Fire-and-forget persist; failure to cache shouldn't block response.
    storage()
      .put(baseKey, baseWebp, "image/webp")
      .catch((e) => console.error("base cache put failed:", e));
  }

  // Apply the per-tier watermark (cheap: ~50–100ms vs ~1500ms full render).
  const webp = await applyWatermarkToWebp(baseWebp, watermarkText);

  if (!hasPaidAccess) {
    storage()
      .put(previewKey, webp, "image/webp")
      .catch((e) => console.error("preview cache put failed:", e));
  }

  return new NextResponse(new Uint8Array(webp), {
    status: 200,
    headers: cacheHeaders(hasPaidAccess),
  });
}

function cacheHeaders(perRequest = false): HeadersInit {
  return {
    "Content-Type": "image/webp",
    // Subscriber pages: `private` — never let a shared/CDN cache hold them
    // (the watermark carries the subscriber's name+email). Browser disk
    // cache *is* allowed, so flipping back to an earlier page costs zero
    // server compute. Watermark already makes any extracted bytes
    // forensically traceable to the account, so disk-cached bytes don't
    // weaken the security model.
    // Public preview pages: long CDN cache, content-addressed.
    "Cache-Control": perRequest
      ? "private, max-age=86400, must-revalidate"
      : "public, max-age=31536000, immutable",
  };
}
