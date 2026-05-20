"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import type { AdminLang } from "@/lib/admin/lang";

interface LangToggleProps {
  current: AdminLang;
}

export function LangToggle({ current }: LangToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: AdminLang = current === "en" ? "ta" : "en";

  function toggle() {
    startTransition(async () => {
      const res = await fetch("/api/admin/lang", {
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
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium tabular-nums hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
    >
      <Languages className="size-3.5" />
      <span className={current === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground/50">·</span>
      <span className={current === "ta" ? "text-foreground" : "text-muted-foreground"} lang="ta">த</span>
    </button>
  );
}
