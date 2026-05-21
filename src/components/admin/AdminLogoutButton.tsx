"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

export function AdminLogoutButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
      title={label}
    >
      <LogOut className="size-3.5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}
