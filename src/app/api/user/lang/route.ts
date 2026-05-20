import { NextResponse } from "next/server";
import { z } from "zod";
import { USER_LANG_COOKIE } from "@/lib/user-lang";

const Schema = z.object({ lang: z.enum(["ta", "en"]) });

// 1 year — user preference
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** POST { lang: "ta" | "en" } — switch the public-site language. */
export async function POST(req: Request) {
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
  res.cookies.set(USER_LANG_COOKIE, parsed.data.lang, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
