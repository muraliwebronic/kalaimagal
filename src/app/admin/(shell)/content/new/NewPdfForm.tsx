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
  isPremium: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
});
type FormValues = z.input<typeof Schema>;

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export function NewPdfForm({ lang }: { lang: AdminLang }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { isPremium: false, isFeatured: false },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    if (!file) {
      setSubmitError("Please select a PDF file");
      return;
    }
    if (file.type !== "application/pdf") {
      setSubmitError("File must be a PDF");
      return;
    }
    if (file.size > MAX_SIZE) {
      setSubmitError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB > 50MB max)`);
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("titleTamil", values.titleTamil);
    if (values.titleEnglish) fd.append("titleEnglish", values.titleEnglish);
    fd.append("isPremium", values.isPremium ? "true" : "false");
    fd.append("isFeatured", values.isFeatured ? "true" : "false");

    // Use XHR for upload progress
    const result = await new Promise<{ ok: boolean; data: { id?: number; error?: string } }>(
      (resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          let body: { id?: number; error?: string } = {};
          try {
            body = JSON.parse(xhr.responseText);
          } catch {}
          resolve({ ok: xhr.status >= 200 && xhr.status < 300, data: body });
        };
        xhr.onerror = () => resolve({ ok: false, data: { error: "Network error" } });
        xhr.send(fd);
      },
    );

    setUploading(false);

    if (!result.ok || !result.data.id) {
      setSubmitError(result.data.error ?? "Upload failed");
      return;
    }
    router.push(`/admin/content/${result.data.id}/edit`);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {t(adminStrings.content.fields.file, lang)}
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-accent"
        />
        <p className="text-xs text-muted-foreground">
          {t(adminStrings.content.fields.fileHelp, lang)}
        </p>
        {file && (
          <p className="text-xs text-foreground">
            {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      <Field label={t(adminStrings.content.fields.titleTamil, lang)} error={errors.titleTamil?.message}>
        <Input lang="ta" autoComplete="off" {...register("titleTamil")} />
      </Field>

      <Field label={t(adminStrings.content.fields.titleEnglish, lang)} error={errors.titleEnglish?.message}>
        <Input autoComplete="off" {...register("titleEnglish")} />
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

      {uploading && (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground tabular-nums">
            {progress}% — uploading + rendering cover…
          </p>
        </div>
      )}

      <div className="pt-2 flex gap-3">
        <Button type="submit" disabled={uploading} size="lg">
          {uploading ? t(adminStrings.common.loading, lang) : t(adminStrings.common.create, lang)}
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
