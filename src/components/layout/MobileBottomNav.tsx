"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, User, Menu, X, LogIn, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import type { UserLang } from "@/lib/user-lang";
import { cn } from "@/lib/utils";

interface UserSummary {
  name: string;
  email: string;
  role: "USER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
}

interface MobileBottomNavProps {
  lang: UserLang;
  user: UserSummary | null;
}

/**
 * Sticky bottom navigation for mobile (lg:hidden).
 *
 * 5 slots: Home / Books / Articles / Account-or-Sign in / Menu (hamburger
 * that opens a drawer with everything else — More links, language toggle,
 * subscribe / admin / logout).
 *
 * Active-tab indicator: burgundy bar above the icon + burgundy color. Smooth
 * transitions on tap.
 */
export function MobileBottomNav({ lang, user }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isStaff =
    user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  // Reader page (/books/[slug]/read) has its own dark chrome — don't overlap
  if (pathname.match(/^\/books\/[^/]+\/read/)) return null;
  // Admin has its own UI
  if (pathname.startsWith("/admin")) return null;
  // Auth pages have their own clean layout
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot") ||
    pathname.startsWith("/reset") ||
    pathname.startsWith("/verify")
  ) {
    return null;
  }

  const tabs = [
    { href: "/", icon: Home, ta: "முகப்பு", en: "Home", match: (p: string) => p === "/" },
    { href: "/books", icon: BookOpen, ta: "புத்தகங்கள்", en: "Books", match: (p: string) => p.startsWith("/books") },
    { href: "/blogs", icon: FileText, ta: "கட்டுரைகள்", en: "Articles", match: (p: string) => p.startsWith("/blogs") },
    user
      ? { href: "/account", icon: User, ta: "கணக்கு", en: "Account", match: (p: string) => p.startsWith("/account") }
      : { href: "/login", icon: LogIn, ta: "உள்நுழை", en: "Sign in", match: (p: string) => p.startsWith("/login") || p.startsWith("/register") },
  ];

  return (
    <>
      <nav
        aria-label="Primary mobile"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-border-warm"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <div className="flex items-stretch h-16">
          {tabs.map(({ href, icon: Icon, ta, en, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                  active ? "text-burgundy" : "text-ink-3 hover:text-burgundy/80",
                )}
              >
                {/* Active indicator — short burgundy bar at the top */}
                <span
                  className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-burgundy transition-all duration-300",
                    active ? "w-8 opacity-100" : "w-0 opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200",
                    active && "scale-110",
                  )}
                />
                <span
                  className="text-[10px] leading-none mt-0.5"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
                >
                  <span data-bi lang="ta" className="ta">{ta}</span>
                  <span data-bi lang="en">{en}</span>
                </span>
              </Link>
            );
          })}

          {/* Menu hamburger — opens the drawer */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 text-ink-3 hover:text-burgundy/80 transition-colors"
          >
            <Menu className="size-5" />
            <span
              className="text-[10px] leading-none mt-0.5"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
            >
              <span data-bi lang="ta" className="ta">பட்டியல்</span>
              <span data-bi lang="en">More</span>
            </span>
          </button>
        </div>
      </nav>

      {/* Drawer overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

        {/* Sheet — slides up from bottom */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-paper border-t border-border-warm transition-transform duration-300 ease-out",
            drawerOpen ? "translate-y-0" : "translate-y-full",
          )}
          style={{ maxHeight: "85vh", paddingBottom: "env(safe-area-inset-bottom, 0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="trim-thin" />
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-border-warm" />
          </div>

          <div className="flex items-center justify-between px-5 pb-3">
            <div className="flex items-center">
              <Logo size={36} />
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="grid place-items-center size-9 border border-border-warm text-ink-2 hover:border-burgundy hover:text-burgundy transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-5 py-3 border-t border-border-warm">
            <div className="flex justify-between items-center mb-3.5">
              <span className="eyebrow">
                <span data-bi lang="ta">மொழி · Language</span>
                <span data-bi lang="en">Language</span>
              </span>
              <UserLangToggle current={lang} />
            </div>
          </div>

          {/* Additional links */}
          <ul className="px-5 pb-5 border-t border-border-warm flex flex-col">
            <DrawerLink href="/authors" ta="ஆசிரியர்கள்" en="Authors" onClose={() => setDrawerOpen(false)} />
            <DrawerLink href="/about" ta="எங்களைப் பற்றி" en="About" onClose={() => setDrawerOpen(false)} />
            {user && (
              <DrawerLink href="/account/subscription" ta="சந்தா" en="Subscription" onClose={() => setDrawerOpen(false)} />
            )}
            {user && (
              <DrawerLink href="/account/security" ta="பாதுகாப்பு" en="Security" onClose={() => setDrawerOpen(false)} />
            )}
            {!user && (
              <DrawerLink href="/register" ta="பதிவு செய்" en="Register" onClose={() => setDrawerOpen(false)} />
            )}
            {isStaff && (
              <DrawerLink href="/admin" ta="நிர்வாகம்" en="Admin" onClose={() => setDrawerOpen(false)} icon={<ExternalLink className="size-3.5 opacity-60" />} />
            )}
          </ul>

          {user && (
            <div className="px-5 pb-7 border-t border-border-warm pt-4">
              <p
                className="eyebrow eyebrow-sm mb-1.5"
                style={{ color: "var(--ink-3)", textTransform: "none", letterSpacing: 0 }}
              >
                {user.name}
              </p>
              <p
                className="text-xs text-ink-3 mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {user.email}
              </p>
              <LogoutInline />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DrawerLink({
  href,
  ta,
  en,
  onClose,
  icon,
}: {
  href: string;
  ta: string;
  en: string;
  onClose: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className="flex items-center justify-between gap-3 py-3 px-1 border-b border-border-warm/40 last:border-b-0 hover:text-burgundy transition-colors"
      >
        <span className="ta text-[15px]" style={{ color: "inherit" }}>
          <span data-bi lang="ta">{ta}</span>
          <span data-bi lang="en">{en}</span>
        </span>
        <span className="flex items-center gap-2 text-ink-3">
          {icon}
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M3 1 L7 5 L3 9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </Link>
    </li>
  );
}

function LogoutInline() {
  const [pending, setPending] = useState(false);
  async function go() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }
  return (
    <button
      type="button"
      onClick={go}
      disabled={pending}
      className="btn btn-ghost w-full justify-center"
      style={{ padding: "10px 14px", fontSize: 13 }}
    >
      {pending ? (
        "..."
      ) : (
        <>
          <span data-bi lang="ta">வெளியேறு</span>
          <span data-bi lang="en">Sign out</span>
        </>
      )}
    </button>
  );
}
