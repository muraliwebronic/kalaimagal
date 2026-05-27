/**
 * Decorative SVG motifs from the design package:
 * - Gopuram: stepped temple-tower silhouette (use behind hero / 404).
 * - PeacockEye: nested-oval feather "eye" (corner accent on the subscribe band).
 * - Thoranam: mango-leaf festoon (used at the top of the homepage hero).
 */

export function Gopuram({
  width = 520,
  height = 120,
  color = "#7A1F2B",
  opacity = 0.16,
  className,
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 120"
      preserveAspectRatio="xMidYMax meet"
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <g fill={color} opacity={opacity}>
        {/* base */}
        <rect x="60" y="100" width="400" height="20" />
        {/* tier 1 */}
        <path d="M 80 100 L 100 80 L 420 80 L 440 100 Z" />
        <rect x="100" y="78" width="320" height="3" />
        {/* tier 2 */}
        <path d="M 120 78 L 140 60 L 380 60 L 400 78 Z" />
        <rect x="140" y="58" width="240" height="3" />
        {/* tier 3 */}
        <path d="M 160 58 L 180 44 L 340 44 L 360 58 Z" />
        <rect x="180" y="42" width="160" height="3" />
        {/* tier 4 */}
        <path d="M 200 42 L 220 30 L 300 30 L 320 42 Z" />
        {/* dome */}
        <path d="M 230 30 Q 230 14 260 14 Q 290 14 290 30 Z" />
        {/* kalashams */}
        <circle cx="260" cy="8" r="3" />
        <rect x="259" y="0" width="2" height="8" />
        <circle cx="100" cy="74" r="2" />
        <circle cx="420" cy="74" r="2" />
        <circle cx="140" cy="54" r="2" />
        <circle cx="380" cy="54" r="2" />
        <circle cx="180" cy="38" r="2" />
        <circle cx="340" cy="38" r="2" />
      </g>
    </svg>
  );
}

export function PeacockEye({
  size = 36,
  opacity = 1,
  flip = false,
  className,
}: {
  size?: number;
  opacity?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 36 50"
      className={className}
      style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <g opacity={opacity}>
        <ellipse cx="18" cy="22" rx="16" ry="22" fill="#1F5559" />
        <ellipse cx="18" cy="22" rx="12" ry="17" fill="#7A1F2B" />
        <ellipse cx="18" cy="22" rx="8" ry="12" fill="#D97F2E" />
        <ellipse cx="18" cy="22" rx="4" ry="7" fill="#1B1410" />
        <ellipse cx="18" cy="22" rx="2" ry="4" fill="#B8884A" />
      </g>
    </svg>
  );
}

export function Thoranam({
  width = 520,
  height = 26,
  color = "#7A1F2B",
  className,
}: {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  const n = 24;
  const leaves: React.ReactElement[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * (width / n);
    leaves.push(
      <g key={i} transform={`translate(${x} 14)`}>
        <path d="M 0 -2 Q 4 4 0 14 Q -4 4 0 -2 Z" fill={color} opacity="0.55" />
        <path d="M 0 0 L 0 12" stroke={color} strokeWidth="0.5" opacity="0.7" />
      </g>,
    );
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d={`M 0 4 Q ${width / 4} 18 ${width / 2} 6 T ${width} 4`}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      {leaves}
    </svg>
  );
}

/** Diamond between two gold rules. Pass `label` for an UPPERCASED inline label. */
export function Divider({ label }: { label?: string }) {
  return (
    <div className="divider">
      <div className="divider-diamond" />
      {label && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 13,
            color: "var(--ink-2)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      <div className="divider-diamond" />
    </div>
  );
}
