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
            <p data-bi lang="ta" className="font-heading text-lg">
              வரவேற்கிறோம், {user.name}.
            </p>
            <p data-bi lang="en" className="font-heading text-lg">
              Welcome, {user.name}.
            </p>
            <p data-bi lang="ta" className="text-sm text-muted-foreground">
              உங்கள் மின்னஞ்சலை உறுதிப்படுத்த இணைப்பு அனுப்பப்பட்டது.
            </p>
            <p data-bi lang="en" className="text-sm text-muted-foreground">
              Check your inbox for a verification link.
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
                <span data-bi lang="ta">உறுதிசெய்யப்பட்டது</span>
                <span data-bi lang="en">Verified</span>
              </Badge>
            ) : (
              <Badge variant="default">
                <span data-bi lang="ta">உறுதி நிலுவையில்</span>
                <span data-bi lang="en">Verify pending</span>
              </Badge>
            )}
            {subscription ? (
              <Badge>
                <span data-bi lang="ta">சந்தாதாரர்</span>
                <span data-bi lang="en">Subscribed</span>
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <h3 className="font-heading text-lg tracking-tight">
            <span data-bi lang="ta">சந்தா நிலை</span>
            <span data-bi lang="en">Subscription</span>
          </h3>
          {subscription ? (
            <div className="text-sm">
              <p>
                <span data-bi lang="ta">{subscription.plan.nameTamil}</span>
                <span data-bi lang="en">{subscription.plan.nameEnglish}</span>
              </p>
              <p className="text-muted-foreground mt-1">
                <span data-bi lang="ta">செயல்படும் நாள் வரை: {subscription.expiresAt.toLocaleDateString()}</span>
                <span data-bi lang="en">Active until: {subscription.expiresAt.toLocaleDateString()}</span>
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p data-bi lang="ta">இப்போது சந்தா எதுவும் இல்லை.</p>
              <p data-bi lang="en">No active subscription.</p>
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
