import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Pagination } from "@/components/content/Pagination";
import { listPublicContent, CONTENT_PAGE_SIZE } from "@/lib/content";
import { getSetting } from "@/lib/settings";

export const metadata = { title: "கட்டுரைகள் — Articles" };

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;

  const { items, total, pageCount } = await listPublicContent({
    type: "BLOG",
    page,
    pageSize: CONTENT_PAGE_SIZE,
    categorySlug: sp.category,
  });

  return (
    <>
      <Header />
      <main className="flex-1 paper-warm">
        {/* Page header */}
        <section className="px-6 md:px-14 pt-14 pb-8 border-b border-border-warm">
          <div className="eyebrow mb-2.5">
            <span data-bi lang="ta">இதழ் · The Journal</span>
            <span data-bi lang="en">The Journal</span>
          </div>
          <h1
            className="ta-display text-burgundy"
            style={{ fontSize: "clamp(40px, 6vw, 56px)", marginBottom: 8 }}
          >
            <span data-bi lang="ta">கட்டுரைகள்</span>
            <span data-bi lang="en">Articles</span>
          </h1>
          <p
            className="text-ink-2"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}
          >
            {total.toLocaleString()} article{total === 1 ? "" : "s"}
            <span style={{ color: "var(--gold)", margin: "0 10px" }}>·</span>
            <span lang="ta" className="ta" style={{ fontStyle: "normal" }}>
              பக்கம் {page} / {pageCount}
            </span>
          </p>
        </section>

        {/* Grid */}
        <section className="px-6 md:px-14 py-10 md:py-14">
          {items.length === 0 ? (
            <div className="frame text-center" style={{ padding: 48, maxWidth: 480, margin: "40px auto" }}>
              <p lang="ta" data-bi className="ta text-ink-2">இன்னும் கட்டுரைகள் வெளியிடப்படவில்லை.</p>
              <p
                lang="en"
                data-bi
                className="text-ink-3 mt-1"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
              >
                No articles published yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {items.map((b, i) => (
                <Link key={b.id} href={`/blogs/${b.slug}`} className="group block">
                  <article className="frame h-full flex flex-col" style={{ padding: 28 }}>
                    <div className="eyebrow mb-4">
                      {b.contentCategories[0]?.category.nameTamil ?? "Article"}
                      <span style={{ color: "var(--gold)", margin: "0 6px" }}>·</span>
                      {String(i + 1 + (page - 1) * CONTENT_PAGE_SIZE).padStart(2, "0")}
                    </div>
                    <h3
                      lang="ta"
                      className="ta-display text-ink mb-3 group-hover:text-burgundy transition-colors"
                      style={{ fontSize: 22, lineHeight: 1.32 }}
                    >
                      {b.titleTamil}
                    </h3>
                    {b.titleEnglish && (
                      <p
                        lang="en"
                        className="text-ink-3"
                        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
                      >
                        {b.titleEnglish}
                      </p>
                    )}
                    {b.excerpt && (
                      <p lang="ta" className="ta text-ink-2 mt-3 line-clamp-3" style={{ fontSize: 14, lineHeight: 1.75 }}>
                        {b.excerpt}
                      </p>
                    )}
                    <hr className="my-4 border-border-warm" />
                    <div className="mt-auto flex justify-between items-baseline">
                      <span lang="ta" className="ta text-ink-2 text-xs">
                        {b.publishedAt
                          ? b.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </span>
                      {b.readingTimeMinutes && (
                        <span lang="ta" className="ta text-burgundy" style={{ fontSize: 11 }}>
                          {b.readingTimeMinutes} நிமிடம் வாசிப்பு
                        </span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <Pagination
            basePath="/blogs"
            page={page}
            pageCount={pageCount}
            searchParams={{ category: sp.category }}
          />
        </section>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
