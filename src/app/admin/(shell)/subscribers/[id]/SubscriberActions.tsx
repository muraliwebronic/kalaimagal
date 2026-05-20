"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

interface Props {
  userId: number;
  isBanned: boolean;
  lang: AdminLang;
}

export function SubscriberActions({ userId, isBanned, lang }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  async function call(action: string, body: object = {}) {
    setBusy(action);
    setFeedback(null);
    const res = await fetch(`/api/admin/subscribers/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setFeedback({ kind: "err", msg: data.error ?? "Action failed" });
      return;
    }
    setFeedback({ kind: "ok", msg: data.message ?? t(adminStrings.common.saved, lang) });
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        disabled={busy !== null}
        onClick={() => call("extend", { days: 30 })}
      >
        {busy === "extend"
          ? t(adminStrings.common.loading, lang)
          : t(adminStrings.subscribers.actions.extend30, lang)}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        disabled={busy !== null}
        onClick={() => call("send-password-reset")}
      >
        {busy === "send-password-reset"
          ? t(adminStrings.common.loading, lang)
          : t(adminStrings.subscribers.actions.resetPassword, lang)}
      </Button>

      {isBanned ? (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={busy !== null}
          onClick={() => call("unban")}
        >
          {busy === "unban"
            ? t(adminStrings.common.loading, lang)
            : t(adminStrings.subscribers.actions.unban, lang)}
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          className="w-full justify-start"
          disabled={busy !== null}
          onClick={() => call("ban")}
        >
          {busy === "ban"
            ? t(adminStrings.common.loading, lang)
            : t(adminStrings.subscribers.actions.ban, lang)}
        </Button>
      )}

      {feedback && (
        <div
          className={
            feedback.kind === "ok"
              ? "rounded-md border border-primary/30 bg-primary/5 px-2 py-1.5 text-xs text-primary"
              : "rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5 text-xs text-destructive"
          }
        >
          {feedback.msg}
        </div>
      )}
    </div>
  );
}
