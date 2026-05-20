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
  code: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, "Uppercase letters, digits, _ or -"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use 10 or 99.50"),
  maxUses: z.string().optional(),
  perUserLimit: z.coerce.number().int().min(1).max(100).default(1),
  validUntil: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});
type FormValues = z.input<typeof Schema>;

interface Initial {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: string;
  maxUses: number | null;
  perUserLimit: number;
  validUntil: Date | null;
  isActive: boolean;
}

export function CouponForm({
  lang,
  mode,
  initial,
}: {
  lang: AdminLang;
  mode: "create" | "edit";
  initial?: Initial;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: initial
      ? {
          code: initial.code,
          type: initial.type,
          value: initial.value,
          maxUses: initial.maxUses ? String(initial.maxUses) : "",
          perUserLimit: initial.perUserLimit,
          validUntil: initial.validUntil ? initial.validUntil.toISOString().slice(0, 10) : "",
          isActive: initial.isActive,
        }
      : {
          code: "",
          type: "PERCENTAGE",
          value: "10",
          maxUses: "",
          perUserLimit: 1,
          validUntil: "",
          isActive: true,
        },
  });

  async function onSubmit(values: FormValues) {
    setBusy("save");
    setFeedback(null);
    const url = mode === "create" ? "/api/admin/coupons" : `/api/admin/coupons/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        maxUses: values.maxUses ? Number(values.maxUses) : null,
        validUntil: values.validUntil ? new Date(values.validUntil).toISOString() : null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setFeedback({ kind: "err", msg: data.error ?? "Save failed" });
      return;
    }
    if (mode === "create" && data.id) {
      router.push(`/admin/coupons/${data.id}/edit`);
    } else {
      setFeedback({ kind: "ok", msg: t(adminStrings.common.saved, lang) });
      router.refresh();
    }
  }

  async function destroy() {
    if (!initial) return;
    if (!confirm(t(adminStrings.common.confirmDelete, lang))) return;
    setBusy("delete");
    const res = await fetch(`/api/admin/coupons/${initial.id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      router.push("/admin/coupons");
    } else {
      const data = await res.json().catch(() => ({}));
      setFeedback({ kind: "err", msg: data.error ?? "Delete failed" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field label={t(adminStrings.coupons.fields.code, lang)} error={errors.code?.message}>
        <Input
          placeholder="WELCOME10"
          {...register("code", {
            setValueAs: (v) => (typeof v === "string" ? v.toUpperCase() : v),
          })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t(adminStrings.coupons.fields.type, lang)} error={errors.type?.message}>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...register("type")}
          >
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FIXED">FIXED (INR)</option>
          </select>
        </Field>
        <Field label={t(adminStrings.coupons.fields.value, lang)} error={errors.value?.message}>
          <Input inputMode="decimal" {...register("value")} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t(adminStrings.coupons.fields.maxUses, lang)}>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Blank = unlimited"
            {...register("maxUses")}
          />
        </Field>
        <Field label="Per-user limit">
          <Input type="number" inputMode="numeric" {...register("perUserLimit")} />
        </Field>
      </div>

      <Field label={t(adminStrings.coupons.fields.validUntil, lang)}>
        <Input type="date" {...register("validUntil")} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("isActive")} />
        {t(adminStrings.coupons.fields.isActive, lang)}
      </label>

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
