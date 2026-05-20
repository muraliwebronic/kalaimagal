"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

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
      <div className="text-center">
        <div
          className="mx-auto mb-5 grid place-items-center size-14"
          style={{ border: "1px solid var(--peacock)", color: "var(--peacock)", fontSize: 24 }}
        >
          ✓
        </div>
        <p lang="ta" className="ta-display text-burgundy text-xl mb-3">
          கடவுச்சொல் மீட்டமைக்கப்பட்டது
        </p>
        <p
          className="text-ink-2 mb-5"
          style={{ fontFamily: "var(--font-display)", fontSize: 14, lineHeight: 1.7 }}
        >
          <span data-bi lang="ta">
            கடவுச்சொல் புதுப்பிக்கப்பட்டது. எல்லா சாதனங்களிலும் வெளியேற்றப்பட்டது — மீண்டும் உள்நுழையவும்.
          </span>
          <span data-bi lang="en">
            Password updated. All sessions have been signed out — please sign in again.
          </span>
        </p>
        <Link
          href="/login"
          className="btn btn-primary"
          style={{ padding: "13px 32px", fontSize: 14 }}
        >
          <span data-bi lang="ta">உள்நுழை</span>
          <span data-bi lang="en">Sign in</span>
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-km">
        <label>
          <span data-bi lang="ta">புதிய கடவுச்சொல்</span>
          <span data-bi lang="en">New password</span>
        </label>
        <input type="password" autoFocus autoComplete="new-password" {...register("password")} />
        {errors.password && (
          <span className="text-xs" style={{ color: "var(--kumkum)" }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="field-km">
        <label>
          <span data-bi lang="ta">மீண்டும் தட்டச்சு செய்</span>
          <span data-bi lang="en">Confirm password</span>
        </label>
        <input type="password" autoComplete="new-password" {...register("confirm")} />
        {errors.confirm && (
          <span className="text-xs" style={{ color: "var(--kumkum)" }}>
            {errors.confirm.message}
          </span>
        )}
      </div>

      {submitError && (
        <div
          className="text-sm"
          style={{
            background: "rgba(155,27,46,.06)",
            border: "1px solid rgba(155,27,46,.25)",
            color: "var(--kumkum)",
            padding: "10px 12px",
          }}
        >
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary mt-2"
        style={{ width: "100%", padding: "13px", fontSize: 14 }}
      >
        {isSubmitting ? (
          <span data-bi lang="ta">...</span>
        ) : (
          <>
            <span data-bi lang="ta">மீட்டமை</span>
            <span data-bi lang="en">Reset password</span>
            <span style={{ opacity: 0.6 }}>→</span>
          </>
        )}
      </button>
    </form>
  );
}
