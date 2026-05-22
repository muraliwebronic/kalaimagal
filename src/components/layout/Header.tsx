import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { getUserLang } from "@/lib/user-lang";
import { getCurrentUser } from "@/lib/auth";

/**
 * Public-site header. On mobile, the bottom MobileBottomNav handles
 * navigation entirely — the top header simplifies to brand + language +
 * sign-in actions only (no top-right hamburger).
 */
export async function Header() {
  const [lang, user] = await Promise.all([getUserLang(), getCurrentUser()]);

  // Hidden on mobile — MobileBottomNav owns mobile nav. lg+ shows the full bar.
  return (
    <header
      className="sticky top-0 z-50 border-b border-border-warm/65 hidden lg:block backdrop-blur-md shadow-sm transition-all duration-300"
      style={{ background: "rgba(250, 247, 242, 0.88)" }}
    >
      <div className="trim-thin" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-10 py-3.5">
        {/* Brand */}
        <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity" aria-label="Kalaimagal">
          <Logo size={44} priority />
        </Link>

        {/* Desktop nav (lg and up) */}
        <div className="hidden lg:block">
          <HeaderNav />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Search"
            className="grid place-items-center size-9 border border-border-warm text-ink-2 hover:border-burgundy hover:text-burgundy hover:bg-burgundy/5 rounded-sm transition-all duration-200"
          >
            <Search className="size-3.5" />
          </button>

          <UserLangToggle current={lang} />

          {user ? (
            <UserMenu user={{ name: user.name, email: user.email, role: user.role }} />
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-ghost hidden md:inline-flex rounded-sm"
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                <span data-bi lang="ta">உள்நுழை</span>
                <span data-bi lang="en">Sign in</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-primary hidden md:inline-flex rounded-sm"
                style={{ padding: "8px 18px", fontSize: 13 }}
              >
                <span data-bi lang="ta">சந்தா</span>
                <span data-bi lang="en">Subscribe</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
