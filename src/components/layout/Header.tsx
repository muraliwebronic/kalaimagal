import Link from "next/link";
import { Search } from "lucide-react";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { getUserLang } from "@/lib/user-lang";
import { getCurrentUser } from "@/lib/auth";

interface NavItem {
  id: string;
  href: string;
  ta: string;
  en: string;
}

const navItems: NavItem[] = [
  { id: "books", href: "/books", ta: "புத்தகங்கள்", en: "Books" },
  { id: "articles", href: "/blogs", ta: "கட்டுரைகள்", en: "Articles" },
  { id: "authors", href: "/authors", ta: "ஆசிரியர்கள்", en: "Authors" },
  { id: "about", href: "/about", ta: "எங்களைப் பற்றி", en: "About" },
];

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
      className="relative border-b border-border-warm hidden lg:block"
      style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(8px)" }}
    >
      <div className="trim-thin" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-10 py-3.5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 md:gap-3.5 shrink-0" aria-label="Kalaimagal">
          <Logo size={38} />
          <span className="hidden sm:flex items-center h-9 border-l border-border-warm pl-3.5">
            <Wordmark size="md" />
          </span>
        </Link>

        {/* Desktop nav (lg and up) */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="ta text-[15px] text-ink-2 hover:text-burgundy pb-1 border-b border-transparent hover:border-burgundy transition-colors"
            >
              <span data-bi lang="ta">{item.ta}</span>
              <span data-bi lang="en" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                {item.en}
              </span>
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Search"
            className="grid place-items-center size-9 border border-border-warm text-ink-2 hover:border-burgundy hover:text-burgundy transition-colors"
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
                className="btn btn-ghost hidden md:inline-flex"
                style={{ padding: "8px 16px", fontSize: 13 }}
              >
                <span data-bi lang="ta">உள்நுழை</span>
                <span data-bi lang="en">Sign in</span>
              </Link>
              <Link
                href="/register"
                className="btn btn-primary hidden md:inline-flex"
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
