"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8" aria-label="Primary">
      {navItems.map((item) => {
        // match exact or subpaths (e.g. /books/something matches /books)
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "relative ta text-[15px] pb-1.5 transition-all duration-300 group",
              isActive 
                ? "text-burgundy font-semibold" 
                : "text-ink-2 hover:text-burgundy/90"
            )}
          >
            <span data-bi lang="ta">{item.ta}</span>
            <span data-bi lang="en" className="ml-1.5" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
              {item.en}
            </span>
            {/* Active underline indicator */}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-[2px] bg-burgundy transition-all duration-300",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
