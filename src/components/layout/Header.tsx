import Link from "next/link";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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

export async function Header() {
  const [lang, user] = await Promise.all([getUserLang(), getCurrentUser()]);
  const isStaff =
    user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <header
      className="relative border-b border-border-warm"
      style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(8px)" }}
    >
      {/* Thin gold-dotted trim at the very top */}
      <div className="trim-thin" />

      <div className="container mx-auto flex items-center justify-between gap-4 px-6 md:px-10 py-3.5">
        {/* Brand block: seal + rule + wordmark */}
        <Link href="/" className="flex items-center gap-3.5" aria-label="Kalaimagal">
          <Logo size={42} />
          <span className="hidden md:flex items-center h-9 border-l border-border-warm pl-3.5">
            <Wordmark size="md" />
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Actions */}
        <div className="flex items-center gap-3">
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
              <Link href="/login" className="btn btn-ghost hidden md:inline-flex" style={{ padding: "8px 16px", fontSize: 13 }}>
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

          {/* Mobile drawer */}
          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid place-items-center size-9 border border-border-warm text-ink-2 lg:hidden"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm bg-paper">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Logo size={36} />
                  <Wordmark size="sm" />
                </SheetTitle>
                <SheetDescription>
                  <span data-bi lang="ta" className="ta text-sm">
                    தமிழ் இலக்கியத்தின் வாசிப்பு வீடு
                  </span>
                  <span
                    data-bi
                    lang="en"
                    className="text-sm"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                  >
                    A reading home for Tamil literature
                  </span>
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Mobile">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block ta py-3 px-3 text-base hover:bg-sandalwood hover:text-burgundy"
                  >
                    <span data-bi lang="ta">{item.ta}</span>
                    <span data-bi lang="en">{item.en}</span>
                  </Link>
                ))}
                <div className="mt-4 border-t border-border-warm pt-4 flex flex-col gap-2 px-3">
                  <div className="flex justify-between items-center pb-2">
                    <span className="eyebrow">Language</span>
                    <UserLangToggle current={lang} />
                  </div>
                  {user ? (
                    <>
                      <Link href="/account" className="btn btn-ghost justify-start" style={{ padding: "10px 14px", fontSize: 13 }}>
                        <span data-bi lang="ta">என் கணக்கு</span>
                        <span data-bi lang="en">My Account</span>
                      </Link>
                      {isStaff && (
                        <Link href="/admin" className="btn btn-ghost justify-start" style={{ padding: "10px 14px", fontSize: 13 }}>
                          Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="btn btn-ghost justify-start" style={{ padding: "10px 14px", fontSize: 13 }}>
                        <span data-bi lang="ta">உள்நுழை</span>
                        <span data-bi lang="en">Sign in</span>
                      </Link>
                      <Link href="/register" className="btn btn-primary justify-start" style={{ padding: "10px 14px", fontSize: 13 }}>
                        <span data-bi lang="ta">சந்தா</span>
                        <span data-bi lang="en">Subscribe</span>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
