import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { BiLabel } from "@/components/ui/BiLabel";
import { SubscribePricingCard } from "@/components/payment/SubscribePricingCard";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
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

  // Subscribe card needs: monthly plan, the current user's contact info (if
  // signed in), and whether they already have an active subscription.
  const user = await getCurrentUser();
  const isStaff =
    user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const [monthlyPlan, fullUser, hasActiveSub] = await Promise.all([
    prisma.subscriptionPlan.findUnique({ where: { slug: "monthly" } }),
    user
      ? prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, email: true, phone: true },
        })
      : Promise.resolve(null),
    user && !isStaff
      ? prisma.subscription
          .findFirst({
            where: {
              userId: user.id,
              status: "ACTIVE",
              expiresAt: { gt: new Date() },
            },
            select: { id: true },
          })
          .then(Boolean)
      : Promise.resolve(false),
  ]);
  // Skip the pricing card for staff + active subscribers
  const showPricingCard = !isStaff && !hasActiveSub;

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
                <span data-bi lang="ta">தமிழ் இலக்கியம், புதிய தளம்</span>
                <span data-bi lang="en" className="italic">A new platform for Tamil literature</span>
              </div>

              <h1
                data-bi
                lang="ta"
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight text-foreground"
              >
                {hero?.headline_tamil ?? taglineTa}
              </h1>
              <h1
                data-bi
                lang="en"
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight text-foreground"
              >
                {hero?.headline_english ?? taglineEn}
              </h1>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/books" className={cn(buttonVariants({ size: "lg" }))}>
                  <BiLabel
                    ta={hero?.cta_text_tamil ?? strings.cta.startReading.ta}
                    en={hero?.cta_text_english ?? strings.cta.startReading.en}
                    variant="inline"
                  />
                </Link>
                <Link href="/blogs" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  <BiLabel
                    ta={strings.nav.articles.ta}
                    en={strings.nav.articles.en}
                    variant="inline"
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
        {/* Subscribe pricing card — hidden for active subscribers + staff */}
        {showPricingCard && monthlyPlan && (
          <section className="border-t border-border/60">
            <div className="container mx-auto px-4 md:px-6 py-20 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
                {/* Pitch */}
                <div className="lg:col-span-7 lg:pr-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    <span data-bi lang="ta">சந்தா</span>
                    <span data-bi lang="en">Subscribe</span>
                  </p>
                  <h2
                    data-bi
                    lang="ta"
                    className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15]"
                  >
                    வாசிக்கத் தொடங்குங்கள்.
                  </h2>
                  <h2
                    data-bi
                    lang="en"
                    className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15]"
                  >
                    Start reading today.
                  </h2>
                  <p data-bi lang="ta" className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-prose">
                    தமிழின் மிகச்சிறந்த புதினங்கள், கவிதைகள், கட்டுரைகள் — அனைத்தும் ஒரே இடத்தில்.
                    திறமையாக டிஜிட்டலாக்கப்பட்டது, கவனமாக தேர்ந்தெடுக்கப்பட்டது.
                  </p>
                  <p data-bi lang="en" className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-prose">
                    The best of Tamil novels, poetry, and essays — all in one place.
                    Carefully curated, beautifully digitized.
                  </p>
                </div>

                {/* Pricing card */}
                <div className="lg:col-span-5">
                  <SubscribePricingCard
                    user={fullUser ?? null}
                    plan={{
                      slug: monthlyPlan.slug,
                      priceInr: monthlyPlan.priceInr.toString(),
                      durationDays: monthlyPlan.durationDays,
                      nameTamil: monthlyPlan.nameTamil,
                      nameEnglish: monthlyPlan.nameEnglish,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer supportEmail={supportEmail} />
    </>
  );
}

function EmptyState({ ta, en }: { ta: string; en: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
      <p data-bi lang="ta" className="text-base text-muted-foreground">{ta}</p>
      <p data-bi lang="en" className="text-base text-muted-foreground">{en}</p>
    </div>
  );
}
