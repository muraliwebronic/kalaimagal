"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, Bookmark, ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize } from "lucide-react";
import { PreviewBlur } from "./PreviewBlur";
import { SubscriptionPanel } from "./SubscriptionPanel";

// react-pageflip touches `window` at import time, so it must be loaded
// client-only. The wrapper also has its own in-memory blob cache that
// must not be re-initialised by SSR.
const FlipBookViewer = dynamic(
  () => import("./FlipBookViewer").then((m) => m.FlipBookViewer),
  { ssr: false, loading: () => <FlipBookSkeleton /> },
);

function FlipBookSkeleton() {
  return (
    <div className="grid place-items-center" style={{ aspectRatio: "3 / 4", maxWidth: 760, margin: "0 auto" }}>
      <div className="flex flex-col items-center gap-3 text-gold-pale">
        <span className="size-9 rounded-full border-2 border-gold-pale/30 border-t-gold-pale animate-spin" />
        <span className="text-xs italic" style={{ fontFamily: "var(--font-display)" }}>
          opening the book…
        </span>
      </div>
    </div>
  );
}

export interface PdfReaderProps {
  /** Numeric content id used by /api/convert?doc_id=*/
  contentId: number;
  pageCount: number;
  isPremium: boolean;
  isSubscribed: boolean;
  isLoggedIn: boolean;
  user?: { name: string; email: string; phone?: string | null } | null;
  titleTamil: string;
  titleEnglish?: string | null;
  authorNameTamil?: string | null;
  /** Display price for the paywall CTA. */
  priceInr?: number;
  /** Slug, used to build the back-to-detail link. */
  backHref: string;
}

const FREE_LIMIT = 2;

/**
 * Editorial dark-mode reader. Dark warm-brown background, Tamil chrome,
 * sticky top bar with progress, prev/next side arrows, paywall blur +
 * SubscriptionPanel slides over page 2 for non-subscribers viewing premium.
 */
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
  // Discrete zoom steps so the reader feels deliberate and the book
  // doesn't end up at awkward sizes that crop or float.
  const ZOOM_STEPS = [0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2, 2.5, 3] as const;
  const DEFAULT_ZOOM_INDEX = 2; // 1.0
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const zoom = ZOOM_STEPS[zoomIndex];
  const zoomOut = () => setZoomIndex((i) => Math.max(0, i - 1));
  const zoomIn = () => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1));
  const zoomReset = () => setZoomIndex(DEFAULT_ZOOM_INDEX);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Block Ctrl+S / Ctrl+P / Ctrl+C inside the reader
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

  // Arrow-key nav
  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(pageCount, p + 1)), [pageCount]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      // Zoom shortcuts mirror the standard browser-like reader feel.
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-" || e.key === "_") zoomOut();
      if (e.key === "0") zoomReset();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  // Free-tier users on premium content see only FREE_LIMIT pages inside
  // the flipbook. The "next" leaf after that is the subscription panel.
  const isPaywalledBook = isPremium && !isSubscribed;
  const effectivePageCount = isPaywalledBook ? Math.min(pageCount, FREE_LIMIT) : pageCount;
  const paywalled = isPaywalledBook && page > FREE_LIMIT;
  const progressPct = (Math.min(page, effectivePageCount) / pageCount) * 100;

  return (
    // h-dvh + flex-column lock the reader to the actual viewport height
    // (no page-level scrollbar) and let the flipbook stage claim every
    // pixel between the header and the mobile bottom nav. overflow-hidden
    // at the outer shell catches any flip-animation overshoot.
    <div
      className="fixed inset-0 z-50 h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: "#2A1F18", color: "#F1E6D2" }}
    >
      {/* Top chrome — dark warm-ink with gold-pale text */}
      <header
        className="z-30 flex items-center justify-between gap-3 px-4 md:px-8 py-3.5 shrink-0"
        style={{
          background: "rgba(27,20,16,0.96)",
          borderBottom: "1px solid rgba(216,184,124,.15)",
        }}
      >
        <div className="flex items-center gap-3 md:gap-5 min-w-0">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm shrink-0"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--gold-pale)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M9 2 L4 7 L9 12" />
            </svg>
            <span data-bi lang="ta">திரும்பு</span>
            <span data-bi lang="en">Back</span>
          </Link>
          <div className="border-l h-5 hidden md:block" style={{ borderColor: "rgba(216,184,124,.2)" }} />
          <div className="min-w-0 hidden md:block">
            <div lang="ta" className="ta text-sm truncate" style={{ color: "#F1E6D2", maxWidth: 320 }}>
              {titleTamil}
            </div>
            {(authorNameTamil || titleEnglish) && (
              <div
                className="text-xs truncate"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "#8A7A60", maxWidth: 320 }}
              >
                {authorNameTamil}
                {authorNameTamil && titleEnglish && " · "}
                {titleEnglish}
              </div>
            )}
          </div>
        </div>

        {/* Page counter + progress */}
        <div
          className="flex items-center gap-2 md:gap-3.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="hidden md:inline" style={{ fontStyle: "italic", color: "#8A7A60", fontSize: 13 }}>Page</span>
          <span style={{ fontSize: 17, color: "#F1E6D2", fontVariantNumeric: "tabular-nums" }}>{page}</span>
          <span style={{ color: "#8A7A60" }}>/</span>
          <span style={{ fontSize: 14, color: "#8A7A60", fontVariantNumeric: "tabular-nums" }}>
            {pageCount.toLocaleString()}
          </span>
          <div
            className="hidden sm:block ml-2 w-20 h-0.5"
            style={{ background: "rgba(216,184,124,.2)" }}
          >
            <div
              className="h-full"
              style={{ width: `${progressPct}%`, background: "var(--turmeric)" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom cluster — out / current% / in. Reset on label click. */}
          <div
            className="hidden sm:flex items-center"
            style={{ border: "1px solid rgba(216,184,124,.18)" }}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoomIndex === 0}
              aria-label="Zoom out"
              className="grid place-items-center w-8 h-8 transition-colors disabled:opacity-30 hover:bg-white/5"
              style={{ color: "var(--gold-pale)" }}
            >
              <ZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={zoomReset}
              aria-label="Reset zoom"
              className="px-2 h-8 text-[11px] tabular-nums transition-colors hover:bg-white/5"
              style={{
                color: "var(--gold-pale)",
                fontFamily: "var(--font-display)",
                borderLeft: "1px solid rgba(216,184,124,.18)",
                borderRight: "1px solid rgba(216,184,124,.18)",
              }}
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoomIndex === ZOOM_STEPS.length - 1}
              aria-label="Zoom in"
              className="grid place-items-center w-8 h-8 transition-colors disabled:opacity-30 hover:bg-white/5"
              style={{ color: "var(--gold-pale)" }}
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>
          <ReaderIcon ariaLabel="Bookmark">
            <Bookmark className="size-3.5" />
          </ReaderIcon>
          <ReaderIcon ariaLabel="Toggle Fullscreen" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="size-3.5" /> : <Maximize className="size-3.5" />}
          </ReaderIcon>
          {paywalled && (
            <span
              className="px-2 py-1 ml-2"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "var(--burgundy)",
                color: "var(--logo-yellow)",
              }}
            >
              <span data-bi lang="ta">முழுபக்கம்</span>
              <span data-bi lang="en">Paywall</span>
            </span>
          )}
        </div>
      </header>

      {/* The stage — flex-1 fills every pixel between header and mobile
          nav. overflow-hidden contains any flip-animation overshoot so
          no browser scrollbar ever appears. The FlipBookViewer itself
          provides internal breathing-room padding so curls and shadows
          render in full. */}
      <main className="flex-1 min-h-0 flex items-center justify-center overflow-auto relative">
        <FlipBookViewer
          contentId={contentId}
          pageCount={effectivePageCount}
          totalPageCount={pageCount}
          page={Math.min(page, effectivePageCount + (isPaywalledBook ? 1 : 0))}
          onPageChange={setPage}
          zoom={zoom}
          showSubscribeTail={isPaywalledBook}
        />
        {paywalled && <PreviewBlur />}
        {paywalled && (
          <SubscriptionPanel
            titleTamil={titleTamil}
            titleEnglish={titleEnglish}
            authorNameTamil={authorNameTamil}
            priceInr={priceInr}
            isLoggedIn={isLoggedIn}
            user={user}
          />
        )}
      </main>

      {/* Floating side arrows — only on desktop */}
      <button
        type="button"
        onClick={goPrev}
        disabled={page === 1}
        aria-label="Previous page"
        className="hidden md:grid fixed left-6 top-1/2 -translate-y-1/2 place-items-center w-11 h-11 rounded-full transition-opacity disabled:opacity-30"
        style={{
          background: "rgba(241,230,210,.06)",
          color: "var(--gold-pale)",
          border: "1px solid rgba(216,184,124,.18)",
        }}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={page >= pageCount}
        aria-label="Next page"
        className="hidden md:grid fixed right-6 top-1/2 -translate-y-1/2 place-items-center w-11 h-11 rounded-full transition-opacity disabled:opacity-30"
        style={{
          background: "rgba(241,230,210,.06)",
          color: "var(--gold-pale)",
          border: "1px solid rgba(216,184,124,.18)",
        }}
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Mobile-only bottom nav — shrink-0 keeps it in the column. */}
      <nav className="md:hidden shrink-0 flex items-center justify-between gap-3 px-4 py-3"
        style={{
          background: "rgba(27,20,16,0.96)",
          borderTop: "1px solid rgba(216,184,124,.15)",
        }}
        aria-label="Page nav"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={page === 1}
          className="grid place-items-center w-10 h-10 disabled:opacity-30"
          style={{
            background: "rgba(241,230,210,.06)",
            color: "var(--gold-pale)",
            border: "1px solid rgba(216,184,124,.18)",
          }}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div
          className="flex items-center"
          style={{ border: "1px solid rgba(216,184,124,.18)", borderRadius: "4px" }}
        >
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomIndex === 0}
            aria-label="Zoom out"
            className="grid place-items-center w-8 h-8 transition-colors disabled:opacity-30 active:bg-white/5"
            style={{ color: "var(--gold-pale)" }}
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={zoomReset}
            aria-label="Reset zoom"
            className="px-2 h-8 text-[11px] tabular-nums transition-colors active:bg-white/5"
            style={{
              color: "var(--gold-pale)",
              fontFamily: "var(--font-display)",
              borderLeft: "1px solid rgba(216,184,124,.18)",
              borderRight: "1px solid rgba(216,184,124,.18)",
            }}
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
            className="grid place-items-center w-8 h-8 transition-colors disabled:opacity-30 active:bg-white/5"
            style={{ color: "var(--gold-pale)" }}
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={page >= pageCount}
          className="grid place-items-center w-10 h-10 disabled:opacity-30"
          style={{
            background: "rgba(241,230,210,.06)",
            color: "var(--gold-pale)",
            border: "1px solid rgba(216,184,124,.18)",
          }}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>

      {/* Free-tier hint — floating just above mobile nav / bottom edge
          on desktop so it doesn't claim stage space. */}
      {isPremium && !isSubscribed && page <= FREE_LIMIT && (
        <p
          className="absolute bottom-4 md:bottom-3 left-1/2 -translate-x-1/2 z-20 text-center text-xs whitespace-nowrap px-3 py-1.5 rounded-full pointer-events-none"
          style={{
            color: "var(--gold-pale)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            background: "rgba(27,20,16,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span data-bi lang="ta">இலவச முன்னோட்டம்: முதல் {FREE_LIMIT} பக்கங்கள் மட்டும்</span>
          <span data-bi lang="en">Free preview: first {FREE_LIMIT} pages only</span>
        </p>
      )}
    </div>
  );
}

function ReaderIcon({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="grid place-items-center w-8 h-8 transition-colors"
      style={{
        color: "var(--gold-pale)",
        border: "1px solid rgba(216,184,124,.18)",
      }}
    >
      {children}
    </button>
  );
}
