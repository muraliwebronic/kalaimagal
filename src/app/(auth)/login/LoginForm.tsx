"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof Schema>;

export function LoginForm({ next }: { next?: string }) {
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
    window.location.href = next || "/account";
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-km">
        <label>
          <span data-bi lang="ta">மின்னஞ்சல்</span>
          <span data-bi lang="en">Email</span>
        </label>
        <input type="email" autoComplete="email" autoFocus {...register("email")} />
        {errors.email && (
          <span className="text-xs" style={{ color: "var(--kumkum)" }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="field-km">
        <div className="flex justify-between items-baseline">
          <label>
            <span data-bi lang="ta">கடவுச்சொல்</span>
            <span data-bi lang="en">Password</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-burgundy hover:text-kumkum"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            <span data-bi lang="ta">மறந்துவிட்டதா?</span>
            <span data-bi lang="en">Forgot?</span>
          </Link>
        </div>
        <input type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && (
          <span className="text-xs" style={{ color: "var(--kumkum)" }}>
            {errors.password.message}
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
            <span data-bi lang="ta">உள்நுழை</span>
            <span data-bi lang="en">Sign in</span>
            <span style={{ opacity: 0.6 }}>→</span>
          </>
        )}
      </button>
    </form>
  );
}
