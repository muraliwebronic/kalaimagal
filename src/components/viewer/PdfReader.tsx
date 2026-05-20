"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CanvasViewer } from "./CanvasViewer";
import { MobileImgViewer } from "./MobileImgViewer";
import { PreviewBlur } from "./PreviewBlur";
import { SubscriptionPanel } from "./SubscriptionPanel";

export interface PdfReaderProps {
  /** Numeric content id used by /api/convert?doc_id=*/
  contentId: number;
  pageCount: number;
  isPremium: boolean;
  isSubscribed: boolean;
  isLoggedIn: boolean;
  /** Required when isLoggedIn — used to pre-fill the Razorpay checkout. */
  user?: { name: string; email: string; phone?: string | null } | null;
  titleTamil: string;
  titleEnglish?: string | null;
  authorNameTamil?: string | null;
  /** Display price for the paywall CTA — pulled from Setting/Plan. */
  priceInr?: number;
  /** Slug, used to build the back-to-detail link. */
  backHref: string;
}

const FREE_LIMIT = 2;

export function PdfReader(props: PdfReaderProps) {
  const {
    contentId,
    pageCount,
    isPremium,
    isSubscribed,
    isLoggedIn,
    user,
    titleTamil,
    titleEnglish,
    authorNameTamil,
    priceInr,
    backHref,
  } = props;

  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Viewport detector — switch between Canvas (desktop) and <img> (mobile)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Block Ctrl+S / Ctrl+P / Ctrl+C inside the reader region
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (["s", "p", "c"].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Arrow-key navigation
  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(pageCount, p + 1)),
    [pageCount],
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const paywalled = isPremium && !isSubscribed && page > FREE_LIMIT;
  const src = `/api/convert?doc_id=${contentId}&page=${page}`;

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Reader chrome */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/60">
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← <span lang="ta">விவரம்</span>
        </Link>
        <div className="min-w-0 px-2 text-center">
          <p lang="ta" className="truncate font-heading text-sm md:text-base">
            {titleTamil}
          </p>
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {page} / {pageCount}
        </div>
      </header>

      {/* Page viewport */}
      <main className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <div className="relative">
          {paywalled ? (
            // Show the last accessible page (page 2) blurred, with panel
            <>
              <div className="opacity-90">
                {isMobile ? (
                  <MobileImgViewer src={`/api/convert?doc_id=${contentId}&page=${FREE_LIMIT}`} pageNumber={FREE_LIMIT} />
                ) : (
                  <CanvasViewer src={`/api/convert?doc_id=${contentId}&page=${FREE_LIMIT}`} pageNumber={FREE_LIMIT} />
                )}
              </div>
              <PreviewBlur />
              <SubscriptionPanel
                titleTamil={titleTamil}
                titleEnglish={titleEnglish}
                authorNameTamil={authorNameTamil}
                priceInr={priceInr}
                isLoggedIn={isLoggedIn}
                user={user}
              />
            </>
          ) : isMobile ? (
            <MobileImgViewer src={src} pageNumber={page} />
          ) : (
            <CanvasViewer src={src} pageNumber={page} />
          )}
        </div>

        {/* Page nav */}
        <nav
          aria-label="Pages"
          className="mt-6 flex items-center justify-between gap-3"
        >
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
            <span className="ml-1 hidden sm:inline">முந்தைய பக்கம் / Prev</span>
          </Button>

          <div className="text-sm text-muted-foreground tabular-nums">
            {page} <span aria-hidden="true">/</span> {pageCount}
            {paywalled && (
              <span className="ml-3 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Paywall
              </span>
            )}
          </div>

          <Button
            variant="outline"
            onClick={goNext}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            <span className="mr-1 hidden sm:inline">அடுத்த பக்கம் / Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </nav>

        {/* Free-tier hint */}
        {isPremium && !isSubscribed && page <= FREE_LIMIT && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            <span lang="ta">இலவச முன்னோட்டம்: முதல் {FREE_LIMIT} பக்கங்கள் மட்டும்</span>
            <span className="ml-2 italic">
              / Free preview: first {FREE_LIMIT} pages only
            </span>
          </p>
        )}
      </main>
    </div>
  );
}
