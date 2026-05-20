/**
 * Kalaimagal seal — lotus-petal circle with Tamil "க" inside double rings,
 * kalasham finial on top.
 */
export function Logo({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-label="Kalaimagal"
      className={className}
    >
      <circle cx="32" cy="32" r="29" stroke="#7A1F2B" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="26" stroke="#B8884A" strokeWidth="0.6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={a} transform={`rotate(${a} 32 32)`}>
          <path d="M32 6 L33.6 9 L32 11.5 L30.4 9 Z" fill="#7A1F2B" />
        </g>
      ))}
      <circle cx="32" cy="32" r="17" fill="#F1E6D2" stroke="#7A1F2B" strokeWidth="0.8" />
      <text
        x="32"
        y="40.5"
        textAnchor="middle"
        fontFamily="Noto Serif Tamil, serif"
        fontSize="22"
        fontWeight="500"
        fill="#7A1F2B"
      >
        க
      </text>
      <path d="M30 3 Q32 0 34 3 L33 4 L33 6 L31 6 L31 4 Z" fill="#B8884A" />
    </svg>
  );
}

/**
 * Wordmark — Tamil கலைமகள் + tiny italic English caption.
 */
export function Wordmark({
  size = "lg",
  showEn = true,
  color = "var(--ink)",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  showEn?: boolean;
  color?: string;
}) {
  const sizes = {
    sm: { ta: 18, en: 9 },
    md: { ta: 22, en: 10 },
    lg: { ta: 30, en: 11 },
    xl: { ta: 44, en: 13 },
  } as const;
  const s = sizes[size];
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: 2, lineHeight: 1, color }}>
      <span
        lang="ta"
        className="ta"
        style={{ fontSize: s.ta, fontWeight: 500, letterSpacing: "0.01em" }}
      >
        கலைமகள்
      </span>
      {showEn && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: s.en,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            opacity: 0.7,
            marginTop: 1,
          }}
        >
          · Kalaimagal ·
        </span>
      )}
    </span>
  );
}
