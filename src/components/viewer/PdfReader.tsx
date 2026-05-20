"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  const paywalled = isPremium && !isSubscribed && page > FREE_LIMIT;
  const displayPage = paywalled ? FREE_LIMIT : page;
  const src = `/api/convert?doc_id=${contentId}&page=${displayPage}`;

  const progressPct = (page / pageCount) * 100;

  return (
    <div className="min-h-screen" style={{ background: "#2A1F18", color: "#F1E6D2" }}>
      {/* Sticky top chrome — dark warm-ink with gold-pale text */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-8 py-3.5"
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
          <ReaderIcon ariaLabel="Bookmark">
            <Bookmark className="size-3.5" />
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
                color: "#FFE8B8",
              }}
            >
              <span data-bi lang="ta">முழுபக்கம்</span>
              <span data-bi lang="en">Paywall</span>
            </span>
          )}
        </div>
      </header>

      {/* Page viewport */}
      <main className="px-4 md:px-8 pt-10 md:pt-14 pb-16 flex justify-center">
        <div className="relative w-full max-w-3xl">
          {paywalled ? (
            <>
              <div className="opacity-90">
                {isMobile ? (
                  <MobileImgViewer src={src} pageNumber={FREE_LIMIT} />
                ) : (
                  <CanvasViewer src={src} pageNumber={FREE_LIMIT} />
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

      {/* Mobile-only bottom nav */}
      <nav className="md:hidden sticky bottom-0 flex items-center justify-between gap-3 px-4 py-3"
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
        <span style={{ fontFamily: "var(--font-display)", color: "#F1E6D2", fontVariantNumeric: "tabular-nums" }}>
          {page} <span style={{ color: "#8A7A60" }}>/</span> {pageCount.toLocaleString()}
        </span>
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

      {/* Free-tier hint — only on free preview pages */}
      {isPremium && !isSubscribed && page <= FREE_LIMIT && (
        <p
          className="text-center text-xs pb-6"
          style={{ color: "var(--gold-pale)", fontFamily: "var(--font-display)", fontStyle: "italic" }}
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
  children,
}: {
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
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
