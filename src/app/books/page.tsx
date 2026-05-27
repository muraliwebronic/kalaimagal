import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { Pagination } from "@/components/content/Pagination";
import { listPublicContent, CONTENT_PAGE_SIZE } from "@/lib/content";
import { getSetting } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Gopuram } from "@/components/brand/Decor";

export const metadata = { title: "புத்தகங்கள் — Books" };

interface BooksPageSearchParams {
  page?: string;
  category?: string;
  tier?: "free" | "premium";
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<BooksPageSearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;

  const isPremium = sp.tier === "premium" ? true : sp.tier === "free" ? false : undefined;

  const [{ items, total, pageCount }, categories] = await Promise.all([
    listPublicContent({
      type: "PDF",
      page,
      pageSize: CONTENT_PAGE_SIZE,
      categorySlug: sp.category,
      isPremium,
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, nameTamil: true, nameEnglish: true },
      take: 8,
    }),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 paper-warm">
        {/* Page header */}
        <section className="px-0 md:px-10 py-0 md:py-6 max-w-[1400px] mx-auto border-b border-border-warm/30">
          <div className="relative w-full rounded-none md:rounded-[40px] overflow-hidden bg-paper shadow-sm flex flex-col md:flex-row lg:items-end lg:justify-between p-8 md:p-14 lg:p-20 border-b md:border border-border-warm mb-2">
            <div className="absolute right-0 bottom-0 opacity-[0.06] pointer-events-none translate-x-1/4 translate-y-1/4">
              <Gopuram width={800} height={400} />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="eyebrow mb-2.5">
                <span data-bi lang="ta">நூலகம் · The Library</span>
                <span data-bi lang="en">The Library</span>
              </div>
              <h1
                className="ta-display text-ink"
                style={{ fontSize: "clamp(40px, 6vw, 56px)", marginBottom: 8 }}
              >
                <span data-bi lang="ta">புத்தகங்கள்</span>
                <span data-bi lang="en">Books</span>
              </h1>
              <p
                className="text-ink-2"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}
              >
                {total.toLocaleString()} title{total === 1 ? "" : "s"}
                <span style={{ color: "var(--gold)", margin: "0 10px" }}>·</span>
                <span lang="ta" className="ta" style={{ fontStyle: "normal" }}>
                  பக்கம் {page} / {pageCount}
                </span>
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <FilterPill
                label={{ ta: "அனைத்தும்", en: "All" }}
                href="/books"
                active={!sp.category && !sp.tier}
              />
              <FilterPill
                label={{ ta: "இலவசம்", en: "Free" }}
                href="/books?tier=free"
                active={sp.tier === "free"}
              />
              <FilterPill
                label={{ ta: "சந்தா", en: "Premium" }}
                href="/books?tier=premium"
                active={sp.tier === "premium"}
              />
              {categories.slice(0, 3).map((c) => (
                <FilterPill
                  key={c.slug}
                  label={{ ta: c.nameTamil, en: c.nameEnglish ?? c.nameTamil }}
                  href={`/books?category=${c.slug}`}
                  active={sp.category === c.slug}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 md:px-14 py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
          {items.length === 0 ? (
            <EmptyLibrary />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {items.map((b) => {
                const card: ContentCardData = {
                  id: b.id,
                  slug: b.slug,
                  type: b.type,
                  titleTamil: b.titleTamil,
                  titleEnglish: b.titleEnglish,
                  excerpt: b.excerpt,
                  description: b.description,
                  coverImageUrl: b.coverImageUrl,
                  isPremium: b.isPremium,
                  authorNameTamil: b.contentAuthors[0]?.author.nameTamil,
                  categoryTamil: b.contentCategories[0]?.category.nameTamil ?? null,
                  pageCount: b.pageCount,
                  readingTimeMinutes: b.readingTimeMinutes,
                };
                return <ContentCard key={b.id} item={card} />;
              })}
            </div>
          )}

          <Pagination
            basePath="/books"
            page={page}
            pageCount={pageCount}
            searchParams={{ category: sp.category, tier: sp.tier }}
          />
          </div>
        </section>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}

interface FilterPillProps {
  label: { ta: string; en: string };
  href: string;
  active?: boolean;
}

function FilterPill({ label, href, active }: FilterPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "ta text-[11px] px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-sm font-semibold tracking-wider uppercase",
        active
          ? "bg-ink border-transparent text-sandalwood"
          : "bg-paper border border-border-warm text-ink-2 hover:border-ink hover:text-ink",
      )}
    >
      <span data-bi lang="ta">{label.ta}</span>
      <span data-bi lang="en">{label.en}</span>
    </Link>
  );
}

function EmptyLibrary() {
  return (
    <div className="frame text-center" style={{ padding: 48, maxWidth: 480, margin: "40px auto" }}>
      <p lang="ta" data-bi className="ta text-ink-2">இன்னும் புத்தகங்கள் வெளியிடப்படவில்லை.</p>
      <p
        lang="en"
        data-bi
        className="text-ink-3 mt-1"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
      >
        No books published yet.
      </p>
    </div>
  );
}
