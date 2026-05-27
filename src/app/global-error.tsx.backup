"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="paper-warm min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <p
              className="display text-burgundy"
              style={{ fontSize: 96, lineHeight: 1, marginBottom: 12 }}
            >
              !
            </p>
            <h1 className="ta-display text-ink" style={{ fontSize: 26 }}>
              <span data-bi lang="ta">ஏதோ தவறு நடந்துவிட்டது</span>
              <span data-bi lang="en">Something went wrong</span>
            </h1>
            <p
              className="text-ink-2 mt-3"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
            >
              {error.message || "An unexpected error occurred."}
            </p>
            {error.digest && (
              <p
                className="mt-2.5 text-ink-3"
                style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
              >
                digest: {error.digest}
              </p>
            )}
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-primary"
                style={{ padding: "13px 28px", fontSize: 14 }}
              >
                <span data-bi lang="ta">மீண்டும் முயற்சி</span>
                <span data-bi lang="en">Try again</span>
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="btn btn-ghost"
                style={{ padding: "13px 22px", fontSize: 13 }}
              >
                <span data-bi lang="ta">முகப்புக்குச் செல்</span>
                <span data-bi lang="en">Go home</span>
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
