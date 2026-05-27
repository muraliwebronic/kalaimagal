import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const linkGroups = [
  {
    headingTa: "தளம்",
    headingEn: "Site",
    items: [
      { href: "/books", ta: "புத்தகங்கள்", en: "Books" },
      { href: "/blogs", ta: "கட்டுரைகள்", en: "Articles" },
      { href: "/authors", ta: "ஆசிரியர்கள்", en: "Authors" },
      { href: "/account/subscription", ta: "சந்தா திட்டம்", en: "Subscribe" },
    ],
  },
  {
    headingTa: "சட்டம்",
    headingEn: "Legal",
    items: [
      { href: "/legal/terms", ta: "பயன்பாட்டு நிபந்தனைகள்", en: "Terms" },
      { href: "/legal/privacy", ta: "தனியுரிமை", en: "Privacy" },
      { href: "/legal/refunds", ta: "திருப்பிச் செலுத்தல்", en: "Refunds" },
      { href: "/contact", ta: "தொடர்பு", en: "Contact" },
    ],
  },
  {
    headingTa: "பின்தொடர்",
    headingEn: "Follow",
    items: [
      { href: "#", ta: "Instagram", en: "Instagram" },
      { href: "#", ta: "X / Twitter", en: "X / Twitter" },
      { href: "#", ta: "YouTube", en: "YouTube" },
      { href: "#", ta: "RSS", en: "RSS" },
    ],
  },
];

export function Footer({ supportEmail }: { supportEmail?: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-ink text-sandalwood">
      {/* Tricolor gradient bar mirroring the logo: peacock → yellow → gold → burgundy */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(to right, var(--logo-yellow), var(--gold), var(--burgundy))",
        }}
      />

      <div className="container mx-auto px-6 md:px-10 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand block — 5/12 */}
          <div className="md:col-span-5">
            <div className="mb-5 inline-block ">
              <Logo size={44} />
            </div>
            <p lang="ta" className="ta text-sm leading-relaxed text-sandalwood/80 max-w-sm">
              தமிழ் இலக்கியத்தின் வாசிப்பு வீடு — செவ்விலக்கியம் முதல் சமகால எழுத்து வரை.
            </p>
            <p
              lang="en"
              className="text-sm text-sandalwood-2/70 mt-2 max-w-sm"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              A reading home for Tamil literature — from the classical to the contemporary.
            </p>
            {supportEmail && (
              <p
                className="mt-6 text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "rgba(244, 233, 203, 0.5)" }}
              >
                <a href={`mailto:${supportEmail}`} className="hover:text-logo-yellow transition-colors">
                  {supportEmail}
                </a>
              </p>
            )}
          </div>

          {/* Link groups — 3 × 7/12 */}
          {linkGroups.map((group) => (
            <div key={group.headingEn} className="md:col-span-2">
              <p className="eyebrow mb-4" style={{ color: "var(--gold-pale)" }}>
                <span data-bi lang="ta">{group.headingTa}</span>
                <span data-bi lang="en">{group.headingEn}</span>
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item, idx) => (
                  <li key={`${group.headingEn}-${idx}`} className="text-sm">
                    <Link
                      href={item.href}
                      className="text-sandalwood/70 hover:text-logo-yellow transition-colors duration-200"
                    >
                      <span data-bi lang="ta" className="ta">{item.ta}</span>
                      <span data-bi lang="en" style={{ fontFamily: "var(--font-display)" }}>
                        {item.en}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Spacer to fill 12-col grid */}
          <div className="md:col-span-1" />
        </div>
      </div>

      <div
        className="border-t px-6 md:px-10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        style={{ borderColor: "rgba(244, 233, 203, 0.1)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(244, 233, 203, 0.45)",
            letterSpacing: "0.04em",
          }}
        >
          © {year} KALAIMAGAL · <span lang="ta">சர்வ உரிமைகள் பாதுகாக்கப்பட்டவை</span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 12,
            color: "rgba(244, 233, 203, 0.45)",
          }}
        >
          Made with care in Chennai · <span lang="ta">சென்னை</span>
        </span>
      </div>
    </footer>
  );
}
