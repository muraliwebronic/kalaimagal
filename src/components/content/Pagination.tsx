import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  basePath: string;
  page: number;
  pageCount: number;
  /** Extra query params to preserve on links (besides `page`). */
  searchParams?: Record<string, string | undefined>;
}

function buildHref(basePath: string, page: number, sp?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp ?? {})) {
    if (v) params.set(k, v);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/**
 * Editorial-style paginator: square Prev/Next arrows with warm borders,
 * burgundy active page, gold-toned ellipsis.
 */
export function Pagination({ basePath, page, pageCount, searchParams }: PaginationProps) {
  if (pageCount <= 1) return null;

  const prev = page > 1 ? buildHref(basePath, page - 1, searchParams) : null;
  const next = page < pageCount ? buildHref(basePath, page + 1, searchParams) : null;

  // Windowed page list: 1, …, [page-1, page, page+1], …, pageCount
  const visible = new Set<number>([1, pageCount, page]);
  for (let i = 1; i <= 1; i++) {
    if (page - i > 0) visible.add(page - i);
    if (page + i <= pageCount) visible.add(page + i);
  }
  const sorted = [...visible].sort((a, b) => a - b);

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-3">
      <ArrowBtn href={prev} dir="prev" />
      <ul className="hidden sm:flex items-center gap-1">
        {sorted.map((p, idx) => {
          const prevP = sorted[idx - 1];
          const showEllipsis = prevP !== undefined && p - prevP > 1;
          return (
            <li key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-ink-3">···</span>}
              <PageNumber
                href={buildHref(basePath, p, searchParams)}
                active={p === page}
                label={p}
              />
            </li>
          );
        })}
      </ul>
      <ArrowBtn href={next} dir="next" />
    </nav>
  );
}

function ArrowBtn({ href, dir }: { href: string | null; dir: "prev" | "next" }) {
  const cls = "grid place-items-center w-10 h-9 border border-border-warm text-ink-2 hover:border-burgundy hover:text-burgundy transition-colors";
  const arrow = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      style={{ transform: dir === "next" ? "rotate(180deg)" : undefined }}
    >
      <path d="M9 2 L4 7 L9 12" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
  if (!href) {
    return (
      <span className={cn(cls, "opacity-30 pointer-events-none")} aria-hidden="true">
        {arrow}
      </span>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={dir === "prev" ? "Previous page" : "Next page"}>
      {arrow}
    </Link>
  );
}

function PageNumber({ href, active, label }: { href: string; active: boolean; label: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid place-items-center w-9 h-9 text-sm font-medium transition-colors font-display rounded-sm",
        active
          ? "border border-transparent bg-gradient-gold text-ink shadow-sm"
          : "border border-transparent text-ink hover:border-border-warm hover:bg-sandalwood",
      )}
      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
    >
      {label}
    </Link>
  );
}
