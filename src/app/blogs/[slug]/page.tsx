import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { getPublicContentBySlug } from "@/lib/content";
import { getSetting } from "@/lib/settings";
import { strings } from "@/lib/strings";

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

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">முகப்பு</Link>
            <span className="mx-2">/</span>
            <Link href="/blogs" className="hover:text-primary">{strings.nav.articles.ta}</Link>
          </nav>

          <header className="mx-auto max-w-2xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {post.contentCategories.slice(0, 3).map((cc) => (
                <Badge key={cc.category.slug} variant="secondary" className="font-normal">
                  <Link href={`/blogs?category=${cc.category.slug}`}>
                    {cc.category.nameTamil}
                  </Link>
                </Badge>
              ))}
              {post.isPremium && (
                <Badge variant="default">{strings.badge.premium.ta}</Badge>
              )}
            </div>

            <h1
              lang="ta"
              className="font-heading text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight"
            >
              {post.titleTamil}
            </h1>
            {post.titleEnglish && (
              <p lang="en" className="text-lg md:text-xl italic text-muted-foreground font-heading">
                {post.titleEnglish}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {primaryAuthor && (
                <span lang="ta">{primaryAuthor.nameTamil}</span>
              )}
              {post.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.publishedAt.toISOString()}>
                    {post.publishedAt.toLocaleDateString()}
                  </time>
                </>
              )}
              {post.readingTimeMinutes && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </>
              )}
            </div>
          </header>

          {post.bodyText ? (
            <div
              lang={post.language === "EN" ? "en" : "ta"}
              className="mx-auto mt-10 max-w-2xl blog-prose"
              // bodyText is sanitized server-side via isomorphic-dompurify
              // before storage (admin TipTap → sanitize → DB). See Phase 3.2.
              dangerouslySetInnerHTML={{ __html: post.bodyText }}
            />
          ) : (
            <p className="mx-auto mt-10 max-w-2xl text-muted-foreground text-center">
              <span lang="ta">இந்த கட்டுரை இன்னும் முழுமையாக எழுதப்படவில்லை.</span>{" "}
              <span lang="en" className="italic">This article hasn't been written yet.</span>
            </p>
          )}
        </article>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
