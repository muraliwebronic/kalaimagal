import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getRequestIpAndUa } from "@/lib/auth";

const CreateSchema = z.object({
  type: z.enum(["PDF", "BLOG"]),
  titleTamil: z.string().trim().min(1).max(500),
  titleEnglish: z.string().trim().max(500).optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, digits, hyphens"),
  description: z.string().trim().max(2000).optional(),
  excerpt: z.string().trim().max(500).optional(),
  bodyText: z.string().max(500_000).optional(),
  isPremium: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  language: z.enum(["TA", "EN", "BILINGUAL"]).optional().default("TA"),
});

/** POST /api/admin/content — create a draft Content row (typically a blog). */
export async function POST(req: Request) {
  const user = await requireAdmin();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Sanitize HTML body — only allow a safe subset of tags / attributes
  const cleanBody = data.bodyText
    ? DOMPurify.sanitize(data.bodyText, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
          "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "hr",
        ],
        ALLOWED_ATTR: ["href", "title", "src", "alt", "width", "height"],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|\/)/i,
      })
    : null;

  try {
    const created = await prisma.content.create({
      data: {
        type: data.type,
        slug: data.slug,
        titleTamil: data.titleTamil,
        titleEnglish: data.titleEnglish,
        description: data.description,
        excerpt: data.excerpt,
        bodyText: cleanBody,
        isPremium: data.isPremium,
        isFeatured: data.isFeatured,
        language: data.language,
        status: "DRAFT",
        createdById: user.id,
      },
      select: { id: true, slug: true },
    });

    const { ip, userAgent } = await getRequestIpAndUa();
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entityType: "Content",
        entityId: String(created.id),
        changes: { slug: data.slug, type: data.type },
        ipAddress: ip,
        userAgent,
      },
    });

    return NextResponse.json({ id: created.id, slug: created.slug });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "A piece of content with this slug already exists" },
        { status: 409 },
      );
    }
    throw e;
  }
}
