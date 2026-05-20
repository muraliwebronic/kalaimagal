import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";

export const metadata = { title: "Coupons · Admin" };

export default async function CouponsPage() {
  const lang = await getAdminLang();
  const coupons = await prisma.coupon.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
          {t(adminStrings.coupons.listTitle, lang)}
        </h1>
        <Link href="/admin/coupons/new" className={cn(buttonVariants({ size: "sm" }))}>
          <Plus className="size-4" />
          {t(adminStrings.common.new, lang)}
        </Link>
      </div>

      {coupons.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No coupons yet.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t(adminStrings.coupons.fields.code, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.coupons.fields.type, lang)}</th>
                <th className="px-4 py-3 font-medium text-right">{t(adminStrings.coupons.fields.value, lang)}</th>
                <th className="px-4 py-3 font-medium text-right">{t(adminStrings.coupons.fields.usedCount, lang)}/{t(adminStrings.coupons.fields.maxUses, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.coupons.fields.validUntil, lang)}</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono">{c.code}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {c.type === "PERCENTAGE" ? `${c.value.toString()}%` : `₹${c.value.toString()}`}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {c.usedCount}/{c.maxUses ?? "∞"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                    {c.validUntil?.toLocaleDateString() ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.isActive ? "default" : "secondary"} className="font-normal">
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/coupons/${c.id}/edit`}
                      className="text-xs text-primary hover:underline"
                    >
                      {t(adminStrings.common.edit, lang)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
