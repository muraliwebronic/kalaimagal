"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

const Schema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, digits, hyphens"),
  nameTamil: z.string().trim().min(1),
  nameEnglish: z.string().trim().min(1),
  descriptionTamil: z.string().trim().optional(),
  descriptionEnglish: z.string().trim().optional(),
  priceInr: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use 1234 or 1234.56"),
  durationDays: z.coerce.number().int().min(1).max(3650),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});
type FormValues = z.input<typeof Schema>;

interface Initial {
  id: number;
  slug: string;
  nameTamil: string;
  nameEnglish: string;
  descriptionTamil: string | null;
  descriptionEnglish: string | null;
  priceInr: string;
  durationDays: number;
  isActive: boolean;
  isFeatured: boolean;
}

interface PlanFormProps {
  lang: AdminLang;
  mode: "create" | "edit";
  initial?: Initial;
}

export function PlanForm({ lang, mode, initial }: PlanFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: initial
      ? {
          slug: initial.slug,
          nameTamil: initial.nameTamil,
          nameEnglish: initial.nameEnglish,
          descriptionTamil: initial.descriptionTamil ?? "",
          descriptionEnglish: initial.descriptionEnglish ?? "",
          priceInr: initial.priceInr,
          durationDays: initial.durationDays,
          isActive: initial.isActive,
          isFeatured: initial.isFeatured,
        }
      : {
          slug: "",
          nameTamil: "",
          nameEnglish: "",
          descriptionTamil: "",
          descriptionEnglish: "",
          priceInr: "99",
          durationDays: 30,
          isActive: true,
          isFeatured: false,
        },
  });

  async function onSubmit(values: FormValues) {
    setBusy("save");
    setFeedback(null);
    const url = mode === "create" ? "/api/admin/plans" : `/api/admin/plans/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setFeedback({ kind: "err", msg: data.error ?? "Save failed" });
      return;
    }
    if (mode === "create" && data.id) {
      router.push(`/admin/plans/${data.id}/edit`);
    } else {
      setFeedback({ kind: "ok", msg: t(adminStrings.common.saved, lang) });
      router.refresh();
    }
  }

  async function destroy() {
    if (!initial) return;
    if (!confirm(t(adminStrings.common.confirmDelete, lang))) return;
    setBusy("delete");
    const res = await fetch(`/api/admin/plans/${initial.id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      router.push("/admin/plans");
    } else {
      const data = await res.json().catch(() => ({}));
      setFeedback({ kind: "err", msg: data.error ?? "Delete failed" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label={t(adminStrings.plans.fields.slug, lang)} error={errors.slug?.message}>
        <Input {...register("slug")} placeholder="monthly" />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t(adminStrings.plans.fields.nameEnglish, lang)} error={errors.nameEnglish?.message}>
          <Input {...register("nameEnglish")} />
        </Field>
        <Field label={t(adminStrings.plans.fields.nameTamil, lang)} error={errors.nameTamil?.message}>
          <Input lang="ta" {...register("nameTamil")} />
        </Field>
      </div>
      <Field label="Description (English)">
        <textarea
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("descriptionEnglish")}
        />
      </Field>
      <Field label="Description (Tamil)">
        <textarea
          lang="ta"
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("descriptionTamil")}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t(adminStrings.plans.fields.priceInr, lang)} error={errors.priceInr?.message}>
          <Input inputMode="decimal" {...register("priceInr")} />
        </Field>
        <Field label={t(adminStrings.plans.fields.durationDays, lang)} error={errors.durationDays?.message}>
          <Input type="number" inputMode="numeric" {...register("durationDays")} />
        </Field>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isActive")} />
          {t(adminStrings.plans.fields.isActive, lang)}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isFeatured")} />
          {t(adminStrings.plans.fields.isFeatured, lang)}
        </label>
      </div>

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

      <div className="flex gap-2 border-t border-border pt-5">
        <Button type="submit" disabled={busy !== null} size="lg">
          {busy === "save" ? t(adminStrings.common.loading, lang) : t(adminStrings.common.save, lang)}
        </Button>
        {mode === "edit" && (
          <Button
            type="button"
            variant="destructive"
            disabled={busy !== null}
            size="lg"
            onClick={destroy}
            className="ml-auto"
          >
            {busy === "delete" ? t(adminStrings.common.loading, lang) : t(adminStrings.common.delete, lang)}
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
