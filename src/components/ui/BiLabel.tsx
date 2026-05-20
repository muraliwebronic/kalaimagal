import { cn } from "@/lib/utils";

interface BiLabelProps {
  ta: string;
  en: string;
  /** Visual hierarchy: 'inline' stacks small below; 'block' renders side-by-side or larger. */
  variant?: "inline" | "stacked" | "hero";
  className?: string;
  /**
   * @deprecated No longer used. Both languages always render; CSS hides the
   * inactive one based on the `html[data-lang]` attribute. Setting this to
   * `true` used to suppress the English subtitle, which would leave buttons
   * empty when the user toggled to EN mode. Prop kept as a stub so existing
   * call sites don't break — safe to remove.
   */
  englishHidden?: boolean;
}

/**
 * Bilingual label. Always renders BOTH the Tamil and English variants
 * tagged with lang attributes plus a `data-bi` marker; the language toggle
 * (via the `html[data-lang]` attribute set by the root layout) hides the
 * inactive side via CSS. Content text that just happens to use
 * `lang="ta"` (book bodies, hero headlines without a `data-bi` attr) is
 * NOT affected by the toggle.
 *
 * In TA mode (default) → English variant is hidden.
 * In EN mode           → Tamil variant is hidden.
 */
export function BiLabel({ ta, en, variant = "inline", className }: BiLabelProps) {
  if (variant === "hero") {
    return (
      <span className={cn("flex flex-col gap-2", className)}>
        <span data-bi lang="ta" className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight">
          {ta}
        </span>
        <span data-bi lang="en" className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight">
          {en}
        </span>
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={cn("flex flex-col leading-tight", className)}>
        <span data-bi lang="ta" className="font-medium">{ta}</span>
        <span data-bi lang="en" className="font-medium">{en}</span>
      </span>
    );
  }

  // inline (default)
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span data-bi lang="ta">{ta}</span>
      <span data-bi lang="en">{en}</span>
    </span>
  );
}
