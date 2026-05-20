import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { SettingsEditor } from "./SettingsEditor";

export const metadata = { title: "Settings · Admin" };

export default async function SettingsPage() {
  const lang = await getAdminLang();
  const rows = await prisma.setting.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl">
      <div className="mb-2">
        <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
          {t(adminStrings.settings.listTitle, lang)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-prose">
          {t(adminStrings.settings.help, lang)}
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <SettingsEditor
            lang={lang}
            initial={rows.map((r) => ({
              key: r.key,
              description: r.description,
              value: r.value,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
