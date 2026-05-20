import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";

export default async function AdminDashboardPage() {
  const lang = await getAdminLang();

  // KPI date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    revenueMtd,
    activeSubsCount,
    totalUsers,
    pdfsPublished,
    blogsPublished,
    pendingPayments,
    recentSignups,
    recentPayments,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
      _sum: { netAmount: true },
    }),
    prisma.subscription.count({
      where: { status: "ACTIVE", expiresAt: { gt: now } },
    }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.content.count({
      where: { type: "PDF", status: "PUBLISHED", deletedAt: null },
    }),
    prisma.content.count({
      where: { type: "BLOG", status: "PUBLISHED", deletedAt: null },
    }),
    prisma.payment.count({
      where: { status: { in: ["CREATED", "ATTEMPTED"] } },
    }),
    prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    }),
    prisma.payment.findMany({
      where: { status: { in: ["PAID", "FAILED", "REFUNDED"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const revenue = revenueMtd._sum.netAmount?.toString() ?? "0";

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
          {t(adminStrings.dashboard.title, lang)}
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        <KpiCard label={t(adminStrings.dashboard.revenueMtd, lang)} value={`₹${revenue}`} />
        <KpiCard label={t(adminStrings.dashboard.activeSubs, lang)} value={activeSubsCount.toString()} />
        <KpiCard label={t(adminStrings.dashboard.totalUsers, lang)} value={totalUsers.toString()} />
        <KpiCard label={t(adminStrings.dashboard.pdfsPublished, lang)} value={pdfsPublished.toString()} />
        <KpiCard label={t(adminStrings.dashboard.blogsPublished, lang)} value={blogsPublished.toString()} />
        <KpiCard label={t(adminStrings.dashboard.pendingPayments, lang)} value={pendingPayments.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading text-lg tracking-tight mb-4">
              {t(adminStrings.dashboard.recentSignups, lang)}
            </h2>
            {recentSignups.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              <ul className="divide-y divide-border/60 text-sm">
                {recentSignups.map((u) => (
                  <li key={u.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <Link href={`/admin/subscribers/${u.id}`} className="font-medium hover:text-primary">
                        {u.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="font-normal">{u.role}</Badge>
                      <span className="tabular-nums">{u.createdAt.toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading text-lg tracking-tight mb-4">
              {t(adminStrings.dashboard.recentPayments, lang)}
            </h2>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground">—</p>
            ) : (
              <ul className="divide-y divide-border/60 text-sm">
                {recentPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={p.status === "PAID" ? "default" : "secondary"}
                        className="font-normal text-xs"
                      >
                        {p.status}
                      </Badge>
                      <span className="text-sm font-medium tabular-nums">₹{p.netAmount.toString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-heading text-2xl tabular-nums tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
