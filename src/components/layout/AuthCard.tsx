import { Divider } from "@/components/brand/Decor";

interface AuthCardProps {
  titleTa: string;
  titleEn: string;
  subtitleTa?: string;
  subtitleEn?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Manuscript-framed card used by every auth page (login, register, forgot,
 * reset, verify). Centers a Tamil display title with English caption, runs
 * a diamond divider beneath the heading block, then the form body.
 */
export function AuthCard({ titleTa, titleEn, subtitleTa, subtitleEn, children, footer }: AuthCardProps) {
  return (
    <>
      <div className="frame px-5 py-7 sm:px-8 sm:py-9" style={{ background: "var(--paper)" }}>
        <div className="text-center mb-7">
          <h1
            lang="ta"
            className="ta-display text-burgundy"
            style={{ fontSize: "clamp(26px, 7vw, 34px)", lineHeight: 1.2, marginBottom: 6 }}
          >
            <span data-bi lang="ta">{titleTa}</span>
            <span data-bi lang="en">{titleEn}</span>
          </h1>
          <p
            className="text-ink-3"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15 }}
          >
            <span data-bi lang="ta">{titleEn}</span>
            <span data-bi lang="en">{titleTa}</span>
          </p>
          {(subtitleTa || subtitleEn) && (
            <p
              className="text-ink-2 mt-3.5"
              style={{ fontSize: 13, lineHeight: 1.7 }}
            >
              {subtitleTa && <span data-bi lang="ta" className="ta">{subtitleTa}</span>}
              {subtitleEn && <span data-bi lang="en">{subtitleEn}</span>}
            </p>
          )}
        </div>
        <Divider />
        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <div
          className="mt-5 text-center text-ink-2"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13 }}
        >
          {footer}
        </div>
      )}
    </>
  );
}
