"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
});
type FormValues = z.infer<typeof Schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="mx-auto mb-5 grid place-items-center size-14"
          style={{ border: "1px solid var(--peacock)", color: "var(--peacock)", fontSize: 24 }}
        >
          ✓
        </div>
        <p lang="ta" className="ta text-ink mb-3">உங்கள் மின்னஞ்சலை சரிபார்க்கவும்.</p>
        <p
          className="text-ink-2 mb-5"
          style={{ fontFamily: "var(--font-display)", fontSize: 14, lineHeight: 1.7 }}
        >
          <span data-bi lang="ta">
            அந்த முகவரிக்கு கணக்கு இருந்தால், 15 நிமிடத்திற்கான மீட்பு இணைப்பு அனுப்பப்பட்டது.
          </span>
          <span data-bi lang="en">
            If the address exists, a reset link valid for 15 minutes has been sent.
          </span>
        </p>
        <Link
          href="/login"
          className="text-burgundy hover:text-kumkum"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 13,
            borderBottom: "1px solid currentColor",
          }}
        >
          <span data-bi lang="ta">உள்நுழைய திரும்பு</span>
          <span data-bi lang="en">Back to sign in</span>
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-km">
        <label>
          <span data-bi lang="ta">மின்னஞ்சல்</span>
          <span data-bi lang="en">Email</span>
        </label>
        <input type="email" autoFocus autoComplete="email" {...register("email")} />
        {errors.email && (
          <span className="text-xs" style={{ color: "var(--kumkum)" }}>
            {errors.email.message}
          </span>
        )}
      </div>

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
            <span data-bi lang="ta">மீட்பு இணைப்பு அனுப்பு</span>
            <span data-bi lang="en">Send reset link</span>
            <span style={{ opacity: 0.6 }}>→</span>
          </>
        )}
      </button>

      <Link
        href="/login"
        className="text-center text-burgundy hover:text-kumkum"
        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13 }}
      >
        <span data-bi lang="ta">← உள்நுழைய திரும்பு</span>
        <span data-bi lang="en">← Back to sign in</span>
      </Link>
    </form>
  );
}
