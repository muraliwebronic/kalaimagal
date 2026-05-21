import Link from "next/link";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { getUserLang } from "@/lib/user-lang";

/**
 * Slim mobile-only top bar — brand mark + language toggle.
 *
 * Mobile navigation lives in MobileBottomNav; this bar just preserves
 * brand identity at the top of the page and keeps the lang toggle quickly
 * reachable without opening the drawer.
 *
 * Hidden on lg+ (the full Header renders there).
 */
export async function MobileTopBar() {
  const lang = await getUserLang();
  return (
    <div className="lg:hidden border-b border-border-warm" style={{ background: "rgba(250,247,242,0.95)", backdropFilter: "blur(6px)" }}>
      <div className="trim-thin" />
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Kalaimagal">
          <Logo size={32} />
          <Wordmark size="sm" />
        </Link>
        <UserLangToggle current={lang} variant="compact" />
      </div>
    </div>
  );
}
