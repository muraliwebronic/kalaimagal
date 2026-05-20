import Link from "next/link";
import { Logo, Wordmark } from "@/components/brand/Logo";

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
      {/* gradient bar — burgundy → turmeric → gold → burgundy */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(to right, var(--burgundy), var(--turmeric), var(--gold), var(--burgundy))",
        }}
      />

      <div className="container mx-auto px-6 md:px-10 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand block — 5/12 */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3.5 mb-4">
              <Logo size={40} />
              <Wordmark size="md" color="var(--sandalwood)" />
            </div>
            <p lang="ta" className="ta text-sm leading-relaxed text-gold-pale max-w-sm">
              தமிழ் இலக்கியத்தின் வாசிப்பு வீடு — செவ்விலக்கியம் முதல் சமகால எழுத்து வரை.
            </p>
            <p
              lang="en"
              className="text-sm text-gold mt-1 max-w-sm"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              A reading home for Tamil literature — from the classical to the contemporary.
            </p>
            {supportEmail && (
              <p
                className="mt-5 text-xs text-ink-3"
                style={{ fontFamily: "var(--font-mono)", color: "#8A7A60" }}
              >
                <a href={`mailto:${supportEmail}`} className="hover:text-gold-pale">
                  {supportEmail}
                </a>
              </p>
            )}
          </div>

          {/* Link groups — 3 × 7/12 */}
          {linkGroups.map((group) => (
            <div key={group.headingEn} className="md:col-span-2">
              <p className="eyebrow mb-3.5" style={{ color: "var(--turmeric)" }}>
                <span data-bi lang="ta">{group.headingTa}</span>
                <span data-bi lang="en">{group.headingEn}</span>
              </p>
              <ul className="flex flex-col gap-2">
                {group.items.map((item, idx) => (
                  <li key={`${group.headingEn}-${idx}`} className="text-sm" style={{ color: "var(--gold-pale)" }}>
                    <Link href={item.href} className="hover:text-paper transition-colors">
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
        className="border-t px-6 md:px-10 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
        style={{ borderColor: "rgba(216,184,124,.15)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "#8A7A60",
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
            color: "#8A7A60",
          }}
        >
          Made with care in Chennai · <span lang="ta">சென்னை</span>
        </span>
      </div>
    </footer>
  );
}
