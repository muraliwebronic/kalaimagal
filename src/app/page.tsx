import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { VideosSection } from "@/components/home/VideosSection";
import { Gopuram, PeacockEye, Thoranam, Divider } from "@/components/brand/Decor";
import { ArrowUpRight } from "lucide-react";
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
        {/* TRADITIONAL & MODERN ADAPTIVE HERO */}
        <section className="relative w-full overflow-hidden bg-paper-warm border-b border-border-warm/30 pt-10 pb-28 md:pt-20 md:pb-40">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
            <Gopuram width={800} height={800} className="text-ink" />
          </div>
          <div className="absolute bottom-0 left-0 opacity-[0.02] pointer-events-none -translate-x-1/4 translate-y-1/4">
            <PeacockEye size={600} className="text-ink" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-14 flex flex-col md:flex-row items-center gap-12 md:gap-20">
            
            {/* Left: Typography & CTAs */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy/5 border border-burgundy/10 mb-6 md:mb-8 shadow-sm">
                 <PeacockEye className="size-4 text-burgundy" />
                 <span className="text-burgundy text-[11px] md:text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-display)" }}>
                   <span data-bi lang="ta">கலைமகள் இதழ்</span>
                   <span data-bi lang="en">Kalaimagal Magazine</span>
                 </span>
              </div> */}
              
              <h1
                lang="ta"
                className="ta-display text-ink leading-[1.15] tracking-tight mb-5 md:mb-6"
                style={{ fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 700 }}
              >
                தமிழின் <br className="hidden md:block" />
                வாசிப்பு வீடு.
              </h1>

              <p
                lang="ta"
                className="ta text-ink-2 max-w-xl text-[16px] md:text-[20px] leading-relaxed mb-8 md:mb-10"
              >
                திருக்குறள் முதல் இன்றைய சிறுகதைகள் வரை — செவ்விலக்கியப் படைப்புகள் மற்றும் சமகால எழுத்துகள் அனைத்தும் ஒரே இடத்தில். ஓர் புதிய டிஜிட்டல் வாசிப்பு அனுபவம்.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/books" className="w-full sm:w-auto btn rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all text-[16px] flex items-center justify-center gap-2 bg-ink text-paper hover:bg-ink-2 group">
                  <span data-bi lang="ta" className="font-semibold">வாசிப்பைத் தொடங்குங்கள்</span>
                  <span data-bi lang="en" className="font-semibold">Start Reading</span>
                  <ArrowUpRight className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link href="/blogs" className="w-full sm:w-auto btn bg-transparent border-2 border-border-warm text-ink font-semibold rounded-full px-8 py-3.5 hover:bg-black/5 transition-colors text-[16px] flex items-center justify-center">
                  <span data-bi lang="ta">கட்டுரைகள் வாசிக்க</span>
                  <span data-bi lang="en">Read Journal</span>
                </Link>
              </div>
            </div>

            {/* Right: Modern Adaptive Visual Composition */}
            <div className="flex-1 w-full relative flex items-center justify-center mt-6 md:mt-0">
               <div className="relative w-full max-w-[340px] md:max-w-[480px] aspect-square flex items-center justify-center">
                  {/* Decorative rotating background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/10 via-paper to-turmeric/10 rounded-full animate-[spin_40s_linear_infinite]" />
                  <div className="absolute inset-2 md:inset-4 bg-paper rounded-full border border-border-warm/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-center" />
                  
                  {/* Central Logo */}
                  <img src="/uploads/logo.png" className="relative z-10 w-[65%] h-[65%] object-contain drop-shadow-2xl" alt="Kalaimagal Logo" />
                  
                  {/* Floating Featured Element */}
                  {featuredBooks.length > 0 && featuredBooks[0].coverImageUrl && (
                    <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-[130px] md:w-[180px] aspect-[4/5] rounded-[16px] overflow-hidden shadow-2xl border-[6px] border-paper transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 z-20 group">
                       <img src={featuredBooks[0].coverImageUrl} className="w-full h-full object-cover" alt="Featured Book" />
                       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent p-3 pt-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                         <div className="text-turmeric text-[9px] md:text-[10px] font-bold tracking-wider uppercase mb-0.5">Featured</div>
                         <div className="text-paper text-[11px] md:text-xs font-semibold line-clamp-1">{featuredBooks[0].titleTamil}</div>
                       </div>
                    </div>
                  )}
               </div>
            </div>

          </div>
        </section>

        {/* IMPACTFUL PREMIUM BANNER */}
        <section className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-8 -mt-12 md:-mt-20 mb-16 md:mb-24">
          <div className="relative w-full rounded-[32px] md:rounded-[40px] overflow-hidden bg-ink shadow-2xl p-8 md:p-12 lg:p-16 border border-border-warm/20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700">
            {/* Rich Background & Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-turmeric/20 via-ink to-ink pointer-events-none"></div>
            <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none -translate-x-1/4 translate-y-1/4">
              <Gopuram width={500} height={500} className="text-paper" />
            </div>
            
            {/* Left Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-turmeric/10 border border-turmeric/20 text-turmeric text-[11px] font-bold tracking-wider uppercase mb-6 shadow-sm">
                <span data-bi lang="ta">சந்தா</span>
                <span data-bi lang="en">Premium Access</span>
              </span>
              
              <h3 lang="ta" className="ta-display text-paper text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
                முழு நூலகமும் உங்கள் கைகளில்.
              </h3>
              
              <p className="text-paper/70 text-base md:text-lg max-w-xl leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                Unlock the entire Kalaimagal archives, modern literary collections, and exclusive premium journals with a single subscription.
              </p>
            </div>

            {/* Right Content / CTA */}
            <div className="relative z-10 shrink-0 flex flex-col items-center gap-5 w-full md:w-auto">
              <div className="flex flex-col items-center justify-center p-8 rounded-[24px] bg-paper/5 backdrop-blur-md border border-white/5 w-full sm:w-[320px]">
                <div className="text-paper/50 text-xs tracking-widest uppercase font-semibold mb-2">Monthly Plan</div>
                <div className="flex items-baseline gap-1.5 mb-8 text-turmeric">
                  <span className="text-5xl font-bold tracking-tighter">₹{price}</span>
                  <span className="text-sm font-medium opacity-80">/ மாதம்</span>
                </div>
                
                <Link href="/account/subscription" className="w-full btn bg-gradient-gold text-ink font-bold text-[16px] px-8 py-4.5 rounded-[16px] shadow-[0_0_20px_rgba(216,184,124,0.3)] hover:shadow-[0_0_30px_rgba(216,184,124,0.5)] transition-all hover:scale-105 flex items-center justify-center gap-2">
                  <span>Join Now</span>
                  <ArrowUpRight className="size-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

       


        {/* FEATURED BOOKS */}
        <section className="px-6 md:px-14 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
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

   

            {/* VIDEOS — from the channel */}
        <VideosSection />
         {/* MAJESTIC EDITORIAL PRICING BLOCK */}
        <section
          className="relative px-6 md:px-14 py-20 md:py-32 border-b border-border-warm/60 overflow-hidden"
          style={{
            background: "linear-gradient(to bottom, var(--paper-warm), var(--paper))",
          }}
        >
          {/* Background Decor */}
          <div className="absolute left-0 top-0 opacity-[0.03] pointer-events-none -translate-x-1/4 -translate-y-1/4">
            <Thoranam width={800} height={800} className="text-burgundy" />
          </div>
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4">
            <PeacockEye size={600} className="text-ink" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-24">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-gold text-ink text-[11px] font-bold tracking-wider uppercase mb-6 shadow-sm">
                <span data-bi lang="ta">உறுப்பினர் திட்டம்</span>
                <span data-bi lang="en">Membership</span>
              </span>
              
              <h2
                className="ta-display text-ink"
                style={{ fontSize: "clamp(36px, 6vw, 54px)", fontWeight: 700, lineHeight: 1.15 }}
              >
                <span data-bi lang="ta">வாசகராக இணையுங்கள்.</span>
                <span data-bi lang="en">Become a reader.</span>
              </h2>
              
              <p className="text-ink-2 max-w-2xl mx-auto mt-6 text-lg md:text-xl leading-relaxed font-medium">
                <span data-bi lang="ta">இலவசக் கணக்கில் சில பக்கங்களை வாசிக்கலாம். முழுமையாக, விளம்பரங்கள் இன்றி வாசிக்க சந்தாதாரராக இணையுங்கள்.</span>
                <span data-bi lang="en">Enjoy limited preview access on the free plan, or subscribe for unlimited, uninterrupted reading of classical and modern Tamil literature.</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto items-center">
              {/* Free Card */}
              <div className="relative flex flex-col border border-border-warm/60 bg-white/60 backdrop-blur-md rounded-[40px] p-10 md:p-12 shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                  <PeacockEye size={60} className="text-ink" />
                </div>
                
                <h3 className="text-2xl font-bold text-ink mb-2">Free Plan</h3>
                <div className="flex items-baseline gap-2 mb-2 text-ink">
                  <span className="text-5xl font-extrabold tracking-tighter">₹0</span>
                </div>
                <p className="ta text-ink-3 text-sm font-semibold mb-8">அடிப்படை வாசிப்பு</p>
                
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  <li className="flex items-start gap-3 text-base text-ink-2">
                    <span className="text-burgundy mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">அனைத்து கட்டுரைகளும் வாசிக்கலாம்</span>
                      <span data-bi lang="en">Access to all journal articles</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-ink-2">
                    <span className="text-burgundy mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">நூல்களின் முதல் 2 பக்கங்கள் மட்டும்</span>
                      <span data-bi lang="en">First 2 pages of premium books</span>
                    </span>
                  </li>
                </ul>
                
                <Link href={user ? "/account" : "/register"} className="w-full btn bg-transparent border-2 border-border-warm text-ink font-bold text-[16px] px-8 py-4 rounded-2xl hover:bg-black/5 transition-colors text-center">
                  Sign Up Free
                </Link>
              </div>

              {/* Premium Card - Majestic & Larger */}
              <div className="relative flex flex-col border-none bg-ink text-paper rounded-[40px] p-10 md:p-14 shadow-2xl hover:-translate-y-2 transition-all duration-500 transform md:scale-105 z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-turmeric/30 via-ink to-ink pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 opacity-[0.05] pointer-events-none translate-x-1/4 translate-y-1/4">
                  <Gopuram width={300} height={300} className="text-paper" />
                </div>
                
                <div className="absolute top-6 right-6 bg-gradient-gold text-ink px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-md">
                  RECOMMENDED
                </div>
                
                <h3 className="text-2xl font-bold text-paper mb-2 relative z-10">Premium Plan</h3>
                <div className="flex items-baseline gap-2 mb-2 text-turmeric relative z-10">
                  <span className="text-6xl font-extrabold tracking-tighter">₹{price}</span>
                  <span className="text-sm font-medium opacity-80">/ மாதம்</span>
                </div>
                <p className="ta text-paper/70 text-sm font-semibold mb-8 relative z-10">முழு நூலகமும் உங்கள் கைகளில்</p>
                
                <ul className="flex flex-col gap-4 mb-10 flex-grow relative z-10">
                  <li className="flex items-start gap-3 text-base text-paper/90">
                    <span className="text-turmeric mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">வரம்பற்ற நூல்கள் வாசிப்பு</span>
                      <span data-bi lang="en">Unlimited reading of all books</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-paper/90">
                    <span className="text-turmeric mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">மாதம்தோறும் புதிய நூல்கள்</span>
                      <span data-bi lang="en">Access to new releases monthly</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-base text-paper/90">
                    <span className="text-turmeric mt-0.5">✓</span> 
                    <span>
                      <span data-bi lang="ta">விளம்பரங்கள் இல்லாத வாசிப்பு</span>
                      <span data-bi lang="en">Fully ad-free experience</span>
                    </span>
                  </li>
                </ul>
                
                <Link href={user ? "/account/subscription" : "/register?next=/account/subscription"} className="relative z-10 w-full btn bg-gradient-gold text-ink font-bold text-[16px] px-8 py-4.5 rounded-2xl shadow-[0_0_20px_rgba(216,184,124,0.3)] hover:shadow-[0_0_30px_rgba(216,184,124,0.5)] transition-all flex items-center justify-center gap-2">
                  <span>Join Premium</span>
                  <ArrowUpRight className="size-5" />
                </Link>
              </div>
            </div>
            
            <p className="text-center text-ink-3 mt-14" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13 }}>
              Secure payments powered by Razorpay. Supports UPI, Cards & Net Banking.
            </p>
          </div>
        </section>
        

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentArticles.map((a, i) => (
                <Link key={a.id} href={`/blogs/${a.slug}`} className="group block">
                  <article className="h-full border border-border-warm bg-paper rounded-[28px] p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.05]">
                      <Thoranam width={400} height={30} className="w-full h-auto text-ink" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="eyebrow mb-4">
                        {a.contentCategories[0]?.category.nameTamil ?? "Article"}
                        <span style={{ color: "var(--gold)", margin: "0 6px" }}>·</span>
                        0{i + 1}
                      </div>
                      <h3
                        lang="ta"
                        className="ta-display text-ink mb-3 group-hover:text-burgundy transition-colors"
                        style={{ fontSize: 24, lineHeight: 1.3 }}
                      >
                        {a.titleTamil}
                      </h3>
                      {a.titleEnglish && (
                        <p
                          lang="en"
                          className="text-ink-3 mb-4"
                          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
                        >
                          {a.titleEnglish}
                        </p>
                      )}
                      <div className="mt-auto pt-6 border-t border-border-warm/60">
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
                      </div>
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
