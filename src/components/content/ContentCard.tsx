import Link from "next/link";
import { Cover, pickCoverVariant, emblemFromTitle, type CoverVariant } from "@/components/brand/Cover";

export interface ContentCardData {
  id: number;
  slug: string;
  type: "PDF" | "BLOG";
  titleTamil: string;
  titleEnglish?: string | null;
  excerpt?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  isPremium: boolean;
  authorNameTamil?: string | null;
  /** First category, displayed as the eyebrow above the title. */
  categoryTamil?: string | null;
  pageCount?: number | null;
  readingTimeMinutes?: number | null;
}

interface ContentCardProps {
  item: ContentCardData;
  /** Override the auto-picked cover variant. */
  variant?: CoverVariant;
  /** Hide the category eyebrow. */
  hideCategory?: boolean;
}

/**
 * Editorial book / article card. Cover (with traditional manuscript treatment)
 * on top, then a metadata block: free/premium badge + category chip,
 * Tamil title in `ta-display`, English subtitle in italic Cormorant, author
 * + page count line.
 */
export function ContentCard({ item, variant, hideCategory = false }: ContentCardProps) {
  const href = item.type === "PDF" ? `/books/${item.slug}` : `/blogs/${item.slug}`;
  const coverVariant = variant ?? pickCoverVariant(item.slug);

  return (
    <Link href={href} className="group block h-full">
      <article className="flex flex-col h-full w-full">
        {/* Cover */}
        <div
          className="relative border border-border-warm p-2 rounded-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md"
          style={{ background: "rgba(241,230,210,0.5)" }}
        >
          <Cover
            titleTamil={item.titleTamil}
            author={item.authorNameTamil}
            emblem={emblemFromTitle(item.titleTamil)}
            variant={coverVariant}
            src={item.coverImageUrl}
          />
          <div className="absolute left-2.5 top-2.5">
            <span className={item.isPremium 
              ? "bg-gradient-gold text-ink px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5"
              : "bg-paper text-ink border border-border-warm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1.5"}>
              <span data-bi lang="ta">{item.isPremium ? "சந்தா" : "இலவசம்"}</span>
              <span data-bi lang="en">{item.isPremium ? "Premium" : "Free"}</span>
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-4 px-0.5 flex flex-col flex-1">
          {!hideCategory && item.categoryTamil && (
            <div className="eyebrow text-[11px] mb-1.5">{item.categoryTamil}</div>
          )}
          <h3
            lang="ta"
            className="ta-display text-lg leading-[1.3] text-ink group-hover:text-burgundy transition-colors line-clamp-2"
          >
            {item.titleTamil}
          </h3>
          {item.titleEnglish && (
            <p
              lang="en"
              className="text-[13px] text-ink-3 mt-1.5 line-clamp-1"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              {item.titleEnglish}
            </p>
          )}
          <div className="mt-auto pt-3">
            {(item.authorNameTamil || item.pageCount || item.readingTimeMinutes) && (
              <p lang="ta" className="ta text-[11px] text-ink-2">
                {item.authorNameTamil}
                {item.authorNameTamil && (item.pageCount || item.readingTimeMinutes) && " · "}
                {item.pageCount ? <>{item.pageCount} பக்.</> : null}
                {item.readingTimeMinutes && !item.pageCount ? <>{item.readingTimeMinutes} நிமிடம்</> : null}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
