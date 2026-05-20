import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";

export const metadata = { title: "Subscribers · Admin" };

export default async function SubscribersListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; role?: string; page?: string }>;
}) {
  const lang = await getAdminLang();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = 50;

  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(sp.q
      ? {
          OR: [
            { email: { contains: sp.q } },
            { name: { contains: sp.q } },
            { phone: { contains: sp.q } },
          ],
        }
      : {}),
    ...(sp.role === "USER" || sp.role === "EDITOR" || sp.role === "ADMIN" || sp.role === "SUPER_ADMIN"
      ? { role: sp.role }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        subscriptions: {
          where: { status: "ACTIVE", expiresAt: { gt: new Date() } },
          include: { plan: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
            {t(adminStrings.subscribers.listTitle, lang)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">{total} total</p>
        </div>
        <form className="flex items-center gap-2 text-sm" method="GET">
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search name / email / phone…"
            className="flex h-9 w-64 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted-foreground">No users found.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t(adminStrings.subscribers.cols.user, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.subscribers.cols.role, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.subscribers.cols.subStatus, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.subscribers.cols.expiresAt, lang)}</th>
                <th className="px-4 py-3 font-medium text-right">{t(adminStrings.subscribers.cols.joined, lang)}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const sub = u.subscriptions[0];
                return (
                  <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/subscribers/${u.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {u.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-normal">{u.role}</Badge>
                      {u.isBanned && (
                        <Badge variant="destructive" className="ml-1.5 font-normal">Banned</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {sub ? (
                        <Badge className="font-normal">{sub.plan.nameEnglish}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {t(adminStrings.subscribers.noSubscription, lang)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                      {sub?.expiresAt.toLocaleDateString() ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs tabular-nums text-muted-foreground">
                      {u.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/subscribers/${u.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {t(adminStrings.common.edit, lang)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
