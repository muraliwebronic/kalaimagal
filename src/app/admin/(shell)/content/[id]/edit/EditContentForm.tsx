"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

interface Initial {
  id: number;
  type: "PDF" | "BLOG";
  slug: string;
  titleTamil: string;
  titleEnglish: string | null;
  description: string | null;
  excerpt: string | null;
  bodyText: string | null;
  isPremium: boolean;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  language: "TA" | "EN" | "BILINGUAL";
  readingTimeMinutes: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  renderState: "PENDING" | "RENDERING" | "READY" | "FAILED";
}

interface FormValues {
  titleTamil: string;
  titleEnglish: string;
  slug: string;
  description: string;
  excerpt: string;
  bodyText: string;
  language: "TA" | "EN" | "BILINGUAL";
  readingTimeMinutes: string;
  metaTitle: string;
  metaDescription: string;
  isPremium: boolean;
  isFeatured: boolean;
}

export function EditContentForm({
  lang,
  initial,
}: {
  lang: AdminLang;
  initial: Initial;
}) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [busy, setBusy] = useState<"save" | "publish" | "unpublish" | "delete" | null>(null);

  const { register, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: {
      titleTamil: initial.titleTamil,
      titleEnglish: initial.titleEnglish ?? "",
      slug: initial.slug,
      description: initial.description ?? "",
      excerpt: initial.excerpt ?? "",
      bodyText: initial.bodyText ?? "",
      language: initial.language,
      readingTimeMinutes: initial.readingTimeMinutes ? String(initial.readingTimeMinutes) : "",
      metaTitle: initial.metaTitle ?? "",
      metaDescription: initial.metaDescription ?? "",
      isPremium: initial.isPremium,
      isFeatured: initial.isFeatured,
    },
  });

  function buildPatch(values: FormValues, statusOverride?: Initial["status"]) {
    return {
      titleTamil: values.titleTamil.trim(),
      titleEnglish: values.titleEnglish.trim() || null,
      slug: values.slug.trim(),
      description: values.description.trim() || null,
      excerpt: values.excerpt.trim() || null,
      bodyText: values.bodyText.trim() || null,
      language: values.language,
      readingTimeMinutes: values.readingTimeMinutes ? Number(values.readingTimeMinutes) : null,
      metaTitle: values.metaTitle.trim() || null,
      metaDescription: values.metaDescription.trim() || null,
      isPremium: !!values.isPremium,
      isFeatured: !!values.isFeatured,
      ...(statusOverride ? { status: statusOverride } : {}),
    };
  }

  async function save(values: FormValues, statusOverride?: Initial["status"]) {
    setFeedback(null);
    setBusy(statusOverride === "PUBLISHED" ? "publish" : statusOverride === "DRAFT" ? "unpublish" : "save");

    const res = await fetch(`/api/admin/content/${initial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPatch(values, statusOverride)),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);

    if (!res.ok) {
      setFeedback({ kind: "err", msg: data.error ?? "Save failed" });
      return;
    }
    setFeedback({ kind: "ok", msg: t(adminStrings.common.saved, lang) });
    router.refresh();
  }

  async function destroy() {
    if (!confirm(t(adminStrings.common.confirmDelete, lang))) return;
    setBusy("delete");
    const res = await fetch(`/api/admin/content/${initial.id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      router.push("/admin/content");
    } else {
      const data = await res.json().catch(() => ({}));
      setFeedback({ kind: "err", msg: data.error ?? "Delete failed" });
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit((v) => save(v))}
      noValidate
    >
      <Field label={t(adminStrings.content.fields.titleTamil, lang)}>
        <Input lang="ta" {...register("titleTamil")} />
      </Field>
      <Field label={t(adminStrings.content.fields.titleEnglish, lang)}>
        <Input {...register("titleEnglish")} />
      </Field>
      <Field label={t(adminStrings.content.fields.slug, lang)}>
        <Input {...register("slug")} />
      </Field>

      <Field label={t(adminStrings.content.fields.description, lang)}>
        <textarea
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
      </Field>

      {initial.type === "BLOG" && (
        <>
          <Field label={t(adminStrings.content.fields.excerpt, lang)}>
            <textarea
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("excerpt")}
            />
          </Field>
          <Field
            label={t(adminStrings.content.fields.body, lang)}
            hint={t(adminStrings.content.fields.bodyHelp, lang)}
          >
            <textarea
              rows={14}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
              {...register("bodyText")}
            />
          </Field>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Language">
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register("language")}
          >
            <option value="TA">TA</option>
            <option value="EN">EN</option>
            <option value="BILINGUAL">BILINGUAL</option>
          </select>
        </Field>
        <Field label={t(adminStrings.content.fields.readingTimeMinutes, lang)}>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            {...register("readingTimeMinutes")}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isPremium")} />
          {t(adminStrings.content.fields.isPremium, lang)}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isFeatured")} />
          {t(adminStrings.content.fields.isFeatured, lang)}
        </label>
      </div>

      <details>
        <summary className="cursor-pointer text-sm font-medium">SEO</summary>
        <div className="mt-3 space-y-4">
          <Field label="meta title">
            <Input {...register("metaTitle")} />
          </Field>
          <Field label="meta description">
            <textarea
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("metaDescription")}
            />
          </Field>
        </div>
      </details>

      {feedback && (
        <div
          className={
            feedback.kind === "ok"
              ? "rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary"
              : "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          }
        >
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t border-border pt-6">
        <Button type="submit" disabled={busy !== null} size="lg">
          {busy === "save" ? t(adminStrings.common.loading, lang) : t(adminStrings.common.save, lang)}
        </Button>

        {initial.status !== "PUBLISHED" && (
          <Button
            type="button"
            variant="outline"
            // PDFs can't be published until the cron has rasterised every
            // page to the base cache — otherwise readers would hit the
            // synchronous-fallback path on every uncached page, blowing
            // the cost win.
            disabled={busy !== null || (initial.type === "PDF" && initial.renderState !== "READY")}
            size="lg"
            onClick={() => save(getValues(), "PUBLISHED")}
            title={
              initial.type === "PDF" && initial.renderState !== "READY"
                ? `Pages still rendering — publish unlocks at READY (currently ${initial.renderState})`
                : undefined
            }
          >
            {busy === "publish"
              ? t(adminStrings.common.loading, lang)
              : t(adminStrings.common.publish, lang)}
          </Button>
        )}
        {initial.status === "PUBLISHED" && (
          <Button
            type="button"
            variant="outline"
            disabled={busy !== null}
            size="lg"
            onClick={() => save(getValues(), "DRAFT")}
          >
            {busy === "unpublish"
              ? t(adminStrings.common.loading, lang)
              : t(adminStrings.common.unpublish, lang)}
          </Button>
        )}

        <Button
          type="button"
          variant="destructive"
          disabled={busy !== null}
          size="lg"
          onClick={destroy}
          className="ml-auto"
        >
          {busy === "delete"
            ? t(adminStrings.common.loading, lang)
            : t(adminStrings.common.delete, lang)}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
