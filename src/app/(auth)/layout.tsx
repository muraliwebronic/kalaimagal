import Link from "next/link";
import { strings } from "@/lib/strings";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { getUserLang } from "@/lib/user-lang";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const lang = await getUserLang();
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span
              data-bi
              lang="ta"
              className="font-heading text-2xl font-semibold tracking-tight text-primary"
            >
              {strings.brand.name.ta}
            </span>
            <span
              data-bi
              lang="en"
              className="font-heading text-2xl font-semibold tracking-tight text-primary"
            >
              {strings.brand.name.en}
            </span>
          </Link>
          <UserLangToggle current={lang} />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
