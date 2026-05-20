"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Schema = z
  .object({
    password: z.string().min(8, "Use 8+ characters").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof Schema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSubmitError(data.error ?? "Reset failed");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          ✓
        </div>
        <p lang="ta" className="font-heading text-xl">கடவுச்சொல் மீட்டமைக்கப்பட்டது</p>
        <p className="text-sm text-muted-foreground italic">
          Password updated. All sessions have been signed out — please log in again.
        </p>
        <p>
          <Link href="/login" className="text-primary hover:underline">
            உள்நுழைய / Go to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block space-y-1.5">
        <span className="text-sm">
          <span lang="ta">புதிய கடவுச்சொல்</span>
          <span className="ml-1.5 text-xs text-muted-foreground">/ New password</span>
        </span>
        <Input
          type="password"
          autoFocus
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <span className="block text-xs text-destructive">{errors.password.message}</span>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm">
          <span lang="ta">மீண்டும் தட்டச்சு செய்க</span>
          <span className="ml-1.5 text-xs text-muted-foreground">/ Confirm</span>
        </span>
        <Input
          type="password"
          autoComplete="new-password"
          {...register("confirm")}
        />
        {errors.confirm && (
          <span className="block text-xs text-destructive">{errors.confirm.message}</span>
        )}
      </label>

      {submitError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "..." : "மீட்டமை / Reset password"}
      </Button>
    </form>
  );
}
