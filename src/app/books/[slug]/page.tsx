import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cover, pickCoverVariant, emblemFromTitle } from "@/components/brand/Cover";
import { ContentCard, type ContentCardData } from "@/components/content/ContentCard";
import { Divider } from "@/components/brand/Decor";
import { getPublicContentBySlug } from "@/lib/content";
import { getSetting } from "@/lib/settings";
import { JsonLd, bookLd, breadcrumbLd } from "@/lib/jsonld";
import { prisma } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getPublicContentBySlug(slug);
  if (!c) return { title: "Not found" };
  return {
    title: c.metaTitle ?? `${c.titleTamil}${c.titleEnglish ? ` — ${c.titleEnglish}` : ""}`,
    description: c.metaDescription ?? c.description ?? undefined,
    openGraph: {
      title: c.titleTamil,
      description: c.description ?? undefined,
      images: c.ogImageUrl ? [c.ogImageUrl] : c.coverImageUrl ? [c.coverImageUrl] : [],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getPublicContentBySlug(slug);
  if (!book || book.type !== "PDF") notFound();

  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;
  const primaryAuthor = book.contentAuthors[0]?.author;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Related — same author or category, exclude current
  const relatedAuthorId = book.contentAuthors[0]?.authorId;
  const related = await prisma.content.findMany({
    where: {
      type: "PDF",
      status: "PUBLISHED",
      deletedAt: null,
      id: { not: book.id },
      ...(relatedAuthorId
        ? { contentAuthors: { some: { authorId: relatedAuthorId } } }
        : {}),
    },
    include: {
      contentAuthors: { include: { author: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      contentCategories: { include: { category: true }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  const coverVariant = pickCoverVariant(book.slug);

  return (
    <>
      <JsonLd
        data={[
          bookLd({
            slug: book.slug,
            titleTamil: book.titleTamil,
            titleEnglish: book.titleEnglish,
            description: book.description,
            coverImageUrl: book.coverImageUrl,
            authors: book.contentAuthors.map((ca) => ({
              slug: ca.author.slug,
              nameTamil: ca.author.nameTamil,
              nameEnglish: ca.author.nameEnglish,
            })),
            pageCount: book.pageCount,
            publicationYear: book.publicationYear,
            publisher: book.publisher,
            isbn: book.isbn,
            language: book.language,
            isPremium: book.isPremium,
            publishedAt: book.publishedAt,
            averageRating: book.averageRating?.toString() ?? null,
            reviewCount: book.reviewCount,
          }),
          breadcrumbLd([
            { name: "Home", url: base },
            { name: "Books", url: `${base}/books` },
            { name: book.titleEnglish ?? book.titleTamil, url: `${base}/books/${book.slug}` },
          ]),
        ]}
      />

      <Header />
      <main className="flex-1 paper-warm">
        {/* Breadcrumb */}
        <div className="px-6 md:px-14 pt-5">
          <div
            className="max-w-7xl mx-auto flex gap-2 items-center"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "var(--ink-3)" }}
          >
            <Link href="/" className="hover:text-burgundy">Home</Link>
            <span className="text-gold">›</span>
            <Link href="/books" className="hover:text-burgundy">Books</Link>
            <span className="text-gold">›</span>
            <span className="text-burgundy truncate">{book.titleEnglish ?? book.titleTamil}</span>
          </div>
        </div>

        {/* Detail */}
        <section className="px-6 md:px-14 py-8 md:py-14">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[380px_1fr] gap-10 lg:gap-16 items-start">
          {/* Cover column */}
          <div>
            <div
              className="relative border border-border-warm p-2.5 rounded-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg inline-block w-full max-w-[380px]"
              style={{ background: "rgba(241,230,210,0.5)" }}
            >
              <Cover
                titleTamil={book.titleTamil}
                author={primaryAuthor?.nameTamil}
                emblem={emblemFromTitle(book.titleTamil)}
                variant={coverVariant}
                src={book.coverImageUrl}
              />
            </div>
          </div>

          {/* Metadata column */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className={book.isPremium 
                ? "bg-gradient-gold text-ink px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5"
                : "bg-paper text-ink border border-border-warm px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5"}>
                {book.isPremium ? (
                  <>
                    <span data-bi lang="ta">சந்தா</span>
                    <span data-bi lang="en">Premium</span>
                  </>
                ) : (
                  <>
                    <span data-bi lang="ta">இலவசம்</span>
                    <span data-bi lang="en">Free</span>
                  </>
                )}
              </span>
              {book.isFeatured && (
                <span className="bg-ink text-sandalwood px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5">
                  <span data-bi lang="ta">சிறப்பு</span>
                  <span data-bi lang="en">Featured</span>
                </span>
              )}
              {book.contentCategories.map((cc) => (
                <span key={cc.category.slug} className="eyebrow eyebrow-sm mb-0">
                  <span lang="ta">{cc.category.nameTamil}</span>
                </span>
              ))}
            </div>

            <h1
              lang="ta"
              className="ta-display text-ink"
              style={{ fontSize: "clamp(42px, 6.5vw, 64px)", lineHeight: 1.15, marginBottom: 16 }}
            >
              {book.titleTamil}
            </h1>
            {book.titleEnglish && (
              <p
                lang="en"
                className="text-ink-2"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, marginBottom: 26 }}
              >
                {book.titleEnglish}
              </p>
            )}

            {/* Author + dates strip */}
            <div
              className="flex flex-wrap gap-x-8 gap-y-4 py-5 mb-8 border-y border-border-warm/60"
            >
              {primaryAuthor && (
                <div>
                  <div className="eyebrow text-ink-3 mb-1.5 flex gap-1.5">
                    <span data-bi lang="ta">எழுத்தாளர்</span>
                    <span data-bi lang="en">Author</span>
                  </div>
                  <p lang="ta" className="ta text-ink font-semibold" style={{ fontSize: 18 }}>
                    {primaryAuthor.nameTamil}
                  </p>
                  {primaryAuthor.nameEnglish && (
                    <p
                      className="text-ink-3 mt-0.5"
                      style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
                    >
                      {primaryAuthor.nameEnglish}
                    </p>
                  )}
                </div>
              )}
              {book.publicationYear && (
                <>
                  <div className="hidden sm:block border-l border-border-warm/60" />
                  <div>
                    <div className="eyebrow text-ink-3 mb-1.5 flex gap-1.5">
                      <span data-bi lang="ta">பதிப்பு</span>
                      <span data-bi lang="en">Published</span>
                    </div>
                    <p className="text-ink font-semibold" style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
                      {book.publicationYear}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <p lang="ta" className="ta text-ink mb-4" style={{ fontSize: 16, lineHeight: 1.85 }}>
                {book.description}
              </p>
            )}

            {/* Key/value Bento grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {([
                { k: { ta: "பக்கங்கள்", en: "Pages" }, v: book.pageCount?.toLocaleString() ?? "—" },
                { k: { ta: "மொழி", en: "Language" }, v: book.language === "BILINGUAL" ? "Tamil + English" : book.language === "EN" ? "English" : "Tamil · தமிழ்" },
                { k: { ta: "வடிவம்", en: "Format" }, v: "PDF · Digital" },
                { k: { ta: "ISBN", en: "ISBN" }, v: book.isbn ?? "—" },
                { k: { ta: "பதிப்பகம்", en: "Publisher" }, v: book.publisher ?? "—" },
                { k: { ta: "ஆண்டு", en: "Year" }, v: book.publicationYear?.toString() ?? "—" },
              ]).map((kv, i) => (
                <div
                  key={i}
                  className="bg-paper border border-border-warm rounded-[16px] p-4 flex flex-col justify-center shadow-sm"
                >
                  <div className="eyebrow text-[10px] text-ink-3 mb-1.5 flex gap-1.5 uppercase">
                    <span data-bi lang="ta">{kv.k.ta}</span>
                    <span data-bi lang="en">{kv.k.en}</span>
                  </div>
                  <p className="text-ink font-medium" style={{ fontSize: 14 }}>
                    {kv.v}
                  </p>
                </div>
              ))}
            </div>

            {/* Read CTA */}
            <div className="flex flex-wrap gap-3.5 items-center">
              <Link
                href={`/books/${book.slug}/read`}
                className="btn btn-primary"
                style={{ padding: "15px 36px", fontSize: 15 }}
              >
                <span data-bi lang="ta">வாசிக்கத் தொடங்கு</span>
                <span data-bi lang="en">Start reading</span>
                <span style={{ opacity: 0.6 }}>→</span>
              </Link>
              {book.isPremium && (
                <Link
                  href={`/books/${book.slug}/read`}
                  className="btn btn-ghost"
                  style={{ padding: "13px 22px", fontSize: 13 }}
                >
                  <span data-bi lang="ta">மாதிரி பார்வையிடு</span>
                  <span data-bi lang="en">Preview sample</span>
                </Link>
              )}
            </div>
            {book.isPremium && (
              <p
                lang="ta"
                className="ta text-gold mt-3.5 flex items-center gap-2"
                style={{ fontSize: 13 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    background: "var(--turmeric)",
                    transform: "rotate(45deg)",
                  }}
                />
                <span data-bi lang="ta">இலவசத்திட்டத்தில் முதல் இரண்டு பக்கங்கள் கிடைக்கும். தொடர்ந்து வாசிக்க ₹99/மாதம்.</span>
                <span data-bi lang="en">First two pages are free. Continue reading for ₹99/month.</span>
              </p>
            )}
          </div>
          </div>
        </section>

        <div className="trim mx-6 md:mx-14" />

        {/* Related */}
        {related.length > 0 && (
          <section className="px-6 md:px-14 py-12 md:py-16">
            <div className="max-w-7xl mx-auto">
            <Divider
              label={
                relatedAuthorId && primaryAuthor
                  ? `Also by ${primaryAuthor.nameEnglish ?? primaryAuthor.nameTamil}`
                  : "Related Books"
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 mt-8">
              {related.map((b) => {
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
                  categoryTamil: b.contentCategories?.[0]?.category?.nameTamil ?? null,
                  pageCount: b.pageCount,
                  readingTimeMinutes: b.readingTimeMinutes,
                };
                return <ContentCard key={b.id} item={card} />;
              })}
            </div>
            </div>
          </section>
        )}
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
