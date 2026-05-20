"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Ticket,
  Settings,
  ExternalLink,
} from "lucide-react";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

const items = [
  { href: "/admin", icon: LayoutDashboard, label: adminStrings.nav.dashboard, exact: true },
  { href: "/admin/content", icon: FileText, label: adminStrings.nav.content },
  { href: "/admin/subscribers", icon: Users, label: adminStrings.nav.subscribers },
  { href: "/admin/plans", icon: CreditCard, label: adminStrings.nav.plans },
  { href: "/admin/coupons", icon: Ticket, label: adminStrings.nav.coupons },
  { href: "/admin/settings", icon: Settings, label: adminStrings.nav.settings },
];

export function AdminSidebar({ lang }: { lang: AdminLang }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-secondary/30">
      <div className="px-5 py-5 border-b border-border/60">
        <Link href="/admin" className="block">
          <p className="font-heading text-lg leading-tight tracking-tight">
            {t(adminStrings.brand.title, lang)}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Kalaimagal
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3" aria-label="Admin">
        <ul className="space-y-0.5">
          {items.map(({ href, icon: Icon, label, exact }) => {
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

      <div className="border-t border-border/60 px-2 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <ExternalLink className="size-3.5" />
          {t(adminStrings.nav.backToSite, lang)}
        </Link>
      </div>
    </aside>
  );
}
