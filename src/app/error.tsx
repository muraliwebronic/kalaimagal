"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Global error boundary (App Router convention). Catches uncaught errors
 * in any server or client component below the root layout. Per-segment
 * error boundaries can override this for finer-grained recovery.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Best-effort report. Swap to Sentry when SENTRY_DSN is set.
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-heading text-5xl tracking-tight text-primary">!</p>
        <h1 className="mt-4 font-heading text-2xl tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-muted-foreground/70 font-mono">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button variant="outline" size="lg" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
