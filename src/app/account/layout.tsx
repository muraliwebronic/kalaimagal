import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BiLabel } from "@/components/ui/BiLabel";
import { strings } from "@/lib/strings";
import { getSetting } from "@/lib/settings";

const tabs = [
  { href: "/account", label: { ta: "சுயவிவரம்", en: "Profile" } },
  { href: "/account/subscription", label: { ta: "சந்தா", en: "Subscription" } },
  { href: "/account/security", label: { ta: "பாதுகாப்பு", en: "Security" } },
] as const;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/account");
  }
  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
              <BiLabel ta={strings.nav.account.ta} en={strings.nav.account.en} variant="stacked" />
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <aside className="md:col-span-3">
              <nav aria-label="Account sections" className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1">
                {tabs.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                  >
                    <BiLabel ta={t.label.ta} en={t.label.en} variant="inline" />
                  </Link>
                ))}
              </nav>
            </aside>
            <div className="md:col-span-9">{children}</div>
          </div>
        </div>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
