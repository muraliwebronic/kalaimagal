import Link from "next/link";
import { BiLabel } from "@/components/ui/BiLabel";
import { Separator } from "@/components/ui/separator";
import { strings } from "@/lib/strings";

const footerSections = [
  {
    heading: { ta: "தளம்", en: "Site" },
    links: [
      { href: "/about", label: strings.footer.about },
      { href: "/contact", label: strings.footer.contact },
      { href: "/blogs", label: strings.nav.articles },
      { href: "/books", label: strings.nav.books },
    ],
  },
  {
    heading: { ta: "சட்டம்", en: "Legal" },
    links: [
      { href: "/legal/privacy", label: strings.footer.privacy },
      { href: "/legal/terms", label: strings.footer.terms },
      { href: "/legal/refunds", label: strings.footer.refunds },
    ],
  },
] as const;

export function Footer({ supportEmail }: { supportEmail?: string }) {
  const year = new Date().getFullYear();
  const rightsTa = strings.footer.rights.ta.replace("{year}", String(year));
  const rightsEn = strings.footer.rights.en.replace("{year}", String(year));

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-5">
            <div data-bi lang="ta" className="font-heading text-3xl text-primary">
              {strings.brand.name.ta}
            </div>
            <div data-bi lang="en" className="font-heading text-3xl text-primary">
              {strings.brand.name.en}
            </div>
            <p data-bi lang="ta" className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {strings.brand.tagline.ta}
            </p>
            <p data-bi lang="en" className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {strings.brand.tagline.en}
            </p>
            {supportEmail && (
              <p className="mt-6 text-xs text-muted-foreground">
                <a href={`mailto:${supportEmail}`} className="hover:text-primary">
                  {supportEmail}
                </a>
              </p>
            )}
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.heading.en} className="md:col-span-3">
              <h3 className="text-sm font-semibold tracking-wide">
                <BiLabel ta={section.heading.ta} en={section.heading.en} variant="inline" />
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <BiLabel ta={link.label.ta} en={link.label.en} variant="inline" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Follow */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide">
              <BiLabel ta={strings.footer.follow.ta} en={strings.footer.follow.en} variant="inline" />
            </h3>
            {/* Social links wire up from Settings later (Phase 3 admin UI) */}
            <p className="mt-3 text-xs text-muted-foreground">—</p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p data-bi lang="ta">{rightsTa}</p>
          <p data-bi lang="en">{rightsEn}</p>
        </div>
      </div>
    </footer>
  );
}
