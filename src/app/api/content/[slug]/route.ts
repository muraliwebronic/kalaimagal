import { NextResponse } from "next/server";
import { getPublicContentBySlug, toPublicContentDTO } from "@/lib/content";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const content = await getPublicContentBySlug(slug);
  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item: toPublicContentDTO(content) });
}
