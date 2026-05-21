import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { Gopuram, PeacockEye, Thoranam, Divider } from "@/components/brand/Decor";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  // Settings
  const settings = await getSettings<{
    "site.support_email": string;
    "site.tagline_tamil": string;
    "site.tagline_english": string;
  }>(["site.support_email", "site.tagline_tamil", "site.tagline_english"]);
  const supportEmail = settings["site.support_email"];

  // User + paid-access (drives the subscribe band visibility)
  const user = await getCurrentUser();
  const isStaff =
    user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const [hasActiveSub, monthlyPlan] = await Promise.all([
    user && !isStaff
      ? prisma.subscription
          .findFirst({
            where: { userId: user.id, status: "ACTIVE", expiresAt: { gt: new Date() } },
            select: { id: true },
          })
          .then(Boolean)
      : Promise.resolve(false),
    prisma.subscriptionPlan.findUnique({ where: { slug: "monthly" } }),
  ]);
  const showSubscribeBand = !isStaff && !hasActiveSub;

  // Featured books — top 4 by featured + recent
  const featuredBooks = await prisma.content.findMany({
    where: { type: "PDF", status: "PUBLISHED", deletedAt: null },
    include: {
      contentAuthors: { include: { author: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      contentCategories: { include: { category: true }, take: 1 },
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 4,
  });

  // Recent articles — 3 in the journal section
  const recentArticles = await prisma.content.findMany({
    where: { type: "BLOG", status: "PUBLISHED", deletedAt: null },
    include: {
      contentAuthors: { include: { author: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      contentCategories: { include: { category: true }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Site stats for the metric strip
  const [bookCount, articleCount, authorCount] = await Promise.all([
    prisma.content.count({ where: { type: "PDF", status: "PUBLISHED", deletedAt: null } }),
    prisma.content.count({ where: { type: "BLOG", status: "PUBLISHED", deletedAt: null } }),
    prisma.author.count(),
  ]);

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
    categoryTamil: item.contentCategories[0]?.category.nameTamil ?? null,
    pageCount: item.pageCount,
    readingTimeMinutes: item.readingTimeMinutes,
  });

  const price = monthlyPlan ? Math.round(Number(monthlyPlan.priceInr)) : 99;

  return (
    <>
      <Header />

      <main className="flex-1 paper-warm">
        {/* HERO with gopuram silhouette behind */}
        <section className="relative px-6 md:px-14 pt-20 pb-12 md:pt-24 md:pb-16 text-center overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
            <Gopuram width={900} height={200} />
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Thoranam (mango-leaf festoon) */}
            <div className="flex justify-center mb-5 opacity-90">
              <Thoranam width={520} height={26} />
            </div>

            <div className="eyebrow mb-4">
              ★ &nbsp; <span data-bi lang="ta">செவ்விலக்கியம் · சமகாலம் · கட்டுரைகள்</span>
              <span data-bi lang="en">Classics · Contemporary · Essays</span>
              &nbsp; ★
            </div>

            <h1
              lang="ta"
              className="ta-display text-burgundy"
              style={{ fontSize: "clamp(48px, 7vw, 78px)", fontWeight: 500, lineHeight: 1.15, marginBottom: 16 }}
            >
              தமிழின் வாசிப்பு வீடு.
            </h1>
            <p
              lang="en"
              className="text-ink-2"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.3 }}
            >
              A reading home for Tamil literature — from the classical to the contemporary.
            </p>
            <p
              lang="ta"
              className="ta text-ink-3 mx-auto max-w-xl mt-4"
              style={{ fontSize: 15, lineHeight: 1.75 }}
            >
              திருக்குறள் முதல் இன்றைய சிறுகதைகள் வரை — {bookCount}+ நூல்கள், {articleCount}+ கட்டுரைகள், ஒரே இடத்தில். மாதம் ₹{price}.
            </p>

            <div className="flex flex-wrap gap-3.5 justify-center mt-9">
              <Link href="/books" className="btn btn-primary">
                <span data-bi lang="ta">வாசிப்பைத் தொடங்குங்கள்</span>
                <span data-bi lang="en">Start reading</span>
                <span style={{ opacity: 0.6 }}>→</span>
              </Link>
              <Link href="/blogs" className="btn btn-ghost">
                <span data-bi lang="ta">கட்டுரைகள்</span>
                <span data-bi lang="en">Articles</span>
              </Link>
            </div>

            {/* metric strip */}
            <div
              className="mt-14 mx-auto max-w-2xl grid grid-cols-2 md:grid-cols-4 border border-border-warm"
              style={{ background: "rgba(241,230,210,.5)" }}
            >
              {[
                { n: `${bookCount}+`, ta: "புத்தகங்கள்", en: "Books" },
                { n: `${articleCount}+`, ta: "கட்டுரைகள்", en: "Articles" },
                { n: `${authorCount}+`, ta: "ஆசிரியர்கள்", en: "Authors" },
                { n: `₹${price}`, ta: "மாதம் ஒன்றுக்கு", en: "Per month" },
              ].map((m, i) => (
                <div
                  key={i}
                  className="text-center px-3 py-4 md:py-5"
                  style={{ borderLeft: i === 0 ? "none" : "1px solid var(--border-warm)" }}
                >
                  <div className="display text-burgundy" style={{ fontSize: 26, lineHeight: 1 }}>
                    {m.n}
                  </div>
                  <div lang="ta" className="ta text-ink-3 mt-1.5" style={{ fontSize: 12 }}>
                    {m.ta}
                  </div>
                  <div className="eyebrow eyebrow-sm mt-1 text-gold">{m.en}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="trim mx-6 md:mx-14" />

        {/* FEATURED BOOKS */}
        <section className="px-6 md:px-14 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="eyebrow mb-2">
                <span data-bi lang="ta">தேர்வு · A Curated Selection</span>
                <span data-bi lang="en">A Curated Selection</span>
              </div>
              <h2 className="ta-display text-ink" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
                <span data-bi lang="ta">இம்மாதம் சிறப்பு நூல்கள்</span>
                <span data-bi lang="en">Featured this month</span>
              </h2>
              <p
                className="text-ink-3 mt-1.5"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16 }}
              >
                Featured this month · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <Link
              href="/books"
              className="ta text-burgundy text-sm hover:text-kumkum"
              style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}
            >
              <span data-bi lang="ta">அனைத்தும் →</span>
              <span data-bi lang="en">View all →</span>
            </Link>
          </div>

          {featuredBooks.length === 0 ? (
            <EmptyState
              ta="இன்னும் புத்தகங்கள் சேர்க்கப்படவில்லை."
              en="No books published yet."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {featuredBooks.map((b) => (
                <ContentCard key={b.id} item={toCardData(b)} />
              ))}
            </div>
          )}
          </div>
        </section>

        {/* PEACOCK SUBSCRIBE BAND */}
        {showSubscribeBand && (
          <section
            className="relative px-6 md:px-14 py-16 md:py-20"
            style={{
              background: "var(--sandalwood)",
              borderTop: "1px solid var(--border-warm)",
              borderBottom: "1px solid var(--border-warm)",
              overflow: "hidden",
            }}
          >
            <div className="absolute left-6 md:left-14 top-10 opacity-40 pointer-events-none">
              <PeacockEye size={60} />
            </div>
            <div className="absolute right-6 md:right-14 top-10 opacity-40 pointer-events-none">
              <PeacockEye size={60} flip />
            </div>

            <div className="max-w-xl mx-auto text-center">
              <Divider label="சந்தா · Subscription" />
              <h2
                className="ta-display text-burgundy mt-6 mb-3"
                style={{ fontSize: "clamp(30px, 4.5vw, 42px)", lineHeight: 1.2 }}
              >
                <span data-bi lang="ta">
                  மாதம் ₹{price}-க்கு<br />முழு நூலகம்.
                </span>
                <span data-bi lang="en">
                  ₹{price}/month<br />for the whole library.
                </span>
              </h2>
              <p
                className="text-ink-2"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 18 }}
              >
                <span data-bi lang="ta">₹{price} a month for the whole library.</span>
                <span data-bi lang="en">A month of unlimited reading.</span>
              </p>
              <p
                lang="ta"
                className="ta text-ink-2 max-w-md mx-auto mt-4 mb-7"
                style={{ fontSize: 14, lineHeight: 1.8 }}
              >
                இலவசத் திட்டத்தில் ஒவ்வொரு பிரீமியம் புத்தகத்தின் முதல் இரண்டு பக்கங்கள் கிடைக்கும். சந்தாதாரர்களுக்கு வரம்பற்ற வாசிப்பு.
              </p>

              <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mt-8">
                {/* Free Card */}
                <div className="flex flex-col border border-border-warm bg-paper rounded-xl p-8 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                  <div className="eyebrow">
                    <span data-bi lang="ta">இலவசம் · Free</span>
                    <span data-bi lang="en">Free Plan</span>
                  </div>
                  <div className="display text-ink mt-3" style={{ fontSize: 36 }}>₹0</div>
                  <p className="ta text-ink-3 mt-2 text-sm font-medium">அனைவருக்கும் இலவசம்</p>
                  <hr className="my-5 border-border-warm" />
                  <ul className="flex flex-col gap-3.5">
                    <li className="ta text-ink-2 flex items-start gap-2.5" style={{ fontSize: 14 }}>
                      <span className="text-gold mt-0.5">✓</span> அனைத்து கட்டுரைகளும் வாசிக்கலாம்
                    </li>
                    <li className="ta text-ink-2 flex items-start gap-2.5" style={{ fontSize: 14 }}>
                      <span className="text-gold mt-0.5">✓</span> பிரீமியம் நூல்களின் முதல் 2 பக்கங்கள்
                    </li>
                  </ul>
                </div>

                {/* Premium Card */}
                <div 
                  className="flex flex-col border rounded-xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-1 relative overflow-hidden"
                  style={{ background: "var(--burgundy)", color: "#FFE8B8", borderColor: "var(--burgundy)" }}
                >
                  <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 pointer-events-none">
                    <PeacockEye size={120} />
                  </div>
                  <div className="eyebrow relative z-10" style={{ color: "#D9B97C" }}>
                    <span data-bi lang="ta">சந்தா · Premium</span>
                    <span data-bi lang="en">Premium Plan</span>
                  </div>
                  <div className="display mt-3 relative z-10" style={{ fontSize: 36, color: "#FFE8B8" }}>
                    ₹{price}
                    <span style={{ fontSize: 14, fontStyle: "italic", opacity: 0.7 }}> /மாதம்</span>
                  </div>
                  <p className="ta mt-2 text-sm relative z-10 font-medium" style={{ color: "#D9B97C" }}>முழு நூலகமும் உங்கள் கைகளில்</p>
                  <hr className="my-5 relative z-10" style={{ borderColor: "rgba(217, 185, 124, 0.25)" }} />
                  <ul className="flex flex-col gap-3.5 relative z-10">
                    <li className="ta flex items-start gap-2.5" style={{ fontSize: 14 }}>
                      <span style={{ color: "#D9B97C" }} className="mt-0.5">✓</span> வரம்பற்ற நூல்கள் வாசிப்பு
                    </li>
                    <li className="ta flex items-start gap-2.5" style={{ fontSize: 14 }}>
                      <span style={{ color: "#D9B97C" }} className="mt-0.5">✓</span> விரைவில் வரும் புதிய நூல்கள்
                    </li>
                    <li className="ta flex items-start gap-2.5" style={{ fontSize: 14 }}>
                      <span style={{ color: "#D9B97C" }} className="mt-0.5">✓</span> எவ்வித விளம்பரங்களும் இல்லை
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href={user ? "/account/subscription" : "/register?next=/account/subscription"}
                  className="btn btn-primary"
                  style={{ padding: "13px 32px", fontSize: 14 }}
                >
                  <span data-bi lang="ta">₹{price}-ல் சேருங்கள்</span>
                  <span data-bi lang="en">Join at ₹{price}</span>
                  <span style={{ opacity: 0.6 }}>→</span>
                </Link>
              </div>
              <p
                className="text-ink-3 mt-3"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 12 }}
              >
                UPI · Cards · Net Banking · Powered by Razorpay
              </p>
            </div>
          </section>
        )}

        {/* RECENT ARTICLES */}
        <section className="px-6 md:px-14 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="eyebrow mb-2">
                <span data-bi lang="ta">கட்டுரைகள் · From The Journal</span>
                <span data-bi lang="en">From The Journal</span>
              </div>
              <h2 className="ta-display text-ink" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
                <span data-bi lang="ta">சமீபத்திய எழுத்து</span>
                <span data-bi lang="en">Recent writing</span>
              </h2>
              <p
                className="text-ink-3 mt-1.5"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 16 }}
              >
                Recent essays & criticism
              </p>
            </div>
            <Link
              href="/blogs"
              className="ta text-burgundy text-sm hover:text-kumkum"
              style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}
            >
              <span data-bi lang="ta">மேலும் →</span>
              <span data-bi lang="en">More →</span>
            </Link>
          </div>
          {recentArticles.length === 0 ? (
            <EmptyState ta="இன்னும் கட்டுரைகள் எதுவும் இல்லை." en="No articles yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {recentArticles.map((a, i) => (
                <Link key={a.id} href={`/blogs/${a.slug}`} className="group block">
                  <article className="frame h-full" style={{ padding: 28 }}>
                    <div className="eyebrow mb-4">
                      {a.contentCategories[0]?.category.nameTamil ?? "Article"}
                      <span style={{ color: "var(--gold)", margin: "0 6px" }}>·</span>
                      0{i + 1}
                    </div>
                    <h3
                      lang="ta"
                      className="ta-display text-ink mb-3 group-hover:text-burgundy transition-colors"
                      style={{ fontSize: 22, lineHeight: 1.32 }}
                    >
                      {a.titleTamil}
                    </h3>
                    {a.titleEnglish && (
                      <p
                        lang="en"
                        className="text-ink-3"
                        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
                      >
                        {a.titleEnglish}
                      </p>
                    )}
                    <hr className="my-4 border-border-warm" />
                    <div className="flex justify-between items-baseline">
                      <span lang="ta" className="ta text-ink-2 text-xs">
                        {a.publishedAt
                          ? a.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </span>
                      {a.readingTimeMinutes && (
                        <span lang="ta" className="ta text-burgundy" style={{ fontSize: 11 }}>
                          {a.readingTimeMinutes} நிமிடம் வாசிப்பு
                        </span>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
          </div>
        </section>
      </main>

      <Footer supportEmail={supportEmail} />
    </>
  );
}

function EmptyState({ ta, en }: { ta: string; en: string }) {
  return (
    <div className="frame text-center" style={{ padding: 48 }}>
      <p lang="ta" data-bi className="ta text-ink-2">{ta}</p>
      <p
        lang="en"
        data-bi
        className="text-ink-3 mt-1"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
      >
        {en}
      </p>
    </div>
  );
}
