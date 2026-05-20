import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "./LogoutButton";

export const metadata = { title: "சுயவிவரம் — Profile" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const user = await getCurrentUser();
  // Layout already guards, but TS narrowing
  if (!user) return null;

  const { welcome } = await searchParams;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE", expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "desc" },
    include: { plan: true },
  });

  return (
    <div className="space-y-6">
      {welcome && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <p lang="ta" className="font-heading text-lg">
              வரவேற்கிறோம், {user.name}.
            </p>
            <p lang="en" className="text-sm italic text-muted-foreground">
              Welcome to Kalaimagal. Check your inbox for a verification link.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <h2 className="font-heading text-xl tracking-tight">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{user.role}</Badge>
            {user.emailVerifiedAt ? (
              <Badge variant="secondary">
                <span lang="ta">உறுதிசெய்யப்பட்டது</span>
                <span className="ml-1.5 text-xs text-muted-foreground">/ Verified</span>
              </Badge>
            ) : (
              <Badge variant="default">
                <span lang="ta">உறுதி நிலுவையில்</span>
                <span className="ml-1.5 text-xs">/ Verify pending</span>
              </Badge>
            )}
            {subscription ? (
              <Badge>
                <span lang="ta">சந்தாதாரர்</span>
                <span className="ml-1.5 text-xs">/ Subscribed</span>
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span lang="ta">சந்தா நிலை</span>
            <span className="ml-1.5 text-sm text-muted-foreground">/ Subscription</span>
          </h3>
          {subscription ? (
            <div className="text-sm">
              <p>
                <span lang="ta">{subscription.plan.nameTamil}</span>
                <span className="ml-2 text-muted-foreground">/ {subscription.plan.nameEnglish}</span>
              </p>
              <p className="text-muted-foreground mt-1">
                செயல்படும் நாள் வரை: {subscription.expiresAt.toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p lang="ta">இப்போது சந்தா எதுவும் இல்லை.</p>
              <p lang="en" className="italic">No active subscription.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
