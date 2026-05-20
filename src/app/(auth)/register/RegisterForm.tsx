"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Schema = z.object({
  name: z.string().trim().min(1, "Required").max(150),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\+?[0-9 \-]{7,20}$/.test(v), "Invalid phone number"),
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
    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-km">
        <label>
          <span data-bi lang="ta">பெயர்</span>
          <span data-bi lang="en">Full name</span>
        </label>
        <input lang="ta" autoFocus autoComplete="name" {...register("name")} />
        {errors.name?.message && <FieldError msg={errors.name.message} />}
      </div>

      <div className="field-km">
        <label>
          <span data-bi lang="ta">மின்னஞ்சல்</span>
          <span data-bi lang="en">Email</span>
        </label>
        <input type="email" autoComplete="email" {...register("email")} />
        {errors.email?.message && <FieldError msg={errors.email.message} />}
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] gap-2.5">
        <div className="field-km">
          <label>
            <span data-bi lang="ta">தொலைபேசி</span>
            <span data-bi lang="en">Phone</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91"
            {...register("phone")}
          />
          {errors.phone?.message && <FieldError msg={errors.phone.message} />}
        </div>
        <div className="field-km">
          <label>
            <span data-bi lang="ta">கடவுச்சொல்</span>
            <span data-bi lang="en">Password</span>
          </label>
          <input type="password" autoComplete="new-password" {...register("password")} />
          {errors.password?.message && <FieldError msg={errors.password.message} />}
        </div>
      </div>

      <Checkbox {...register("acceptedTerms")}>
        <span data-bi lang="ta">விதிமுறைகளை ஏற்கிறேன்</span>
        <span data-bi lang="en">I accept the terms</span>
      </Checkbox>
      {errors.acceptedTerms?.message && <FieldError msg={errors.acceptedTerms.message} />}

      <Checkbox {...register("marketingConsent")}>
        <span data-bi lang="ta">புதிய வெளியீடுகள் பற்றிய மின்னஞ்சல்கள் வேண்டும்</span>
        <span data-bi lang="en">Send me updates about new releases</span>
      </Checkbox>

      {submitError && (
        <div
          className="text-sm mt-1"
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
        className="btn btn-primary mt-3"
        style={{ width: "100%", padding: "13px", fontSize: 14 }}
      >
        {isSubmitting ? (
          <span data-bi lang="ta">...</span>
        ) : (
          <>
            <span data-bi lang="ta">பதிவு செய்</span>
            <span data-bi lang="en">Create account</span>
            <span style={{ opacity: 0.6 }}>→</span>
          </>
        )}
      </button>
    </form>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <span className="text-xs" style={{ color: "var(--kumkum)" }}>
      {msg}
    </span>
  );
}

const Checkbox = ({
  children,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode }) => (
  <label
    className="flex items-start gap-2.5 cursor-pointer text-ink-2"
    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 12 }}
  >
    <input
      type="checkbox"
      className="mt-1 size-4 shrink-0"
      style={{ accentColor: "var(--burgundy)" }}
      {...rest}
    />
    <span className="leading-relaxed text-[13px]">{children}</span>
  </label>
);
