import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { VideosSection } from "@/components/home/VideosSection";
import { Gopuram, PeacockEye, Thoranam, Divider } from "@/components/brand/Decor";
import { Cover, pickCoverVariant, emblemFromTitle } from "@/components/brand/Cover";
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
        {/* REDESIGNED HERO: Immersive 2-column split editorial layout */}
        <section className="relative px-6 md:px-14 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border-warm/30">
          {/* Gopuram backdrop */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none opacity-[0.10] lg:opacity-[0.14]">
            <Gopuram width={1200} height={240} />
          </div>

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 text-left flex flex-col items-start relative z-10">
              {/* Thoranam festoon at the top */}
              <div className="mb-6 opacity-90 hidden sm:block">
                <Thoranam width={420} height={24} />
              </div>

              {/* Eyebrow label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border-warm bg-paper/70 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-pulse" />
                <span className="eyebrow eyebrow-sm text-burgundy tracking-wide">
                  <span data-bi lang="ta">செவ்விலக்கியம் · சமகாலம் · கட்டுரைகள்</span>
                  <span data-bi lang="en">Classics · Contemporary · Essays</span>
                </span>
              </div>

              <h1
                lang="ta"
                className="ta-display text-burgundy leading-none tracking-tight"
                style={{ fontSize: "clamp(46px, 6.2vw, 76px)", fontWeight: 500, lineHeight: 1.12, marginBottom: 16 }}
              >
                தமிழின் வாசிப்பு வீடு.
              </h1>
              
              <p
                lang="en"
                className="text-ink-2 mb-4"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, lineHeight: 1.25 }}
              >
                A reading home for Tamil literature — from the classical to the contemporary.
              </p>

              <p
                lang="ta"
                className="ta text-ink-3 max-w-xl mb-8"
                style={{ fontSize: 16, lineHeight: 1.7 }}
              >
                திருக்குறள் முதல் இன்றைய சிறுகதைகள் வரை — செவ்விலக்கியப் படைப்புகள் மற்றும் சமகால எழுத்துகள் அனைத்தும் ஒரே இடத்தில்.
              </p>

              <div className="flex flex-wrap gap-4 mb-10 w-full sm:w-auto">
                <Link href="/books" className="btn btn-primary rounded-sm shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                  <span data-bi lang="ta">வாசிப்பைத் தொடங்குங்கள்</span>
                  <span data-bi lang="en">Start reading</span>
                  <span>→</span>
                </Link>
                <Link href="/blogs" className="btn btn-ghost rounded-sm hover:bg-paper/50 transition-all duration-300 w-full sm:w-auto">
                  <span data-bi lang="ta">கட்டுரைகள்</span>
                  <span data-bi lang="en">Articles</span>
                </Link>
              </div>

              {/* Redesigned Metric Strip */}
              <div
                className="w-full grid grid-cols-2 md:grid-cols-4 border border-border-warm rounded-sm shadow-sm"
                style={{ background: "rgba(244,233,203,.35)" }}
              >
                {[
                  { n: `${bookCount}+`, ta: "புத்தகங்கள்", en: "Books" },
                  { n: `${articleCount}+`, ta: "கட்டுரைகள்", en: "Articles" },
                  { n: `${authorCount}+`, ta: "ஆசிரியர்கள்", en: "Authors" },
                  { n: `₹${price}`, ta: "மாதம் ஒன்றுக்கு", en: "Per month" },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="text-center px-4 py-4.5 md:py-5"
                    style={{ borderLeft: i === 0 ? "none" : "1px solid var(--border-warm)" }}
                  >
                    <div className="display text-burgundy font-semibold" style={{ fontSize: 24, lineHeight: 1 }}>
                      {m.n}
                    </div>
                    <div lang="ta" className="ta text-ink-3 mt-1.5" style={{ fontSize: 11, fontWeight: 500 }}>
                      {m.ta}
                    </div>
                    <div className="eyebrow eyebrow-sm mt-0.5 text-gold">{m.en}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Visual Interactive Gallery */}
            <div className="lg:col-span-5 w-full flex flex-col items-center justify-center relative min-h-[380px] lg:min-h-[440px]">
              {/* Arched backdrop frame */}
              <div 
                className="absolute inset-0 border border-border-warm/40 rounded-t-[120px] bg-gradient-to-b from-sandalwood/10 to-sandalwood/30 pointer-events-none"
                style={{ clipPath: "ellipse(80% 100% at 50% 100%)" }}
              />

              {/* Book Deck */}
              <div className="relative w-[230px] h-[300px] sm:w-[260px] sm:h-[350px] mr-4 lg:mr-0">
                {featuredBooks.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center border border-border-warm bg-paper/60 p-6 rounded-md shadow-md">
                    <PeacockEye size={60} opacity={0.6} />
                    <p lang="ta" className="ta text-ink-3 text-center mt-4">புத்தகங்கள் விரைவில்...</p>
                  </div>
                ) : (
                  featuredBooks.slice(0, 3).map((book, idx) => {
                    const data = toCardData(book);
                    const coverVariant = pickCoverVariant(data.slug);
                    const emblem = emblemFromTitle(data.titleTamil);
                    
                    // Fine-tuned rotations and positioning for physical stacked feel
                    const rotDeg = idx === 0 ? "-7deg" : idx === 1 ? "5deg" : "-1deg";
                    const zIndex = 30 - idx * 10;
                    const offsetLeft = idx === 0 ? "-24px" : idx === 1 ? "42px" : "12px";
                    const offsetTop = idx === 0 ? "12px" : idx === 1 ? "-10px" : "32px";
                    
                    return (
                      <Link 
                        key={book.id} 
                        href={`/books/${data.slug}`}
                        className="absolute w-full h-full transition-all duration-500 hover:scale-105 hover:!z-40 hover:-translate-y-4 group"
                        style={{
                          transform: `rotate(${rotDeg}) translate(${offsetLeft}, ${offsetTop})`,
                          zIndex: zIndex,
                        }}
                      >
                        {/* Book casing with custom shadows */}
                        <div 
                          className="relative h-full w-full border border-border-warm p-1.5 rounded-sm shadow-md group-hover:shadow-2xl transition-shadow duration-300"
                          style={{ background: "var(--paper)" }}
                        >
                          <Cover
                            titleTamil={data.titleTamil}
                            author={data.authorNameTamil}
                            emblem={emblem}
                            variant={coverVariant}
                            src={data.coverImageUrl}
                            className="h-full w-full"
                          />
                          
                          {/* Details hover drawer */}
                          <div className="absolute inset-x-2 bottom-2 bg-paper/95 border border-border-warm px-3 py-2 rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transform transition-transform">
                            <span className="eyebrow eyebrow-sm text-gold block">{data.categoryTamil || "நூல்"}</span>
                            <span lang="ta" className="ta text-xs font-semibold text-ink line-clamp-1 block leading-tight">{data.titleTamil}</span>
                            <span lang="ta" className="ta text-[10px] text-ink-3 line-clamp-1 block mt-0.5">{data.authorNameTamil}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Badge label below */}
              <div 
                className="absolute bottom-[-16px] border border-border-warm px-4 py-1.5 bg-paper shadow-sm rounded-full z-30 pointer-events-none"
              >
                <span className="eyebrow eyebrow-sm text-burgundy tracking-widest">
                  <span data-bi lang="ta">சிறப்புப் பரிந்துரைகள்</span>
                  <span data-bi lang="en">FEATURED BOOKS</span>
                </span>
              </div>
            </div>
          </div>
        </section>

       


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
            <div className="trim mx-6 md:mx-14" />

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


         {/* REDESIGNED EDITORIAL PRICING BLOCK (Always visible) */}
        <section
          className="relative px-6 md:px-14 py-16 md:py-24 border-b border-border-warm/60 overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 10% 20%, rgba(148,120,59,0.06), transparent 45%), radial-gradient(circle at 90% 80%, rgba(174,56,44,0.06), transparent 45%), var(--paper)",
          }}
        >
          {/* Margins line accent */}
          <div className="absolute inset-y-0 left-6 right-6 md:left-14 md:right-14 border-l border-r border-border-warm/20 pointer-events-none" />

          <div className="absolute left-8 md:left-16 top-12 opacity-[0.22] pointer-events-none hidden sm:block">
            <PeacockEye size={60} />
          </div>
          <div className="absolute right-8 md:right-16 top-12 opacity-[0.22] pointer-events-none hidden sm:block">
            <PeacockEye size={60} flip />
          </div>

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <Divider label="சந்தா திட்டம் · Premium Plans" />
            <h2
              className="ta-display text-burgundy mt-8 mb-4"
              style={{ fontSize: "clamp(32px, 5.2vw, 46px)", fontWeight: 500, lineHeight: 1.2 }}
            >
              <span data-bi lang="ta">
                மாதம் ₹{price}-க்கு<br />முழு நூலகம்.
              </span>
              <span data-bi lang="en">
                ₹{price}/month<br />for the whole library.
              </span>
            </h2>
            
            <p
              className="text-ink-2 max-w-xl mx-auto mb-10 text-[16px]"
              style={{ lineHeight: 1.6 }}
            >
              <span data-bi lang="ta">இலவசக் கணக்கில் சில பக்கங்களை வாசிக்கலாம். முழமையாக, விளம்பரங்கள் இன்றி வாசிக்க சந்தாதாரராக இணையுங்கள்.</span>
              <span data-bi lang="en">Enjoy limited preview access on the free plan, or subscribe for unlimited, uninterrupted reading of classical and modern Tamil literature.</span>
            </p>

            <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8 text-left mt-8">
              {/* Free Card */}
              <div className="flex flex-col border border-border-warm bg-paper rounded-lg p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="absolute top-[-10px] right-[-10px] w-20 h-20 border border-border-warm/30 rotate-45" />
                </div>
                
                <div className="eyebrow text-gold">
                  <span data-bi lang="ta">இலவசம் · Free</span>
                  <span data-bi lang="en">Free Plan</span>
                </div>
                <div className="display text-ink mt-4 font-semibold" style={{ fontSize: 36 }}>
                  ₹0
                  <span className="text-sm font-normal text-ink-3 italic font-sans"> / forever</span>
                </div>
                <p className="ta text-ink-3 mt-1.5 text-xs font-semibold">அடிப்படை வாசிப்பு</p>
                <hr className="my-5 border-border-warm/60" />
                <ul className="flex flex-col gap-3.5 flex-grow mb-6">
                  <li className="ta text-ink-2 flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="text-burgundy mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">அனைத்து கட்டுரைகளும் வாசிக்கலாம்</span>
                      <span data-bi lang="en">Access to all journal articles</span>
                    </span>
                  </li>
                  <li className="ta text-ink-2 flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="text-burgundy mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">நூல்களின் முதல் 2 பக்கங்கள் மட்டும்</span>
                      <span data-bi lang="en">First 2 pages of premium books</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Premium Card - Styled in Burgundy Red */}
              <div 
                className="flex flex-col border-2 border-gold rounded-lg p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden text-sandalwood"
                style={{ background: "var(--burgundy)" }}
              >
                <div className="absolute top-3 right-3 bg-logo-yellow text-ink px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-sm">
                  <span data-bi lang="ta">பரிந்துரை</span>
                  <span data-bi lang="en">RECOMMENDED</span>
                </div>
                <div className="absolute top-[-10px] right-[-10px] opacity-[0.08] pointer-events-none scale-150">
                  <PeacockEye size={120} />
                </div>
                
                <div className="eyebrow relative z-10" style={{ color: "var(--logo-yellow)" }}>
                  <span data-bi lang="ta">சந்தா · Premium</span>
                  <span data-bi lang="en">Premium Plan</span>
                </div>
                <div className="display mt-4 relative z-10 font-semibold text-logo-yellow" style={{ fontSize: 36 }}>
                  ₹{price}
                  <span className="text-sm font-normal text-sandalwood-2 italic font-sans" style={{ color: "rgba(244,233,203,0.7)" }}> /மாதம்</span>
                </div>
                <p className="ta mt-1.5 text-xs relative z-10 font-semibold text-sandalwood-2">முழு நூலகமும் உங்கள் கைகளில்</p>
                <hr className="my-5 relative z-10" style={{ borderColor: "rgba(244, 233, 203, 0.2)" }} />
                <ul className="flex flex-col gap-3.5 relative z-10 flex-grow mb-6">
                  <li className="ta flex items-start gap-2.5 text-sm leading-relaxed">
                    <span style={{ color: "var(--logo-yellow)" }} className="mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">வரம்பற்ற நூல்கள் வாசிப்பு</span>
                      <span data-bi lang="en">Unlimited reading of all books</span>
                    </span>
                  </li>
                  <li className="ta flex items-start gap-2.5 text-sm leading-relaxed">
                    <span style={{ color: "var(--logo-yellow)" }} className="mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">மாதம்தோறும் புதிய நூல்கள்</span>
                      <span data-bi lang="en">Access to new releases monthly</span>
                    </span>
                  </li>
                  <li className="ta flex items-start gap-2.5 text-sm leading-relaxed">
                    <span style={{ color: "var(--logo-yellow)" }} className="mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">விளம்பரங்கள் இல்லாத வாசிப்பு</span>
                      <span data-bi lang="en">Fully ad-free experience</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href={user ? "/account/subscription" : "/register?next=/account/subscription"}
                className="btn btn-primary shadow-md hover:shadow-lg transition-all duration-300"
                style={{ padding: "13px 36px", fontSize: 14 }}
              >
                <span data-bi lang="ta">₹{price}-ல் சேருங்கள்</span>
                <span data-bi lang="en">Join at ₹{price}</span>
                <span style={{ opacity: 0.6 }}>→</span>
              </Link>
            </div>
            <p
              className="text-ink-3 mt-4"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 12 }}
            >
              UPI · Cards · Net Banking · Powered by Razorpay
            </p>
          </div>
        </section>
        

        {/* VIDEOS — from the channel */}
        <VideosSection />
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
