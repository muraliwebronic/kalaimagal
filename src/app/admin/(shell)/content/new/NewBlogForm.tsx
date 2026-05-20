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
  titleTamil: z.string().trim().min(1, "Required").max(500),
  titleEnglish: z.string().trim().max(500).optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Required")
    .max(255)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, digits, hyphens"),
  excerpt: z.string().trim().max(500).optional(),
  bodyText: z.string().min(1, "Body is required"),
  isPremium: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
});
type FormValues = z.input<typeof Schema>;

export function NewBlogForm({ lang }: { lang: AdminLang }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { isPremium: false, isFeatured: false },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, type: "BLOG" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.id) {
      setSubmitError(data.error ?? "Create failed");
      return;
    }
    router.push(`/admin/content/${data.id}/edit`);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label={t(adminStrings.content.fields.titleTamil, lang)} error={errors.titleTamil?.message}>
        <Input lang="ta" {...register("titleTamil")} />
      </Field>

      <Field label={t(adminStrings.content.fields.titleEnglish, lang)} error={errors.titleEnglish?.message}>
        <Input {...register("titleEnglish")} />
      </Field>

      <Field label={t(adminStrings.content.fields.slug, lang)} error={errors.slug?.message}>
        <Input placeholder="tamil-ilakkiya-varalaru" {...register("slug")} />
      </Field>

      <Field label={t(adminStrings.content.fields.excerpt, lang)} error={errors.excerpt?.message}>
        <textarea
          rows={2}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register("excerpt")}
        />
      </Field>

      <Field label={t(adminStrings.content.fields.body, lang)} error={errors.bodyText?.message}>
        <textarea
          rows={14}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="<p>உங்கள் கட்டுரை இங்கே... or paste Markdown / HTML.</p>"
          {...register("bodyText")}
        />
        <span className="block text-xs text-muted-foreground">
          {t(adminStrings.content.fields.bodyHelp, lang)}
        </span>
      </Field>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isPremium")} />
          {t(adminStrings.content.fields.isPremium, lang)}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isFeatured")} />
          {t(adminStrings.content.fields.isFeatured, lang)}
        </label>
      </div>

      {submitError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? t(adminStrings.common.loading, lang) : t(adminStrings.common.create, lang)}
        </Button>
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
