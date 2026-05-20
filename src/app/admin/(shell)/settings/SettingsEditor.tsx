"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

interface Row {
  key: string;
  description: string | null;
  value: unknown;
}

export function SettingsEditor({
  lang,
  initial,
}: {
  lang: AdminLang;
  initial: Row[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((r) => [r.key, JSON.stringify(r.value, null, 2)])),
  );
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [globalFeedback, setGlobalFeedback] = useState<{
    kind: "ok" | "err";
    msg: string;
  } | null>(null);

  function update(key: string, raw: string) {
    setValues((v) => ({ ...v, [key]: raw }));
    setDirty((d) => new Set([...d, key]));
    try {
      JSON.parse(raw);
      setErrors((e) => ({ ...e, [key]: undefined }));
    } catch (parseError) {
      const msg =
        parseError instanceof Error ? parseError.message : "Invalid JSON";
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  async function save() {
    setBusy(true);
    setGlobalFeedback(null);

    const updates: Array<{ key: string; value: unknown }> = [];
    for (const key of dirty) {
      try {
        updates.push({ key, value: JSON.parse(values[key]) });
      } catch {
        setBusy(false);
        setGlobalFeedback({ kind: "err", msg: `Fix JSON in "${key}" first` });
        return;
      }
    }

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setGlobalFeedback({ kind: "err", msg: data.error ?? "Save failed" });
      return;
    }
    setDirty(new Set());
    setGlobalFeedback({ kind: "ok", msg: `Saved ${updates.length} setting(s).` });
    router.refresh();
  }

  return (
    <div>
      <ul className="divide-y divide-border">
        {initial.map((row) => {
          const isDirty = dirty.has(row.key);
          const err = errors[row.key];
          return (
            <li key={row.key} className="px-5 py-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="font-mono text-sm">
                  {row.key}
                  {isDirty && (
                    <span className="ml-2 inline-block size-1.5 rounded-full bg-primary" />
                  )}
                </p>
                {row.description && (
                  <p className="text-xs text-muted-foreground text-right max-w-md">
                    {row.description}
                  </p>
                )}
              </div>
              <textarea
                rows={Math.min(Math.max(values[row.key].split("\n").length, 1), 8)}
                spellCheck={false}
                className={
                  "block w-full rounded-md border bg-background px-3 py-2 font-mono text-xs " +
                  (err
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-input focus-visible:ring-ring") +
                  " focus-visible:outline-none focus-visible:ring-2"
                }
                value={values[row.key]}
                onChange={(e) => update(row.key, e.target.value)}
              />
              {err && (
                <p className="mt-1 text-xs text-destructive">JSON parse: {err}</p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border px-5 py-4 flex items-center justify-between gap-3">
        <div>
          {globalFeedback && (
            <div
              className={
                globalFeedback.kind === "ok"
                  ? "rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-primary"
                  : "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-sm text-destructive"
              }
            >
              {globalFeedback.msg}
            </div>
          )}
        </div>
        <Button onClick={save} disabled={busy || dirty.size === 0}>
          {busy
            ? t(adminStrings.common.loading, lang)
            : dirty.size === 0
              ? "No changes"
              : `${t(adminStrings.common.save, lang)} (${dirty.size})`}
        </Button>
      </div>
    </div>
  );
}
