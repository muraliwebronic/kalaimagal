import Link from "next/link";
import { strings } from "@/lib/strings";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border/60">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span
              lang="ta"
              className="font-heading text-2xl font-semibold tracking-tight text-primary"
            >
              {strings.brand.name.ta}
            </span>
            <span className="text-sm text-muted-foreground">{strings.brand.name.en}</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
