import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // 1 hour

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/books", priority: 0.9, changeFrequency: "daily" },
  { path: "/blogs", priority: 0.9, changeFrequency: "daily" },
  { path: "/register", priority: 0.5, changeFrequency: "monthly" },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/refunds", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();

  const [contents] = await Promise.all([
    prisma.content.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { slug: true, type: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = contents.map((c) => ({
    url: `${base}${c.type === "PDF" ? "/books" : "/blogs"}/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  return [...staticEntries, ...dynamicEntries];
}
