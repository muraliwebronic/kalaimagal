"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { LangToggle } from "./LangToggle";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { adminNavItems } from "./AdminSidebar";

interface AdminTopBarProps {
  lang: AdminLang;
  userName: string;
  userEmail: string;
}

export function AdminTopBar({ lang, userName, userEmail }: AdminTopBarProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between md:justify-end gap-3 border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center md:hidden">
        <Sheet>
          <SheetTrigger className="p-2 -ml-2 rounded-md hover:bg-accent hover:text-accent-foreground text-foreground">
            <Menu className="size-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="px-5 py-5 border-b border-border/60 text-left">
              <SheetTitle className="font-heading text-lg leading-tight tracking-tight">
                {t(adminStrings.brand.title, lang)}
              </SheetTitle>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                Kalaimagal
              </p>
            </SheetHeader>
            <nav className="flex-1 px-2 py-3 overflow-y-auto" aria-label="Mobile Admin">
              <ul className="space-y-0.5">
                {adminNavItems.map(({ href, icon: Icon, label, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={
                          active
                            ? "flex items-center gap-2.5 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                            : "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        }
                      >
                        <Icon className="size-4" />
                        {t(label, lang)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-border/60 px-2 py-3 bg-background">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ExternalLink className="size-3.5" />
                {t(adminStrings.nav.backToSite, lang)}
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block text-right text-xs leading-tight">
          <p className="font-medium">{userName}</p>
          <p className="text-muted-foreground">{userEmail}</p>
        </div>
        <LangToggle current={lang} />
        <AdminLogoutButton label={t(adminStrings.nav.logout, lang)} />
      </div>
    </header>
  );
}
