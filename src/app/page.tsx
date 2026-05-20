import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { BiLabel } from "@/components/ui/BiLabel";
import { prisma } from "@/lib/db";
import { getSettings, type HeroConfig } from "@/lib/settings";
import { strings } from "@/lib/strings";

export default async function HomePage() {
  // Hero config + support email from Setting (admin-editable later)
  const settings = await getSettings<{
    "site.hero_config": HeroConfig;
    "site.support_email": string;
    "site.tagline_tamil": string;
    "site.tagline_english": string;
  }>([
    "site.hero_config",
    "site.support_email",
    "site.tagline_tamil",
    "site.tagline_english",
  ]);

  const hero = settings["site.hero_config"];
  const taglineTa = settings["site.tagline_tamil"] ?? strings.brand.tagline.ta;
  const taglineEn = settings["site.tagline_english"] ?? strings.brand.tagline.en;
  const supportEmail = settings["site.support_email"];

  // Featured books (PDFs) — featured first, then recent
  const featuredBooks = await prisma.content.findMany({
    where: { type: "PDF", status: "PUBLISHED", deletedAt: null },
    include: {
      contentAuthors: {
        include: { author: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });

  // Recent blogs
  const recentBlogs = await prisma.content.findMany({
    where: { type: "BLOG", status: "PUBLISHED", deletedAt: null },
    include: {
      contentAuthors: {
        include: { author: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const toCardData = (item: typeof featuredBooks[number]): ContentCardData => ({
    id: item.id,
    slug: item.slug,
    type: item.type,
    titleTamil: item.titleTamil,
    titleEnglish: item.titleEnglish,
    excerpt: item.excerpt,
    description: item.description,
    coverImageUrl: item.coverImageUrl,
    isPremium: item.isPremium,
    authorNameTamil: item.contentAuthors[0]?.author.nameTamil,
    readingTimeMinutes: item.readingTimeMinutes,
  });

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                <span className="inline-block size-1.5 rounded-full bg-accent-alt" />
                <span lang="ta">தமிழ் இலக்கியம், புதிய தளம்</span>
                <span className="text-muted-foreground/50">·</span>
                <span lang="en" className="italic">A new platform for Tamil literature</span>
              </div>

              <h1
                lang="ta"
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight text-foreground"
              >
                {hero?.headline_tamil ?? taglineTa}
              </h1>
              <p
                lang="en"
                className="mt-4 text-lg md:text-xl text-muted-foreground font-heading italic"
              >
                {hero?.headline_english ?? taglineEn}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/books" className={cn(buttonVariants({ size: "lg" }))}>
                  <BiLabel
                    ta={hero?.cta_text_tamil ?? strings.cta.startReading.ta}
                    en={hero?.cta_text_english ?? strings.cta.startReading.en}
                    variant="inline"
                    englishHidden
                  />
                </Link>
                <Link href="/blogs" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  <BiLabel
                    ta={strings.nav.articles.ta}
                    en={strings.nav.articles.en}
                    variant="inline"
                    englishHidden
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured books */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-heading text-2xl md:text-3xl tracking-tight">
              <BiLabel
                ta={strings.sections.featuredBooks.ta}
                en={strings.sections.featuredBooks.en}
                variant="stacked"
              />
            </h2>
            <Link
              href="/books"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              <BiLabel
                ta={strings.cta.viewAll.ta}
                en={strings.cta.viewAll.en}
                variant="inline"
                englishHidden
              />
              {" →"}
            </Link>
          </div>

          {featuredBooks.length === 0 ? (
            <EmptyState
              ta="இன்னும் புத்தகங்கள் சேர்க்கப்படவில்லை."
              en="No books published yet."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredBooks.map((b) => (
                <ContentCard key={b.id} item={toCardData(b)} />
              ))}
            </div>
          )}
        </section>

        {/* Recent articles */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl md:text-3xl tracking-tight">
                <BiLabel
                  ta={strings.sections.recentArticles.ta}
                  en={strings.sections.recentArticles.en}
                  variant="stacked"
                />
              </h2>
              <Link
                href="/blogs"
                className="text-sm text-primary hover:underline underline-offset-4"
              >
                <BiLabel
                  ta={strings.cta.viewAll.ta}
                  en={strings.cta.viewAll.en}
                  variant="inline"
                  englishHidden
                />
                {" →"}
              </Link>
            </div>

            {recentBlogs.length === 0 ? (
              <EmptyState
                ta="இன்னும் கட்டுரைகள் எதுவும் இல்லை."
                en="No articles yet."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {recentBlogs.map((b) => (
                  <ContentCard key={b.id} item={toCardData(b)} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Subscribe CTA */}
        <section className="container mx-auto px-4 md:px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              lang="ta"
              className="font-heading text-3xl md:text-4xl tracking-tight"
            >
              வாசிக்கத் தொடங்குங்கள்.
            </h2>
            <p
              lang="en"
              className="mt-2 text-base md:text-lg italic text-muted-foreground"
            >
              Start reading today.
            </p>
            <p lang="ta" className="mt-6 text-base text-muted-foreground leading-relaxed">
              மாதம் ₹99 — அனைத்து புத்தகங்களுக்கும், அனைத்து கட்டுரைகளுக்கும்
              வரம்பற்ற அணுகல்.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                {strings.cta.subscribe.ta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer supportEmail={supportEmail} />
    </>
  );
}

function EmptyState({ ta, en }: { ta: string; en: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
      <p lang="ta" className="text-base text-muted-foreground">{ta}</p>
      <p lang="en" className="mt-1 text-sm italic text-muted-foreground/70">{en}</p>
    </div>
  );
}
