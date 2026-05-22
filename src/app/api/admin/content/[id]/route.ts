import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";
import { storage } from "@/lib/storage";

const PatchSchema = z.object({
  titleTamil: z.string().trim().min(1).max(500).optional(),
  titleEnglish: z.string().trim().max(500).nullable().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  excerpt: z.string().trim().max(500).nullable().optional(),
  bodyText: z.string().max(500_000).nullable().optional(),
  isPremium: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  language: z.enum(["TA", "EN", "BILINGUAL"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
  readingTimeMinutes: z.number().int().min(1).max(600).nullable().optional(),
  metaTitle: z.string().trim().max(255).nullable().optional(),
  metaDescription: z.string().trim().max(500).nullable().optional(),
});

/** GET /api/admin/content/[id] — admin-only fetch including drafts */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();
  const { id } = await params;
  const content = await prisma.content.findUnique({
    where: { id: Number(id) },
    include: {
      contentAuthors: { include: { author: true }, orderBy: { sortOrder: "asc" } },
      contentCategories: { include: { category: true } },
      contentTags: { include: { tag: true } },
    },
  });
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ content });
}

/** PATCH /api/admin/content/[id] — update fields */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  const { id } = await params;
  const contentId = Number(id);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const before = await prisma.content.findUnique({ where: { id: contentId } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Guard: can't publish a PDF until the render-queue cron has finished
  // pre-rasterising every page. Without this, the first reader of an
  // uncached page would trigger an in-request render on the convert API
  // and lose the cost-reduction win.
  if (
    parsed.data.status === "PUBLISHED" &&
    before.type === "PDF" &&
    before.renderState !== "READY"
  ) {
    return NextResponse.json(
      {
        error: `Cannot publish — pages still rendering (${before.renderProgress}/${before.pageCount ?? "?"}, state=${before.renderState})`,
      },
      { status: 409 },
    );
  }

  // Sanitize bodyText if it's being updated
  const cleanBody =
    parsed.data.bodyText !== undefined && parsed.data.bodyText !== null
      ? DOMPurify.sanitize(parsed.data.bodyText, {
          ALLOWED_TAGS: [
            "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
            "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "hr",
          ],
          ALLOWED_ATTR: ["href", "title", "src", "alt", "width", "height"],
          ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
        })
      : parsed.data.bodyText; // null = explicit clear

  // Auto-set publishedAt the first time status flips to PUBLISHED
  let publishedAt: Date | undefined;
  if (
    parsed.data.status === "PUBLISHED" &&
    before.status !== "PUBLISHED" &&
    !before.publishedAt
  ) {
    publishedAt = new Date();
  }

  const updated = await prisma.content.update({
    where: { id: contentId },
    data: {
      ...parsed.data,
      bodyText: cleanBody,
      updatedById: user.id,
      ...(publishedAt ? { publishedAt } : {}),
    },
    select: { id: true, slug: true, status: true },
  });

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action:
        before.status !== "PUBLISHED" && parsed.data.status === "PUBLISHED"
          ? "CONTENT_PUBLISH"
          : "UPDATE",
      entityType: "Content",
      entityId: String(contentId),
      changes: parsed.data as object,
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true, content: updated });
}

/** DELETE /api/admin/content/[id] — soft delete (sets deletedAt) */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  const { id } = await params;
  const contentId = Number(id);

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: { id: true, filePath: true, type: true },
  });
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.content.update({
    where: { id: contentId },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });

  // Best-effort: also delete cached WebP pages for this content. The PDF
  // itself stays on disk — manual cleanup if you want to reclaim space.
  if (content.type === "PDF") {
    try {
      const cacheKey = `cache/${content.id}/`;
      // No bulk delete in the abstraction — single-page cleanup is sufficient
      // for the small free-preview range. Full purge can be a separate cron.
      for (let p = 1; p <= 2; p++) {
        await storage().delete(`${cacheKey}page_${p}.webp`).catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  const { ip, userAgent } = await getRequestIpAndUa();
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "DELETE",
      entityType: "Content",
      entityId: String(contentId),
      ipAddress: ip,
      userAgent,
    },
  });

  return NextResponse.json({ ok: true });
}
