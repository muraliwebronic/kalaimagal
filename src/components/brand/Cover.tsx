import { cn } from "@/lib/utils";

export type CoverVariant = "burgundy" | "sand" | "teal" | "gold" | "ink" | "kumkum";

interface CoverProps {
  /** Tamil title rendered at the bottom-middle of the cover. */
  titleTamil: string;
  /** Author name (optional) — Cormorant italic caption beneath the title. */
  author?: string | null;
  /** Single-letter / 2-letter emblem at the top, italic Cormorant gold. */
  emblem?: string;
  variant?: CoverVariant;
  /** Real cover image — if provided, replaces the typographic placeholder. */
  src?: string | null;
  className?: string;
  /** Optional width override. */
  style?: React.CSSProperties;
}

/**
 * Book cover. If `src` is provided, renders the image full-bleed with the
 * same shadow + 3/4 aspect ratio. Otherwise renders a typographic placeholder
 * with traditional Tamil "manuscript cover" treatment — see styles.css
 * `.cover-km`, plus 5 colorway variants.
 */
export function Cover({
  titleTamil,
  author,
  emblem = "க",
  variant = "burgundy",
  src,
  className,
  style,
}: CoverProps) {
  const variantClass = {
    burgundy: "",
    sand: "cover-km-sand",
    teal: "cover-km-teal",
    gold: "cover-km-gold",
    ink: "cover-km-ink",
    kumkum: "cover-km-kumkum",
  }[variant];

  if (src) {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden shadow-[0_12px_22px_-10px_rgba(27,20,16,0.35)]",
          className,
        )}
        style={style}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("cover-km", variantClass, className)} style={style}>
      <div className="cover-km-emblem">{emblem}</div>
      <div lang="ta" className="cover-km-title">{titleTamil}</div>
      {author && <div lang="ta" className="cover-km-author">{author}</div>}
    </div>
  );
}

/** Pick a deterministic cover variant from any string (e.g. slug) so the
 * library page has visual variety without manual tagging. */
export function pickCoverVariant(seed: string): CoverVariant {
  const variants: CoverVariant[] = ["burgundy", "sand", "teal", "gold", "ink", "kumkum"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return variants[h % variants.length];
}

/** Derive a 1-2 character emblem from a Tamil title (first glyph). */
export function emblemFromTitle(titleTamil: string): string {
  return titleTamil.trim().slice(0, 1) || "க";
}
