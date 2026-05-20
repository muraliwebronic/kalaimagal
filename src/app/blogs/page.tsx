import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { Pagination } from "@/components/content/Pagination";
import { BiLabel } from "@/components/ui/BiLabel";
import { listPublicContent, CONTENT_PAGE_SIZE } from "@/lib/content";
import { getSetting } from "@/lib/settings";
import { strings } from "@/lib/strings";

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
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <header className="mb-10">
            <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
              <BiLabel
                ta={strings.nav.articles.ta}
                en={strings.nav.articles.en}
                variant="stacked"
              />
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {total === 0
                ? "—"
                : `${total} ${total === 1 ? "article" : "articles"} · page ${page} of ${pageCount}`}
            </p>
          </header>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-16 text-center">
              <p lang="ta" className="text-base text-muted-foreground">
                இன்னும் கட்டுரைகள் வெளியிடப்படவில்லை.
              </p>
              <p lang="en" className="mt-1 text-sm italic text-muted-foreground/70">
                No articles published yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
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
                  readingTimeMinutes: b.readingTimeMinutes,
                };
                return <ContentCard key={b.id} item={card} />;
              })}
            </div>
          )}

          <Pagination
            basePath="/blogs"
            page={page}
            pageCount={pageCount}
            searchParams={{ category: sp.category }}
          />
        </div>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
