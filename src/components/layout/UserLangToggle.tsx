"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import type { UserLang } from "@/lib/user-lang";

interface UserLangToggleProps {
  current: UserLang;
  /** Compact / icon-only variant for tight nav spaces. */
  variant?: "default" | "compact";
}

export function UserLangToggle({ current, variant = "default" }: UserLangToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: UserLang = current === "ta" ? "en" : "ta";

  function toggle() {
    startTransition(async () => {
      const res = await fetch("/api/user/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: next }),
      });
      if (res.ok) router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      title={`Switch to ${next === "en" ? "English" : "தமிழ்"}`}
      aria-label="Toggle language"
      className={
        variant === "compact"
          ? "inline-flex items-center gap-1 rounded-md p-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
          : "inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium tabular-nums hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
      }
    >
      <Languages className="size-3.5" />
      <span lang="ta" className={current === "ta" ? "text-foreground" : "text-muted-foreground"}>
        த
      </span>
      <span className="text-muted-foreground/50">·</span>
      <span className={current === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
    </button>
  );
}
