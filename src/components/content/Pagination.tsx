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

export function Pagination({ basePath, page, pageCount, searchParams }: PaginationProps) {
  if (pageCount <= 1) return null;

  const prev = page > 1 ? buildHref(basePath, page - 1, searchParams) : null;
  const next = page < pageCount ? buildHref(basePath, page + 1, searchParams) : null;

  // Build a windowed page list: 1 ... [page-1, page, page+1] ... pageCount
  const windowSize = 1;
  const visible = new Set<number>([1, pageCount, page]);
  for (let i = 1; i <= windowSize; i++) {
    if (page - i > 0) visible.add(page - i);
    if (page + i <= pageCount) visible.add(page + i);
  }
  const sorted = [...visible].sort((a, b) => a - b);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-4 border-t border-border/60 pt-6"
    >
      <PageLink href={prev}>← முந்தைய / Prev</PageLink>

      <ul className="hidden sm:flex items-center gap-1 text-sm">
        {sorted.map((p, idx) => {
          const prevP = sorted[idx - 1];
          const showEllipsis = prevP !== undefined && p - prevP > 1;
          return (
            <li key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-muted-foreground">…</span>}
              <PageNumber
                href={buildHref(basePath, p, searchParams)}
                active={p === page}
                label={p}
              />
            </li>
          );
        })}
      </ul>

      <PageLink href={next}>அடுத்த / Next →</PageLink>
    </nav>
  );
}

function PageLink({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) {
    return (
      <span className="text-sm text-muted-foreground/60 px-3 py-2">{children}</span>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm text-primary hover:underline underline-offset-4 px-3 py-2"
    >
      {children}
    </Link>
  );
}

function PageNumber({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
    </Link>
  );
}
