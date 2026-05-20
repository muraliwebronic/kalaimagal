import { cn } from "@/lib/utils";

interface BiLabelProps {
  ta: string;
  en: string;
  /** Visual hierarchy: 'inline' stacks small below; 'block' renders side-by-side or larger. */
  variant?: "inline" | "stacked" | "hero";
  className?: string;
  /** Hide the English subtitle (useful inside compact UI). */
  englishHidden?: boolean;
}

export function BiLabel({
  ta,
  en,
  variant = "inline",
  className,
  englishHidden = false,
}: BiLabelProps) {
  if (variant === "hero") {
    return (
      <span className={cn("flex flex-col gap-2", className)}>
        <span lang="ta" className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight">
          {ta}
        </span>
        {!englishHidden && (
          <span lang="en" className="text-base md:text-lg text-muted-foreground font-heading italic">
            {en}
          </span>
        )}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={cn("flex flex-col leading-tight", className)}>
        <span lang="ta" className="font-medium">
          {ta}
        </span>
        {!englishHidden && (
          <span lang="en" className="text-xs text-muted-foreground">
            {en}
          </span>
        )}
      </span>
    );
  }

  // inline (default)
  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span lang="ta">{ta}</span>
      {!englishHidden && (
        <span lang="en" className="text-xs text-muted-foreground" aria-hidden="true">
          / {en}
        </span>
      )}
    </span>
  );
}
