import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { SubscriberActions } from "./SubscriberActions";

export const metadata = { title: "Subscriber · Admin" };

export default async function SubscriberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isFinite(userId)) notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 5 },
      payments: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 10 },
      sessions: {
        where: { revokedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { lastUsedAt: "desc" },
      },
    },
  });
  if (!user) notFound();

  const lang = await getAdminLang();
  const activeSub = user.subscriptions.find(
    (s) => s.status === "ACTIVE" && s.expiresAt > new Date(),
  );

  return (
    <div className="px-6 md:px-10 py-8 max-w-5xl">
      <Link
        href="/admin/subscribers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        {t(adminStrings.common.back, lang)}
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          {user.phone && (
            <p className="text-xs text-muted-foreground">{user.phone}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="font-normal">{user.role}</Badge>
            {user.emailVerifiedAt && (
              <Badge variant="secondary" className="font-normal">Verified</Badge>
            )}
            {user.isBanned && (
              <Badge variant="destructive" className="font-normal">Banned</Badge>
            )}
            {activeSub && (
              <Badge className="font-normal">Subscribed · {activeSub.plan.nameEnglish}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-5 space-y-3 text-sm">
            <h3 className="font-medium tracking-tight">Actions</h3>
            <SubscriberActions
              userId={user.id}
              isBanned={user.isBanned}
              lang={lang}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-medium tracking-tight">Subscriptions</h3>
            {user.subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t(adminStrings.subscribers.noSubscription, lang)}
              </p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {user.subscriptions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-medium">{s.plan.nameEnglish}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {s.startedAt.toLocaleDateString()} → {s.expiresAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={s.status === "ACTIVE" ? "default" : "secondary"}
                      className="font-normal"
                    >
                      {s.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-medium tracking-tight">Payments</h3>
            {user.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-1.5">Order</th>
                    <th className="py-1.5">Plan</th>
                    <th className="py-1.5">Status</th>
                    <th className="py-1.5 text-right">Amount</th>
                    <th className="py-1.5 text-right">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {user.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 text-xs font-mono">{p.razorpayPaymentId ?? p.razorpayOrderId ?? "—"}</td>
                      <td className="py-2">{p.plan?.nameEnglish ?? "—"}</td>
                      <td className="py-2">
                        <Badge
                          variant={p.status === "PAID" ? "default" : "secondary"}
                          className="font-normal"
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-right tabular-nums">₹{p.netAmount.toString()}</td>
                      <td className="py-2 text-right text-xs text-muted-foreground tabular-nums">
                        {p.createdAt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-medium tracking-tight">
              Active sessions ({user.sessions.length})
            </h3>
            <ul className="divide-y divide-border/60 text-sm">
              {user.sessions.map((s) => (
                <li key={s.id} className="flex justify-between py-2">
                  <div>
                    <p>{s.deviceInfo ?? "Unknown device"}</p>
                    <p className="text-xs text-muted-foreground">{s.ipAddress ?? "—"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {s.lastUsedAt.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
