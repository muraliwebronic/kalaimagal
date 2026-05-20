import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Divider } from "@/components/brand/Decor";
import { getPublicContentBySlug } from "@/lib/content";
import { getSetting } from "@/lib/settings";
import { JsonLd, articleLd, breadcrumbLd } from "@/lib/jsonld";

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
    description: c.metaDescription ?? c.excerpt ?? c.description ?? undefined,
    openGraph: {
      title: c.titleTamil,
      description: c.excerpt ?? c.description ?? undefined,
      images: c.ogImageUrl ? [c.ogImageUrl] : c.coverImageUrl ? [c.coverImageUrl] : [],
      type: "article",
      publishedTime: c.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublicContentBySlug(slug);
  if (!post || post.type !== "BLOG") notFound();

  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;
  const primaryAuthor = post.contentAuthors[0]?.author;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            slug: post.slug,
            titleTamil: post.titleTamil,
            titleEnglish: post.titleEnglish,
            description: post.description,
            excerpt: post.excerpt,
            coverImageUrl: post.coverImageUrl,
            ogImageUrl: post.ogImageUrl,
            authors: post.contentAuthors.map((ca) => ({
              slug: ca.author.slug,
              nameTamil: ca.author.nameTamil,
              nameEnglish: ca.author.nameEnglish,
            })),
            language: post.language,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            wordCount: post.wordCount,
          }),
          breadcrumbLd([
            { name: "Home", url: base },
            { name: "Articles", url: `${base}/blogs` },
            { name: post.titleEnglish ?? post.titleTamil, url: `${base}/blogs/${post.slug}` },
          ]),
        ]}
      />
      <Header />
      <main className="flex-1 paper-warm">
        <article className="px-6 md:px-14 py-10 md:py-16">
          {/* Breadcrumb */}
          <nav
            className="flex gap-2 items-center mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 13,
              color: "var(--ink-3)",
            }}
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-burgundy">Home</Link>
            <span className="text-gold">›</span>
            <Link href="/blogs" className="hover:text-burgundy">Articles</Link>
            <span className="text-gold">›</span>
            <span className="text-burgundy truncate" lang="ta">
              {post.titleEnglish ?? post.titleTamil}
            </span>
          </nav>

          {/* Article header — centered */}
          <header className="mx-auto max-w-2xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              {post.contentCategories.slice(0, 3).map((cc) => (
                <Link
                  key={cc.category.slug}
                  href={`/blogs?category=${cc.category.slug}`}
                  className="badge-km badge-km-chip"
                >
                  <span lang="ta">{cc.category.nameTamil}</span>
                </Link>
              ))}
              {post.isPremium && <span className="badge-km badge-km-premium">Premium</span>}
            </div>

            <div className="eyebrow mb-3">
              {primaryAuthor && (
                <>
                  <span lang="ta">{primaryAuthor.nameTamil}</span>
                  <span style={{ color: "var(--gold)", margin: "0 8px" }}>·</span>
                </>
              )}
              {post.publishedAt &&
                post.publishedAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </div>

            <h1
              lang="ta"
              className="ta-display text-burgundy"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                lineHeight: 1.15,
                marginBottom: 12,
                textWrap: "balance",
              }}
            >
              {post.titleTamil}
            </h1>
            {post.titleEnglish && (
              <p
                lang="en"
                className="text-ink-2"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22 }}
              >
                {post.titleEnglish}
              </p>
            )}
            {post.excerpt && (
              <p
                lang="ta"
                className="ta text-ink-2 mt-6 mx-auto"
                style={{ fontSize: 17, lineHeight: 1.7, maxWidth: "55ch" }}
              >
                {post.excerpt}
              </p>
            )}

            <div className="mt-7">
              <Divider />
            </div>
          </header>

          {/* Body */}
          {post.bodyText ? (
            <div
              lang={post.language === "EN" ? "en" : "ta"}
              className="mx-auto max-w-2xl blog-prose mt-10"
              // bodyText is sanitized server-side via isomorphic-dompurify
              // before storage (admin → sanitize → DB).
              dangerouslySetInnerHTML={{ __html: post.bodyText }}
            />
          ) : (
            <p className="mx-auto max-w-2xl text-ink-3 text-center mt-10">
              <span data-bi lang="ta">இந்த கட்டுரை இன்னும் முழுமையாக எழுதப்படவில்லை.</span>
              <span data-bi lang="en">This article hasn't been written yet.</span>
            </p>
          )}

          {/* Closing flourish */}
          <div className="mt-14 max-w-2xl mx-auto">
            <Divider />
            <p
              className="text-center mt-6 text-ink-3"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
            >
              <span data-bi lang="ta">— முற்றும் —</span>
              <span data-bi lang="en">— End —</span>
            </p>
            {post.readingTimeMinutes && (
              <p className="text-center mt-3 eyebrow eyebrow-sm">
                {post.readingTimeMinutes} min read
              </p>
            )}
          </div>
        </article>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
