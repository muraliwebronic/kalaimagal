import "server-only";
import { cookies } from "next/headers";

/**
 * Admin UI language is independent of the public-site language. The
 * public site is Tamil-primary; the admin defaults to English (per user
 * decision 2026-05-20). Admins can toggle via the LangToggle component
 * in the admin top bar — that sets the `kalaimagal_admin_lang` cookie
 * and triggers a router.refresh().
 */

export type AdminLang = "en" | "ta";

export const ADMIN_LANG_COOKIE = "kalaimagal_admin_lang";
export const DEFAULT_ADMIN_LANG: AdminLang = "en";

export async function getAdminLang(): Promise<AdminLang> {
  const c = await cookies();
  const v = c.get(ADMIN_LANG_COOKIE)?.value;
  return v === "ta" || v === "en" ? v : DEFAULT_ADMIN_LANG;
}
