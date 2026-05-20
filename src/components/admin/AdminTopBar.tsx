import { LangToggle } from "./LangToggle";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { adminStrings, t } from "@/lib/admin/strings";
import type { AdminLang } from "@/lib/admin/lang";

interface AdminTopBarProps {
  lang: AdminLang;
  userName: string;
  userEmail: string;
}

export function AdminTopBar({ lang, userName, userEmail }: AdminTopBarProps) {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b border-border bg-background px-4 md:px-6">
      <div className="text-right text-xs leading-tight">
        <p className="font-medium">{userName}</p>
        <p className="text-muted-foreground">{userEmail}</p>
      </div>
      <LangToggle current={lang} />
      <AdminLogoutButton label={t(adminStrings.nav.logout, lang)} />
    </header>
  );
}
