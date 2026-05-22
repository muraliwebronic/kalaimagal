import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { storage, storageKeys } from "@/lib/storage";
import { renderPdfPageToBaseWebp } from "@/lib/pdf-render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow up to 60s on hobby tier; on free tier this caps at 10s and we
// just process fewer pages per invocation. The batch limit below keeps
// even the free tier comfortably under budget.
export const maxDuration = 60;

/**
 * GET /api/cron/render-queue
 *
 * Background worker that walks `Content` rows in PENDING / RENDERING state
 * and rasterises pages 1..N into `cache/{id}/base/page_{N}.webp`. Hit it
 * every minute from Vercel Cron (or an external uptime ping).
 *
 * Strategy per invocation:
 *   1. Pick the single oldest PENDING/RENDERING PDF that isn't fully
 *      rendered yet. One book at a time keeps each tick predictable.
 *   2. Flip it to RENDERING.
 *   3. Render up to BATCH pages forward of `renderProgress`, skipping any
 *      pages whose base WebP already exists on disk (idempotent — safe to
 *      re-run after a crash).
 *   4. If we reach pageCount, flip to READY. Otherwise leave RENDERING
 *      with the new progress; next tick picks up from there.
 *
 * Auth: same as `/api/cron/expiry-check` — `Authorization: Bearer
 * $CRON_SECRET` header or `?secret=$CRON_SECRET` query param.
 */
const BATCH = 5;

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the next book that still has pages left to render. We process
  // one at a time so a single tick has bounded cost; oldest-first keeps
  // the queue fair.
  const target = await prisma.content.findFirst({
    where: {
      type: "PDF",
      deletedAt: null,
      renderState: { in: ["PENDING", "RENDERING"] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      filePath: true,
      pageCount: true,
      renderProgress: true,
    },
  });

  if (!target) {
    return NextResponse.json({ status: "idle", message: "no books in queue" });
  }

  if (!target.filePath || !target.pageCount) {
    // Malformed row — mark FAILED so it doesn't block the queue forever.
    await prisma.content.update({
      where: { id: target.id },
      data: { renderState: "FAILED", renderError: "missing filePath or pageCount" },
    });
    return NextResponse.json({
      status: "failed",
      id: target.id,
      reason: "missing filePath or pageCount",
    });
  }

  // Mark RENDERING so admin UI can show "in progress" between ticks.
  if (target.renderProgress === 0) {
    await prisma.content.update({
      where: { id: target.id },
      data: { renderState: "RENDERING" },
    });
  }

  // Load the PDF once per tick (parsing cost amortised across BATCH pages).
  const pdfBuffer = await storage().get(target.filePath);
  if (!pdfBuffer) {
    await prisma.content.update({
      where: { id: target.id },
      data: { renderState: "FAILED", renderError: `PDF missing at ${target.filePath}` },
    });
    return NextResponse.json({ status: "failed", id: target.id, reason: "pdf missing" });
  }

  const docKey = String(target.id);
  const start = target.renderProgress + 1;
  const end = Math.min(target.pageCount, target.renderProgress + BATCH);
  const rendered: number[] = [];
  const skipped: number[] = [];

  for (let page = start; page <= end; page++) {
    const key = storageKeys.baseRaster(docKey, page);
    // Skip if a previous tick (or the upload handler for page 1) already
    // wrote this one. Keeps the cron idempotent under retry / crash.
    if (await storage().exists(key)) {
      skipped.push(page);
      continue;
    }
    try {
      const webp = await renderPdfPageToBaseWebp({ pdfBuffer, page, scale: 2.0 });
      await storage().put(key, webp, "image/webp");
      rendered.push(page);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await prisma.content.update({
        where: { id: target.id },
        data: {
          renderState: "FAILED",
          renderError: `page ${page}: ${msg}`.slice(0, 1000),
        },
      });
      return NextResponse.json({
        status: "failed",
        id: target.id,
        page,
        reason: msg,
      });
    }
  }

  // Advance progress (use the highest page we touched, even if skipped).
  const newProgress = end;
  const isDone = newProgress >= target.pageCount;
  await prisma.content.update({
    where: { id: target.id },
    data: {
      renderProgress: newProgress,
      renderState: isDone ? "READY" : "RENDERING",
      ...(isDone ? { renderError: null } : {}),
    },
  });

  return NextResponse.json({
    status: isDone ? "done" : "progress",
    id: target.id,
    rendered,
    skipped,
    progress: `${newProgress}/${target.pageCount}`,
  });
}

function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}
