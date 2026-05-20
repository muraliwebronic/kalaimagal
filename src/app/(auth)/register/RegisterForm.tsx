"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Schema = z.object({
  name: z.string().trim().min(1, "Required").max(150),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^\+?[0-9 \-]{7,20}$/.test(v),
      "Invalid phone number",
    ),
  password: z.string().min(8, "Use 8+ characters").max(128),
  acceptedTerms: z.literal(true, { message: "Please accept the terms" }),
  marketingConsent: z.boolean().optional().default(false),
});
type FormValues = z.input<typeof Schema>;

export function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { marketingConsent: false },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setSubmitError(data.error ?? "Registration failed");
      return;
    }
    window.location.href = "/account?welcome=1";
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field label={{ ta: "பெயர்", en: "Name" }} error={errors.name?.message}>
        <Input autoFocus autoComplete="name" {...register("name")} />
      </Field>

      <Field label={{ ta: "மின்னஞ்சல்", en: "Email" }} error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </Field>

      <Field
        label={{ ta: "தொலைபேசி (விருப்பம்)", en: "Phone (optional)" }}
        error={errors.phone?.message}
      >
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91"
          {...register("phone")}
        />
      </Field>

      <Field
        label={{ ta: "கடவுச்சொல்", en: "Password" }}
        error={errors.password?.message}
      >
        <Input
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
      </Field>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          {...register("acceptedTerms")}
        />
        <span>
          <span lang="ta">
            <Link href="/legal/terms" className="text-primary hover:underline">
              விதிமுறைகளை
            </Link>{" "}
            ஏற்கிறேன்
          </span>
          <span className="ml-1.5 text-xs text-muted-foreground">
            / I accept the terms
          </span>
        </span>
      </label>
      {errors.acceptedTerms?.message && (
        <p className="text-xs text-destructive">{errors.acceptedTerms.message}</p>
      )}

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          {...register("marketingConsent")}
        />
        <span>
          <span lang="ta">புதிய வெளியீடுகள் பற்றிய மின்னஞ்சல்கள்</span>
          <span className="ml-1.5 text-xs text-muted-foreground">
            / Send me updates about new releases
          </span>
        </span>
      </label>

      {submitError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "..." : "பதிவு செய்க / Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ஏற்கனவே கணக்கு உள்ளதா? / Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          உள்நுழைய
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: { ta: string; en: string };
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm">
        <span lang="ta">{label.ta}</span>
        <span className="ml-1.5 text-xs text-muted-foreground" lang="en">
          / {label.en}
        </span>
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  );
}
