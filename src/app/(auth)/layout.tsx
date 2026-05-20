import Link from "next/link";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { Gopuram, Thoranam } from "@/components/brand/Decor";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { getUserLang } from "@/lib/user-lang";

/**
 * Auth-pages shell — paper-warm background with a faded gopuram silhouette
 * behind the centered card. Each child page is rendered with a thoranam
 * festoon above it.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const lang = await getUserLang();
  return (
    <div className="paper-warm min-h-screen flex flex-col">
      <header className="px-6 md:px-14 py-4 border-b border-border-warm flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Kalaimagal">
          <Logo size={36} />
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-3.5">
          <UserLangToggle current={lang} />
          <Link
            href="/"
            className="text-sm text-ink-2 hover:text-burgundy"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            <span data-bi lang="ta">← தளத்திற்குத் திரும்பு</span>
            <span data-bi lang="en">← Back to site</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-4 md:px-6 py-10 md:py-14 relative overflow-hidden">
        <div
          className="absolute left-1/2 bottom-0 pointer-events-none"
          style={{ transform: "translateX(-50%)", opacity: 0.5 }}
        >
          <Gopuram width={1100} height={220} opacity={0.08} />
        </div>

        <div className="relative w-full max-w-md">
          <div className="flex justify-center mb-4">
            <Thoranam width={280} height={22} />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
