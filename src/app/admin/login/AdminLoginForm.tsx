"use client";

import { useState } from "react";
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

const ADMIN_ROLES = new Set(["EDITOR", "ADMIN", "SUPER_ADMIN"]);

interface AdminLoginFormProps {
  /** True if user is signed in but doesn't have an admin role. */
  signedInButNotAdmin: boolean;
}

export function AdminLoginForm({ signedInButNotAdmin }: AdminLoginFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(
    signedInButNotAdmin ? "This account does not have admin access." : null,
  );

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

    if (!ADMIN_ROLES.has(data.user?.role)) {
      // Log them out so the residual session doesn't leak access elsewhere
      await fetch("/api/auth/logout", { method: "POST" });
      setSubmitError("This account does not have admin access.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Email</span>
        <Input
          type="email"
          autoComplete="email"
          autoFocus
          {...register("email")}
        />
        {errors.email && (
          <span className="block text-xs text-destructive">{errors.email.message}</span>
        )}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Password</span>
        <Input
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <span className="block text-xs text-destructive">{errors.password.message}</span>
        )}
      </label>

      {submitError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "..." : "Sign in"}
      </Button>
    </form>
  );
}
