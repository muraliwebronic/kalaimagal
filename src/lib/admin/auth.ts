import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";

export type AdminRole = "EDITOR" | "ADMIN" | "SUPER_ADMIN";

const ADMIN_ROLES: AdminRole[] = ["EDITOR", "ADMIN", "SUPER_ADMIN"];

export function isAdminRole(role: string): role is AdminRole {
  return ADMIN_ROLES.includes(role as AdminRole);
}

/**
 * Server-side admin guard for /admin/* pages and /api/admin/* routes.
 *
 * - If not signed in → redirect to /admin/login?next=<original-path>
 * - If signed in but not an admin role → redirect to / (home), not to login
 *   (avoids infinite login loop for normal users who guessed the URL)
 *
 * Middleware already gates /admin/* at the edge using the JWT's role claim;
 * this function re-verifies inside server components / API routes against
 * the Session row so revocation is immediate (middleware can't DB-check).
 */
export async function requireAdmin(): Promise<CurrentUser & { role: AdminRole }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  if (!isAdminRole(user.role)) {
    redirect("/");
  }
  return user as CurrentUser & { role: AdminRole };
}

/** Stricter version: only SUPER_ADMIN. For destructive ops (delete plans, role changes). */
export async function requireSuperAdmin(): Promise<CurrentUser & { role: "SUPER_ADMIN" }> {
  const user = await requireAdmin();
  if (user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }
  return user as CurrentUser & { role: "SUPER_ADMIN" };
}
