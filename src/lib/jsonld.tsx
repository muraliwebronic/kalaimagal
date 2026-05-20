/**
 * JSON-LD schema.org builders.
 *
 * Embed via `<script type="application/ld+json">` blocks in layout / page
 * components. Search engines + AI answer engines read these to enrich
 * rich-result cards, knowledge panels, and AI citations.
 *
 * All builders return plain objects — call JSON.stringify(...) at the
 * render site. We never use eval-y `dangerouslySetInnerHTML` shortcuts
 * here; the page itself decides how to serialize.
 */

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}#org`,
    name: "Kalaimagal",
    alternateName: "கலைமகள்",
    url: BASE,
    description: "The digital home of Tamil literature — Tamil e-books and essays.",
    logo: `${BASE}/brand/logo.png`,
    sameAs: [
      // Fill in from Setting.site.social_links when available
    ],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}#website`,
    url: BASE,
    name: "Kalaimagal · கலைமகள்",
    inLanguage: ["ta", "en"],
    publisher: { "@id": `${BASE}#org` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/books?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BookLdInput {
  slug: string;
  titleTamil: string;
  titleEnglish?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  authors: Array<{ slug: string; nameTamil: string; nameEnglish?: string | null }>;
  pageCount?: number | null;
  publicationYear?: number | null;
  publisher?: string | null;
  isbn?: string | null;
  language: "TA" | "EN" | "BILINGUAL";
  isPremium: boolean;
  publishedAt?: Date | null;
  averageRating?: string | null;
  reviewCount?: number;
}

export function bookLd(book: BookLdInput) {
  const url = `${BASE}/books/${book.slug}`;
  const langCode = book.language === "EN" ? "en" : book.language === "BILINGUAL" ? ["ta", "en"] : "ta";

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#book`,
    name: book.titleEnglish ?? book.titleTamil,
    alternateName: book.titleEnglish ? book.titleTamil : undefined,
    url,
    image: book.coverImageUrl ? `${BASE}${book.coverImageUrl}` : undefined,
    description: book.description ?? undefined,
    inLanguage: langCode,
    bookFormat: "https://schema.org/EBook",
    numberOfPages: book.pageCount ?? undefined,
    isbn: book.isbn ?? undefined,
    datePublished: book.publishedAt?.toISOString().slice(0, 10),
    author: book.authors.map((a) => ({
      "@type": "Person",
      "@id": `${BASE}/authors/${a.slug}`,
      name: a.nameEnglish ?? a.nameTamil,
      alternateName: a.nameEnglish ? a.nameTamil : undefined,
    })),
    publisher: book.publisher
      ? { "@type": "Organization", name: book.publisher }
      : { "@id": `${BASE}#org` },
    offers: book.isPremium
      ? {
          "@type": "Offer",
          price: 99,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${BASE}/account/subscription`,
          description: "Included with the Monthly Plan",
        }
      : {
          "@type": "Offer",
          price: 0,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
        },
    aggregateRating:
      book.averageRating && book.reviewCount && book.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: book.averageRating,
            reviewCount: book.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export interface ArticleLdInput {
  slug: string;
  titleTamil: string;
  titleEnglish?: string | null;
  description?: string | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  ogImageUrl?: string | null;
  authors: Array<{ slug: string; nameTamil: string; nameEnglish?: string | null }>;
  language: "TA" | "EN" | "BILINGUAL";
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  wordCount?: number | null;
}

export function articleLd(article: ArticleLdInput) {
  const url = `${BASE}/blogs/${article.slug}`;
  const langCode = article.language === "EN" ? "en" : article.language === "BILINGUAL" ? ["ta", "en"] : "ta";
  const image = article.ogImageUrl ?? article.coverImageUrl;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.titleEnglish ?? article.titleTamil,
    alternativeHeadline: article.titleEnglish ? article.titleTamil : undefined,
    url,
    image: image ? `${BASE}${image}` : undefined,
    description: article.description ?? article.excerpt ?? undefined,
    inLanguage: langCode,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    wordCount: article.wordCount ?? undefined,
    author: article.authors.map((a) => ({
      "@type": "Person",
      "@id": `${BASE}/authors/${a.slug}`,
      name: a.nameEnglish ?? a.nameTamil,
    })),
    publisher: { "@id": `${BASE}#org` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function breadcrumbLd(trail: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Helper component to emit a JSON-LD <script> tag from a server component. */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // schema.org JSON-LD is a string of JSON inside a <script> tag;
      // we control the input shape so this is safe.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload, replaceUndefined).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function replaceUndefined(_key: string, value: unknown) {
  return value === undefined ? undefined : value;
}
