import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_LANG_COOKIE } from "@/lib/admin/lang";
import { requireAdmin } from "@/lib/admin/auth";

const Schema = z.object({ lang: z.enum(["en", "ta"]) });

// 1 year — user preference, no real need to expire it
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** POST { lang: "en" | "ta" } — switch the admin UI language. */
export async function POST(req: Request) {
  await requireAdmin();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, lang: parsed.data.lang });
  res.cookies.set(ADMIN_LANG_COOKIE, parsed.data.lang, {
    httpOnly: false, // readable from client if needed; not a security token
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
