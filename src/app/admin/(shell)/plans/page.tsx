import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";

export const metadata = { title: "Plans · Admin" };

export default async function PlansPage() {
  const lang = await getAdminLang();
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }],
    include: { _count: { select: { subscriptions: true } } },
  });

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
          {t(adminStrings.plans.listTitle, lang)}
        </h1>
        <Link href="/admin/plans/new" className={cn(buttonVariants({ size: "sm" }))}>
          <Plus className="size-4" />
          {t(adminStrings.common.new, lang)}
        </Link>
      </div>

      {plans.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No plans yet.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium text-right">Price</th>
                <th className="px-4 py-3 font-medium text-right">Days</th>
                <th className="px-4 py-3 font-medium text-right">Subscribers</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{p.slug}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.nameEnglish}</p>
                    <p className="text-xs text-muted-foreground" lang="ta">{p.nameTamil}</p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">₹{p.priceInr.toString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.durationDays}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p._count.subscriptions}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isActive ? "default" : "secondary"} className="font-normal">
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {p.isFeatured && (
                      <Badge variant="secondary" className="ml-1.5 font-normal">Featured</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/plans/${p.id}/edit`}
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
