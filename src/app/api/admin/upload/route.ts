import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { storage, storageKeys } from "@/lib/storage";
import { renderPdfPageToBaseWebp, getPdfPageCount } from "@/lib/pdf-render";
import { getRequestIpAndUa } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * POST /api/admin/upload  (multipart/form-data)
 *
 * Fields:
 *   file        — PDF file (required)
 *   titleTamil  — required
 *   titleEnglish, isPremium, isFeatured — optional
 *
 * Steps:
 *   1. Validate file: magic bytes (%PDF-), size, mime
 *   2. Save to storage as pdfs/{uuid}.pdf
 *   3. Render page 1 to cache as cache/{contentId}/page_1.webp (cover)
 *   4. Insert Content row with filePath + pageCount
 *   5. Return { id, slug } so the client can navigate to the edit page
 */
export async function POST(req: Request) {
  const user = await requireAdmin();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB > 50MB)` },
      { status: 413 },
    );
  }

  // Magic byte check — don't trust the client-supplied MIME alone
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length < 4 || buffer.toString("ascii", 0, 4) !== "%PDF") {
    return NextResponse.json({ error: "File is not a valid PDF" }, { status: 400 });
  }

  const titleTamil = String(form.get("titleTamil") ?? "").trim();
  const titleEnglish = String(form.get("titleEnglish") ?? "").trim() || null;
  const isPremium = form.get("isPremium") === "true";
  const isFeatured = form.get("isFeatured") === "true";

  if (!titleTamil || titleTamil.length > 500) {
    return NextResponse.json({ error: "titleTamil required (≤500 chars)" }, { status: 400 });
  }

  // Determine the page count so the convert API can range-check requests
  let pageCount: number;
  try {
    pageCount = await getPdfPageCount(buffer);
  } catch (e) {
    return NextResponse.json(
      { error: `Could not parse PDF: ${e instanceof Error ? e.message : "unknown"}` },
      { status: 400 },
    );
  }

  // Persist the PDF under pdfs/{uuid}.pdf
  const uuid = randomUUID();
  const pdfKey = storageKeys.pdf(uuid);
  await storage().put(pdfKey, buffer, "application/pdf");

  // Build a slug from titleEnglish or titleTamil + a short suffix
  const baseSlug = slugify(titleEnglish ?? titleTamil) || `content-${uuid.slice(0, 8)}`;
  const slug = `${baseSlug}-${uuid.slice(0, 6)}`;

  let created;
  try {
    created = await prisma.content.create({
      data: {
        type: "PDF",
        slug,
        titleTamil,
        titleEnglish,
        filePath: pdfKey,
        fileSizeBytes: BigInt(buffer.length),
        fileMimeType: "application/pdf",
        pageCount,
        isPremium,
        isFeatured,
        status: "DRAFT",
        // Bulk page rasterisation is handled by the render-queue cron — the
        // book stays PENDING until every page is in cache/{id}/base/.
        // renderProgress starts at 1 because we pre-render page 1 below as
        // the cover. The cron handles 2..N.
        renderState: "PENDING",
        renderProgress: 0,
        language: "TA",
        createdById: user.id,
      },
      select: { id: true, slug: true },
    });
  } catch (e) {
    // If DB insert fails, delete the orphan PDF
    await storage().delete(pdfKey).catch(() => {});
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Slug collision — try again" }, { status: 409 });
    }
    throw e;
  }

  // Pre-render page 1 immediately as the cover base — gives admin an
  // instant preview and lets the convert API serve covers before the
  // cron has touched the rest of the book. Pages 2..N are queued.
  let coverImageUrl: string | null = null;
  try {
    const webp = await renderPdfPageToBaseWebp({
      pdfBuffer: buffer,
      page: 1,
      scale: 2.0,
    });
    await storage().put(
      storageKeys.baseRaster(String(created.id), 1),
      webp,
      "image/webp",
    );
    coverImageUrl = `/api/convert?doc_id=${created.id}&page=1`;
    await prisma.content.update({
      where: { id: created.id },
      data: { coverImageUrl, renderProgress: 1 },
    });
  } catch (e) {
    console.error(`cover generation failed for content ${created.id}:`, e);
    // Don't fail the whole upload — the cron will pick the book up and
    // render page 1 itself. Admin can also retry from the edit page.
  }

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entityType: "Content",
      entityId: String(created.id),
      changes: { type: "PDF", pageCount, fileSizeBytes: buffer.length },
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ id: created.id, slug: created.slug, pageCount, coverImageUrl });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
