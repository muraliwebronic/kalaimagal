import Image from "next/image";

/**
 * Kalaimagal brand lockup — full logo (medallion + Tamil wordmark + English
 * caption) rendered from /uploads/logo.png. `size` controls the rendered
 * height in pixels; width scales automatically from the image aspect ratio.
 *
 * Use this everywhere the brand mark appears (header, mobile top bar, footer,
 * auth screens). The image already contains the wordmark, so don't pair it
 * with the deprecated <Wordmark /> component anymore.
 */
export function Logo({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  // Source dims of the artwork roughly 980×260 → ~3.77 aspect ratio.
  const width = Math.round(size * 3.77);
  return (
    <Image
      src="/uploads/logo.png"
      alt="Kalaimagal · கலைமகள்"
      width={width}
      height={size}
      priority={priority}
      className={className}
      style={{ height: size, width: "auto" }}
    />
  );
}

/**
 * Deprecated — the brand lockup image now includes the wordmark, so this
 * renders nothing. Kept exported so existing imports don't break; remove
 * once all call sites have dropped it.
 */
export function Wordmark(_props: {
  size?: "sm" | "md" | "lg" | "xl";
  showEn?: boolean;
  color?: string;
}) {
  return null;
}
