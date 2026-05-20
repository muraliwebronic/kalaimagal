import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">முகப்பு</Link>
            <span className="mx-2">/</span>
            <Link href="/books" className="hover:text-primary">{strings.nav.books.ta}</Link>
          </nav>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            {/* Cover */}
            <div className="md:col-span-4">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-md border border-border bg-muted">
                {book.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-6">
                    <span lang="ta" className="font-heading text-2xl text-muted-foreground/40 text-center">
                      {book.titleTamil}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="md:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={book.isPremium ? "default" : "secondary"}>
                  {book.isPremium ? strings.badge.premium.ta : strings.badge.free.ta}
                </Badge>
                {book.isFeatured && (
                  <Badge variant="secondary">{strings.badge.featured.ta}</Badge>
                )}
                {book.contentCategories.slice(0, 3).map((cc) => (
                  <Badge key={cc.category.slug} variant="secondary" className="font-normal">
                    <Link href={`/books?category=${cc.category.slug}`}>
                      {cc.category.nameTamil}
                    </Link>
                  </Badge>
                ))}
              </div>

              <div>
                <h1
                  lang="ta"
                  className="font-heading text-3xl md:text-4xl tracking-tight"
                >
                  {book.titleTamil}
                </h1>
                {book.titleEnglish && (
                  <p
                    lang="en"
                    className="mt-2 text-lg italic text-muted-foreground font-heading"
                  >
                    {book.titleEnglish}
                  </p>
                )}
              </div>

              {primaryAuthor && (
                <div className="text-sm text-muted-foreground">
                  <span lang="ta">{primaryAuthor.nameTamil}</span>
                  {primaryAuthor.nameEnglish && (
                    <span className="ml-2 italic">/ {primaryAuthor.nameEnglish}</span>
                  )}
                  {primaryAuthor.bornYear && (
                    <span className="ml-2">
                      ({primaryAuthor.bornYear}
                      {primaryAuthor.diedYear ? `–${primaryAuthor.diedYear}` : ""})
                    </span>
                  )}
                </div>
              )}

              {book.description && (
                <p lang="ta" className="text-base leading-relaxed text-foreground/90 max-w-prose">
                  {book.description}
                </p>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {book.pageCount && (
                  <Pair label="Pages" value={book.pageCount.toString()} />
                )}
                {book.language && (
                  <Pair label="Language" value={book.language} />
                )}
                {book.publicationYear && (
                  <Pair label="Year" value={book.publicationYear.toString()} />
                )}
                {book.publisher && (
                  <Pair label="Publisher" value={book.publisher} />
                )}
                {book.edition && (
                  <Pair label="Edition" value={book.edition} />
                )}
                {book.isbn && (
                  <Pair label="ISBN" value={book.isbn} />
                )}
              </dl>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href={`/books/${book.slug}/read`}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {strings.cta.startReading.ta} / {strings.cta.startReading.en}
                </Link>
                {book.isPremium && (
                  <p className="text-xs text-muted-foreground self-center">
                    <span lang="ta">முதல் 2 பக்கங்கள் இலவசம்</span>
                    <span className="ml-1.5 italic">/ first 2 pages free</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}
