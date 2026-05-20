import "server-only";
import { prisma } from "@/lib/db";
import type { ContentModel } from "@/generated/prisma/models";
import type { ContentType } from "@/generated/prisma/enums";

export const CONTENT_PAGE_SIZE = 12;

export interface ListContentParams {
  type: ContentType;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
}

/**
 * Public listing query — only PUBLISHED, non-deleted content. Returns
 * everything the card needs (title, cover, author, premium flag, etc.).
 */
export async function listPublicContent({
  type,
  page = 1,
  pageSize = CONTENT_PAGE_SIZE,
  categorySlug,
  tagSlug,
}: ListContentParams) {
  const where = {
    type,
    status: "PUBLISHED" as const,
    deletedAt: null,
    ...(categorySlug
      ? { contentCategories: { some: { category: { slug: categorySlug } } } }
      : {}),
    ...(tagSlug
      ? { contentTags: { some: { tag: { slug: tagSlug } } } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.content.findMany({
      where,
      include: {
        contentAuthors: {
          include: { author: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        contentCategories: {
          include: { category: true },
          take: 3,
        },
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.content.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Fetch a single PUBLISHED content by slug, with full author + category data. */
export async function getPublicContentBySlug(slug: string) {
  return prisma.content.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      contentAuthors: {
        include: { author: true },
        orderBy: { sortOrder: "asc" },
      },
      contentCategories: { include: { category: true } },
      contentTags: { include: { tag: true } },
      series: true,
    },
  });
}

/**
 * Minimal projection for the public API. Drops admin/internal fields and
 * keeps the response payload small.
 */
export function toPublicContentDTO(
  c: ContentModel & {
    contentAuthors: Array<{ author: { id: number; slug: string; nameTamil: string; nameEnglish: string | null } }>;
    contentCategories?: Array<{ category: { slug: string; nameTamil: string; nameEnglish: string | null } }>;
  },
) {
  return {
    id: c.id,
    slug: c.slug,
    type: c.type,
    titleTamil: c.titleTamil,
    titleEnglish: c.titleEnglish,
    subtitle: c.subtitle,
    description: c.description,
    excerpt: c.excerpt,
    coverImageUrl: c.coverImageUrl,
    pageCount: c.pageCount,
    readingTimeMinutes: c.readingTimeMinutes,
    isPremium: c.isPremium,
    isFeatured: c.isFeatured,
    language: c.language,
    publishedAt: c.publishedAt,
    publicationYear: c.publicationYear,
    publisher: c.publisher,
    averageRating: c.averageRating?.toString() ?? null,
    reviewCount: c.reviewCount,
    authors: c.contentAuthors.map((ca) => ({
      id: ca.author.id,
      slug: ca.author.slug,
      nameTamil: ca.author.nameTamil,
      nameEnglish: ca.author.nameEnglish,
    })),
    categories: (c.contentCategories ?? []).map((cc) => ({
      slug: cc.category.slug,
      nameTamil: cc.category.nameTamil,
      nameEnglish: cc.category.nameEnglish,
    })),
  };
}
