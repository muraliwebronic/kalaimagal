import "server-only";
import { cookies } from "next/headers";

/**
 * Public-site language preference (independent of admin lang).
 *
 * The site is Tamil-primary, so default is `ta`. Users who prefer English
 * can flip via the UserLangToggle in the Header. Rendering relies on CSS
 * — every chrome label is wrapped in `<span lang="ta">` / `<span lang="en">`
 * (via the BiLabel component) and the root layout puts a `data-lang`
 * attribute on `<html>`; globals.css hides the inactive language.
 */

export type UserLang = "ta" | "en";

export const USER_LANG_COOKIE = "kalaimagal_lang";
export const DEFAULT_USER_LANG: UserLang = "ta";

export async function getUserLang(): Promise<UserLang> {
  const c = await cookies();
  const v = c.get(USER_LANG_COOKIE)?.value;
  return v === "ta" || v === "en" ? v : DEFAULT_USER_LANG;
}
