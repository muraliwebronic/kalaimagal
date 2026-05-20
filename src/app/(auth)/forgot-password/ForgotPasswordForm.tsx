"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Schema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
});
type FormValues = z.infer<typeof Schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(Schema) });

  async function onSubmit(values: FormValues) {
    // Endpoint always returns 200 to avoid user-enumeration
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          ✓
        </div>
        <h2 lang="ta" className="font-heading text-xl">
          உங்கள் மின்னஞ்சலை சரிபார்க்கவும்
        </h2>
        <p className="text-sm text-muted-foreground">
          <span lang="ta">அந்த முகவரிக்கு கணக்கு இருந்தால், 15 நிமிடத்திற்கான மீட்பு இணைப்பு அனுப்பப்பட்டது.</span>
          <br />
          <span lang="en" className="italic">If the address exists, a reset link valid for 15 minutes has been sent.</span>
        </p>
        <p className="text-sm">
          <Link href="/login" className="text-primary hover:underline">
            உள்நுழைய திரும்பு / Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block space-y-1.5">
        <span className="text-sm">
          <span lang="ta">மின்னஞ்சல்</span>
          <span className="ml-1.5 text-xs text-muted-foreground">/ Email</span>
        </span>
        <Input
          type="email"
          autoFocus
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="block text-xs text-destructive">{errors.email.message}</span>
        )}
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "..." : "மீட்பு இணைப்பு அனுப்பவும் / Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          உள்நுழைய திரும்பு / Back to login
        </Link>
      </p>
    </form>
  );
}
