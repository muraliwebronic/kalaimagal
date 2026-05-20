import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BiLabel } from "@/components/ui/BiLabel";
import { UserLangToggle } from "@/components/layout/UserLangToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { strings } from "@/lib/strings";
import { getUserLang } from "@/lib/user-lang";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/books", label: strings.nav.books },
  { href: "/blogs", label: strings.nav.articles },
  { href: "/authors", label: strings.nav.authors },
  { href: "/about", label: strings.nav.about },
] as const;

export async function Header() {
  const [lang, user] = await Promise.all([getUserLang(), getCurrentUser()]);
  const isAdmin =
    user?.role === "EDITOR" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Kalaimagal — Home">
          <span
            data-bi
            lang="ta"
            className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-primary"
          >
            {strings.brand.name.ta}
          </span>
          <span
            data-bi
            lang="en"
            className="font-heading text-xl md:text-2xl font-semibold tracking-tight text-primary"
          >
            {strings.brand.name.en}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group relative text-sm transition-colors hover:text-primary"
            >
              <BiLabel ta={label.ta} en={label.en} variant="inline" />
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"
              />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <UserLangToggle current={lang} />

          <Button variant="ghost" size="icon" aria-label={strings.nav.search.en}>
            <Search className="size-4" />
          </Button>

          {user ? (
            <UserMenu user={{ name: user.name, email: user.email, role: user.role }} />
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "hidden md:inline-flex",
                )}
              >
                <User className="size-4" />
                <BiLabel ta={strings.nav.login.ta} en={strings.nav.login.en} variant="inline" />
              </Link>

              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
              >
                <span data-bi lang="ta">{strings.nav.register.ta}</span>
                <span data-bi lang="en">{strings.nav.register.en}</span>
              </Link>
            </>
          )}

          {/* Mobile drawer */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <span data-bi lang="ta" className="font-heading text-2xl text-primary">
                    {strings.brand.name.ta}
                  </span>
                  <span data-bi lang="en" className="font-heading text-2xl text-primary">
                    {strings.brand.name.en}
                  </span>
                </SheetTitle>
                <SheetDescription>
                  <span data-bi lang="ta">{strings.brand.tagline.ta}</span>
                  <span data-bi lang="en">{strings.brand.tagline.en}</span>
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4" aria-label="Mobile">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-md px-3 py-3 text-base hover:bg-accent hover:text-accent-foreground"
                  >
                    <BiLabel ta={label.ta} en={label.en} variant="stacked" />
                  </Link>
                ))}
                <div className="mt-4 border-t border-border pt-4 flex flex-col gap-2 px-3">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Language
                    </span>
                    <UserLangToggle current={lang} />
                  </div>

                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                      >
                        <User className="size-4" />
                        <BiLabel
                          ta={strings.nav.account.ta}
                          en={strings.nav.account.en}
                          variant="inline"
                        />
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={cn(buttonVariants({ variant: "outline" }), "justify-start")}
                      >
                        <User className="size-4" />
                        <BiLabel ta={strings.nav.login.ta} en={strings.nav.login.en} variant="inline" />
                      </Link>
                      <Link
                        href="/register"
                        className={cn(buttonVariants(), "justify-start")}
                      >
                        <BiLabel ta={strings.nav.register.ta} en={strings.nav.register.en} variant="inline" />
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
