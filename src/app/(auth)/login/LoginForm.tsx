"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof Schema>;

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSubmitError(data.error ?? "Login failed");
      return;
    }
    // Force a full reload so server components pick up the new cookies
    window.location.href = next || "/account";
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field
        label={{ ta: "மின்னஞ்சல்", en: "Email" }}
        error={errors.email?.message}
      >
        <Input
          type="email"
          autoComplete="email"
          autoFocus
          {...register("email")}
        />
      </Field>

      <Field
        label={{ ta: "கடவுச்சொல்", en: "Password" }}
        error={errors.password?.message}
        hint={
          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline"
          >
            மறந்துவிட்டதா? / Forgot?
          </Link>
        }
      >
        <Input
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
      </Field>

      {submitError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "..." : "உள்நுழைய / Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        புதிய கணக்கா? / New here?{" "}
        <Link href="/register" className="text-primary hover:underline">
          பதிவு செய்க
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: { ta: string; en: string };
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between">
        <span className="text-sm">
          <span lang="ta">{label.ta}</span>
          <span className="ml-1.5 text-xs text-muted-foreground" lang="en">
            / {label.en}
          </span>
        </span>
        {hint}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
