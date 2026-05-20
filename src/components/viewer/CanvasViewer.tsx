"use client";

import { useEffect, useRef, useState } from "react";

interface CanvasViewerProps {
  src: string;        // /api/convert?doc_id=...&page=...
  pageNumber: number;
}

/**
 * Desktop canvas viewer. Fetches a WebP page and draws it onto a canvas
 * rather than putting it in an <img>, which makes save/copy noticeably
 * less obvious. Combined with right-click + Ctrl+S blocking, casual
 * scraping requires actual effort. Not unbreakable (nothing browser-side
 * is); it raises the floor.
 */
export function CanvasViewer({ src, pageNumber }: CanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrorMsg(null);

    (async () => {
      try {
        const res = await fetch(src, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 403) {
            setErrorMsg("PAYWALL");
          } else if (res.status === 429) {
            setErrorMsg("RATE_LIMIT");
          } else {
            setErrorMsg(`HTTP ${res.status}`);
          }
          setStatus("error");
          return;
        }
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setErrorMsg(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, pageNumber]);

  return (
    <div
      className="relative w-full select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          பக்கம் ஏற்றப்படுகிறது...
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block w-full h-auto shadow-md rounded-md bg-white"
        // Tell screen-readers the page label
        aria-label={`Page ${pageNumber}`}
      />
      {status === "error" && errorMsg !== "PAYWALL" && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Failed to load page {pageNumber}{errorMsg ? `: ${errorMsg}` : ""}
        </div>
      )}
    </div>
  );
}
