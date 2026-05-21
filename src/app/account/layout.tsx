import { redirect } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";
import { getSetting } from "@/lib/settings";

const tabs = [
  { href: "/account", icon: User, ta: "சுயவிவரம்", en: "Profile" },
  { href: "/account/subscription", icon: CreditCard, ta: "சந்தா", en: "Subscription" },
  { href: "/account/security", icon: Shield, ta: "பாதுகாப்பு", en: "Security" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  const supportEmail = (await getSetting<string>("site.support_email")) ?? undefined;

  return (
    <>
      <Header />
      <main className="flex-1 paper-warm">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-10 md:py-14">
          {/* Page header */}
          <div className="mb-8 md:mb-10">
            <div className="eyebrow mb-2.5">
              <span data-bi lang="ta">என் கணக்கு · My Account</span>
              <span data-bi lang="en">My Account</span>
            </div>
            <h1 className="ta-display text-burgundy" style={{ fontSize: "clamp(36px, 5vw, 48px)" }}>
              <span data-bi lang="ta">{user.name}</span>
              <span data-bi lang="en">{user.name}</span>
            </h1>
            <p
              className="text-ink-3 mt-1"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15 }}
            >
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12">
            {/* Sidebar nav */}
            <aside>
              <nav aria-label="Account" className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {tabs.map(({ href, icon: Icon, ta, en }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] text-ink-2 hover:text-burgundy hover:bg-sandalwood/50 transition-colors border-l-2 border-transparent hover:border-burgundy whitespace-nowrap"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span data-bi lang="ta" className="ta">{ta}</span>
                    <span data-bi lang="en">{en}</span>
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}
