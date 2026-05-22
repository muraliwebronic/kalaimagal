"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HTMLFlipBook from "react-pageflip";

export interface FlipBookViewerProps {
  /** Numeric content id used by /api/convert?doc_id=. */
  contentId: number;
  /** Number of pages actually readable (either total or the free-tier cap). */
  pageCount: number;
  /** Total pages in the source PDF — controls the page-counter UI. */
  totalPageCount: number;
  /** Currently displayed page (1-indexed). Synced with parent. */
  page: number;
  /** Notify parent when the flip changes the page. */
  onPageChange: (page: number) => void;
  /** If true, a final synthetic "subscribe" page is appended after pageCount. */
  showSubscribeTail?: boolean;
  /** Element rendered for the subscribe tail page. */
  subscribeTail?: React.ReactNode;
  /** 1 = default book size. < 1 zooms out, > 1 zooms in. */
  zoom?: number;
}

/**
 * Editorial book-flip reader.
 *
 * Performance discipline:
 *   - **In-memory blob cache** of every page already fetched in this tab.
 *     Flip back to page 5 after reading to page 30 → zero server hit.
 *   - **Preloader window** of 2 pages ahead + 1 behind the current page
 *     fetches into the same cache so flips feel instant.
 *   - Each cache entry is an object URL backed by the watermarked WebP
 *     served by /api/convert. URLs are revoked on unmount.
 *
 * Combined with the convert API's `Cache-Control: private, max-age=86400`
 * for subscribers (still `private` — no CDN), repeat reads across browser
 * sessions also hit disk-cache instead of the function.
 */
export function FlipBookViewer({
  contentId,
  pageCount,
  totalPageCount,
  page,
  onPageChange,
  showSubscribeTail = false,
  subscribeTail,
  zoom = 1,
}: FlipBookViewerProps) {
  // Two-page spread on desktop, single portrait on phones. We don't
  // remount the flipbook on switch (would wipe the blob cache) — just
  // toggle the prop and let react-pageflip re-layout.
  const [usePortrait, setUsePortrait] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setUsePortrait(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  // Map of fetched pages → blob object URL. We use a ref so the cache
  // survives renders, plus a tick state to trigger re-renders when a new
  // page lands.
  const cacheRef = useRef<Map<number, string>>(new Map());
  const inFlightRef = useRef<Set<number>>(new Set());
  const [, setTick] = useState(0);
  const bump = useCallback(() => setTick((n) => n + 1), []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  const fetchPage = useCallback(
    async (target: number) => {
      if (target < 1 || target > pageCount) return;
      const cache = cacheRef.current;
      const inFlight = inFlightRef.current;
      if (cache.has(target) || inFlight.has(target)) return;
      inFlight.add(target);
      try {
        const res = await fetch(
          `/api/convert?doc_id=${contentId}&page=${target}`,
          { credentials: "include", cache: "force-cache" },
        );
        if (!res.ok) {
          console.warn(`page ${target} fetch failed (${res.status})`);
          return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        cache.set(target, url);
        bump();
      } catch (e) {
        console.error(`page ${target} fetch error:`, e);
      } finally {
        inFlight.delete(target);
      }
    },
    [contentId, pageCount, bump],
  );

  // Preload window: current + 2 ahead + 1 behind. Fires whenever the
  // displayed page changes (parent updates `page` or flip animation
  // calls onFlip).
  useEffect(() => {
    [page, page + 1, page + 2, page - 1].forEach((p) => fetchPage(p));
  }, [page, fetchPage]);

  // Hard cleanup on unmount — release all object URLs so the browser can
  // free the blob memory.
  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      cache.forEach((url) => URL.revokeObjectURL(url));
      cache.clear();
    };
  }, []);

  // Drive the flipbook to the parent's `page` when it changes externally
  // (e.g., click on the side arrows).
  const lastDrivenRef = useRef(page);
  useEffect(() => {
    const book = bookRef.current?.pageFlip?.();
    if (!book) return;
    if (page === lastDrivenRef.current) return;
    lastDrivenRef.current = page;
    book.flip(page - 1); // 0-indexed in lib
  }, [page]);

  const handleFlip = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const newPage = Number(e.data) + 1;
      lastDrivenRef.current = newPage;
      onPageChange(newPage);
    },
    [onPageChange],
  );

  // Build the page list fresh on every render so newly-cached blob URLs
  // flow into their PdfPage props. Memoising is wrong here because the
  // cache mutates via a ref — the memo would freeze with stale blobUrl
  // values. Building ~N trivial React elements per flip is cheap.
  //
  // react-pageflip iterates children with React.Children.map and throws
  // on any null/undefined slot, so we build a plain array and only push
  // real elements — never a conditional that can resolve to null.
  const pageElements: React.ReactElement[] = [];
  for (let n = 1; n <= pageCount; n++) {
    pageElements.push(
      <PdfPage
        key={`page-${n}`}
        number={n}
        blobUrl={cacheRef.current.get(n) ?? null}
        totalPageCount={totalPageCount}
      />,
    );
  }
  if (showSubscribeTail && subscribeTail) {
    pageElements.push(
      <PageShell
        key="subscribe"
        number={pageCount + 1}
        totalPageCount={totalPageCount}
      >
        {subscribeTail}
      </PageShell>,
    );
  }
  if (pageElements.length === 1) {
    // Lib wants at least two leaves to flip between.
    pageElements.push(
      <PageShell key="end-pad" number={2} totalPageCount={totalPageCount}>
        <div className="grid place-items-center h-full text-xs italic opacity-60">end</div>
      </PageShell>,
    );
  }

  return (
    // Centered in the stage with breathing-room padding so the flip
    // animation (curls, drop shadows, rotating leaf) renders in full.
    // The inner div carries the user's zoom level via CSS transform —
    // simpler than re-mounting the flipbook at a new size and keeps the
    // animation smooth. PdfReader's outer shell is overflow-hidden, so
    // zoomed-in overshoot is silently clipped.
    <div className="w-full h-full flex items-center justify-center select-none p-4 md:p-8">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          transition: "transform 0.25s ease-out",
        }}
      >
        <HTMLFlipBook
          ref={bookRef}
          // width/height are PER-PAGE dimensions; the lib renders 2 × width
          // wide when `usePortrait` is false (desktop spread). The maxes
          // are per-page too, so a 540 cap gives ~1080 spread on desktop
          // — comfortable open-book proportions without dominating the
          // canvas.
          width={420}
          height={560}
          size="stretch"
          minWidth={260}
          maxWidth={540}
          minHeight={340}
          maxHeight={760}
          usePortrait={usePortrait}
          startPage={page - 1}
          showCover={false}
          drawShadow
          // 1200ms reads as a deliberate, editorial page-turn — the old
          // 650ms felt snappy when triggered programmatically from the
          // arrow buttons. Manual drag-flips still feel fluid because
          // they follow the cursor.
          flippingTime={1200}
          maxShadowOpacity={0.5}
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={40}
          showPageCorners
          disableFlipByClick={false}
          onFlip={handleFlip}
          style={{ maxWidth: "100%" }}
          className="flipbook"
          // The lib types demand these props but they're optional at runtime.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({} as any)}
        >
          {pageElements}
        </HTMLFlipBook>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page leaf — must use forwardRef so react-pageflip can mount it as a page.  */
/* -------------------------------------------------------------------------- */

interface PageShellProps {
  number: number;
  totalPageCount: number;
  children: React.ReactNode;
}

// `number` / `totalPageCount` are accepted so callers don't have to
// special-case PdfPage vs PageShell; the chrome at the top of the
// reader already shows the page counter, so we don't paint one here.
const PageShell = forwardRef<HTMLDivElement, PageShellProps>(function PageShell(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { number, totalPageCount, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className="relative bg-paper text-ink overflow-hidden"
      style={{ boxShadow: "inset 0 0 0 1px rgba(20,17,12,0.08)" }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
});

interface PdfPageProps {
  number: number;
  blobUrl: string | null;
  totalPageCount: number;
}

const PdfPage = forwardRef<HTMLDivElement, PdfPageProps>(function PdfPage(
  { number, blobUrl, totalPageCount },
  ref,
) {
  return (
    <PageShell ref={ref} number={number} totalPageCount={totalPageCount}>
      {blobUrl ? (
        // object-contain so the image is never cropped — losing a
        // corner of the cover or trimming text would feel broken.
        // A small inset gives the page a thin paper border around the
        // image, which reads more like a real bound book than an
        // edge-to-edge poster.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blobUrl}
          alt={`Page ${number}`}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain"
          style={{ userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }}
        />
      ) : (
        <PageSkeleton />
      )}
    </PageShell>
  );
});

function PageSkeleton() {
  return (
    <div className="h-full w-full grid place-items-center bg-sandalwood/30">
      <div className="flex flex-col items-center gap-3 text-ink-3">
        <span
          className="size-8 rounded-full border-2 border-burgundy/30 border-t-burgundy animate-spin"
          aria-hidden
        />
        <span
          className="text-[11px] tracking-wider italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          loading…
        </span>
      </div>
    </div>
  );
}
