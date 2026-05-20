import { NextResponse } from "next/server";
import { z } from "zod";
import { listPublicContent, toPublicContentDTO } from "@/lib/content";

const QuerySchema = z.object({
  type: z.enum(["PDF", "BLOG"]).default("PDF"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).optional(),
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const result = await listPublicContent({
    type: parsed.data.type,
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    categorySlug: parsed.data.category,
    tagSlug: parsed.data.tag,
  });

  return NextResponse.json({
    items: result.items.map(toPublicContentDTO),
    pagination: {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      pageCount: result.pageCount,
    },
  });
}
