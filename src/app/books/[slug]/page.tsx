import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cover, pickCoverVariant, emblemFromTitle } from "@/components/brand/Cover";
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
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[380px_1fr] gap-10 md:gap-16">
          {/* Cover column */}
          <div>
            <Cover
              titleTamil={book.titleTamil}
              author={primaryAuthor?.nameTamil}
              emblem={emblemFromTitle(book.titleTamil)}
              variant={coverVariant}
              src={book.coverImageUrl}
            />
          </div>

          {/* Metadata column */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={book.isPremium ? "badge-km badge-km-premium" : "badge-km badge-km-free"}>
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
                <span className="badge-km badge-km-gold">★ Featured</span>
              )}
              {book.contentCategories.map((cc) => (
                <span key={cc.category.slug} className="badge-km badge-km-chip">
                  <span lang="ta">{cc.category.nameTamil}</span>
                </span>
              ))}
            </div>

            <h1
              lang="ta"
              className="ta-display text-burgundy"
              style={{ fontSize: "clamp(40px, 6.5vw, 62px)", lineHeight: 1.1, marginBottom: 12 }}
            >
              {book.titleTamil}
            </h1>
            {book.titleEnglish && (
              <p
                lang="en"
                className="text-ink-2"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, marginBottom: 22 }}
              >
                {book.titleEnglish}
              </p>
            )}

            {/* Author + dates strip */}
            <div
              className="flex flex-wrap gap-6 py-4 border-y border-border-warm"
              style={{ marginBottom: 26 }}
            >
              {primaryAuthor && (
                <div>
                  <div className="eyebrow eyebrow-sm">Author</div>
                  <p lang="ta" className="ta text-ink mt-1" style={{ fontSize: 16 }}>
                    {primaryAuthor.nameTamil}
                  </p>
                  {primaryAuthor.nameEnglish && (
                    <p
                      className="text-ink-3"
                      style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13 }}
                    >
                      {primaryAuthor.nameEnglish}
                    </p>
                  )}
                </div>
              )}
              {book.publicationYear && (
                <>
                  <div className="border-l border-border-warm" />
                  <div>
                    <div className="eyebrow eyebrow-sm">First Published</div>
                    <p className="text-ink mt-1" style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>
                      {book.publicationYear}
                    </p>
                  </div>
                </>
              )}
              {book.publishedAt && (
                <>
                  <div className="border-l border-border-warm" />
                  <div>
                    <div className="eyebrow eyebrow-sm">Added</div>
                    <p className="text-ink mt-1" style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>
                      {book.publishedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
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

            {/* Key/value grid */}
            <div className="frame mb-7" style={{ padding: 0 }}>
              <div className="grid grid-cols-2 sm:grid-cols-3">
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
                    className="px-4 py-3.5"
                    style={{
                      borderRight: i % 3 === 2 ? "none" : "1px solid var(--border-soft)",
                      borderBottom: i < 3 ? "1px solid var(--border-soft)" : "none",
                    }}
                  >
                    <div className="eyebrow eyebrow-sm mb-1">
                      <span data-bi lang="ta">{kv.k.ta}</span>
                      <span data-bi lang="en">{kv.k.en}</span>
                    </div>
                    <p className="text-ink" style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>
                      {kv.v}
                    </p>
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-8">
              {related.map((b) => (
                <Link key={b.id} href={`/books/${b.slug}`} className="group block">
                  <div className="mx-auto flex flex-col" style={{ maxWidth: 240 }}>
                    <div
                      className="border border-border-warm p-1.5 transition-transform group-hover:translate-y-[-2px]"
                      style={{ background: "rgba(241,230,210,0.35)" }}
                    >
                      <Cover
                        titleTamil={b.titleTamil}
                        author={b.contentAuthors[0]?.author.nameTamil ?? null}
                        emblem={emblemFromTitle(b.titleTamil)}
                        variant={pickCoverVariant(b.slug)}
                        src={b.coverImageUrl}
                      />
                    </div>
                    <h3
                      lang="ta"
                      className="ta-display text-ink mt-3 group-hover:text-burgundy transition-colors line-clamp-2"
                      style={{ fontSize: 15, lineHeight: 1.3 }}
                    >
                      {b.titleTamil}
                    </h3>
                    {b.contentAuthors[0] && (
                      <p lang="ta" className="ta text-ink-3 mt-1" style={{ fontSize: 11 }}>
                        {b.contentAuthors[0].author.nameTamil}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </section>
        )}
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
