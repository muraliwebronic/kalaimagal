import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "../LogoutButton";

export const metadata = { title: "பாதுகாப்பு — Security" };

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const sessions = await prisma.session.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastUsedAt: "desc" },
    select: {
      id: true,
      deviceInfo: true,
      ipAddress: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span lang="ta">செயலில் உள்ள சாதனங்கள்</span>
            <span className="ml-1.5 text-sm text-muted-foreground">/ Active sessions</span>
          </h3>
          <ul className="divide-y divide-border">
            {sessions.map((s) => {
              const isCurrent = s.id === user.sessionId;
              return (
                <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm truncate">
                      {s.deviceInfo ?? "Unknown device"}
                      {isCurrent && (
                        <Badge variant="secondary" className="ml-2 font-normal">
                          இப்போதைய / Current
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.ipAddress ?? "—"} · last active {s.lastUsedAt.toLocaleString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="pt-3">
            <LogoutButton all />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span lang="ta">கடவுச்சொல்லை மாற்று</span>
            <span className="ml-1.5 text-sm text-muted-foreground">/ Change password</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            <span lang="ta">கடவுச்சொல்லை மாற்ற, மீட்பு இணைப்பை மின்னஞ்சலில் பெறுங்கள்.</span>{" "}
            <span lang="en" className="italic">
              Send yourself a reset link from{" "}
            </span>
            <a href="/forgot-password" className="text-primary hover:underline">
              /forgot-password
            </a>
            <span lang="en" className="italic">.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
