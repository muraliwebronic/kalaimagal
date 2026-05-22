import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, FileText, ShieldCheck, Globe } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Gopuram, Thoranam, Divider } from "@/components/brand/Decor";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "எங்களைப் பற்றி — About Kalaimagal",
  description: "Kalaimagal — a reading home for Tamil literature, from the classical to the contemporary.",
};

export default async function AboutPage() {
  const settings = await getSettings<{
    "site.tagline_tamil": string;
    "site.tagline_english": string;
    "site.support_email": string;
  }>(["site.tagline_tamil", "site.tagline_english", "site.support_email"]);

  const taglineTa = settings["site.tagline_tamil"] ?? "தமிழ் இலக்கியத்தின் வாசிப்பு வீடு";
  const taglineEn = settings["site.tagline_english"] ?? "A reading home for Tamil literature";
  const supportEmail = settings["site.support_email"];

  const [pdfCount, blogCount, authorCount] = await Promise.all([
    prisma.content.count({ where: { type: "PDF", status: "PUBLISHED", deletedAt: null } }),
    prisma.content.count({ where: { type: "BLOG", status: "PUBLISHED", deletedAt: null } }),
    prisma.author.count(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 paper-warm">
        {/* HERO — gopuram silhouette behind */}
        <section className="relative px-6 md:px-14 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
            <Gopuram width={900} height={200} />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5 opacity-90">
              <Thoranam width={420} height={24} />
            </div>

            <div className="eyebrow mb-4">
              <span data-bi lang="ta">எங்களைப் பற்றி · About</span>
              <span data-bi lang="en">About</span>
            </div>

            {/* Tagline — Tamil h1 with explicit lang="ta" so Noto Serif Tamil
                renders the glyphs (previously this was rendering ????? because
                the old `font-heading` was Cormorant which has no Tamil chars) */}
            <h1
              lang="ta"
              className="ta-display text-burgundy"
              style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.15, marginBottom: 14 }}
            >
              {taglineTa}
            </h1>
            <p
              lang="en"
              className="text-ink-2"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.3 }}
            >
              {taglineEn}
            </p>

            <p
              lang="ta"
              className="ta text-ink-3 mx-auto max-w-2xl mt-6"
              style={{ fontSize: 16, lineHeight: 1.85 }}
            >
              சங்க காலம் முதல் தற்காலம் வரை — தமிழின் மிகச்சிறந்த புதினங்கள், கவிதைகள், கட்டுரைகள் — அனைத்தையும் ஒரே இடத்தில் கொண்டு வருகிறோம். கவனமாக தேர்ந்தெடுக்கப்பட்டு, அழகாக டிஜிட்டலாக்கப்பட்டது.
            </p>
            <p
              lang="en"
              className="text-ink-3 mx-auto max-w-2xl mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 15.5, lineHeight: 1.7, fontStyle: "italic" }}
            >
              From the Sangam era to today — the best of Tamil novels, poetry and essays, gathered in one place. Carefully curated, beautifully digitized.
            </p>
          </div>
        </section>

        <div className="trim mx-6 md:mx-14" />

        {/* Stats strip */}
        <section className="px-6 md:px-14 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            <Divider label="நூலகம் · The Library Today" />
            <div
              className="mt-8 grid grid-cols-3 border border-border-warm"
              style={{ background: "rgba(241,230,210,.5)" }}
            >
              <Stat n={pdfCount} ta="புத்தகங்கள்" en="Books" />
              <Stat n={blogCount} ta="கட்டுரைகள்" en="Articles" border />
              <Stat n={authorCount} ta="ஆசிரியர்கள்" en="Authors" border />
            </div>
          </div>
        </section>

        {/* What you'll find */}
        <section className="px-6 md:px-14 py-14 md:py-20 border-t border-border-warm">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
              <div className="eyebrow mb-2">
                <span data-bi lang="ta">தளத்தில் என்ன கிடைக்கும் · What you'll find</span>
                <span data-bi lang="en">What you'll find</span>
              </div>
              <h2 className="ta-display text-ink" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
                <span data-bi lang="ta">நான்கு வகையான அனுபவம்</span>
                <span data-bi lang="en">Four parts of the experience</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={BookOpen}
                titleTa="தமிழ் புத்தகங்கள்"
                titleEn="Tamil books"
                descTa="புதினங்கள், சிறுகதைகள், கவிதைகள் — பாதுகாப்பான ரீடரில் வாசிக்கலாம்."
                descEn="Novels, short stories and poetry — read in a secure viewer with no downloads."
              />
              <FeatureCard
                icon={FileText}
                titleTa="ஆழ்ந்த கட்டுரைகள்"
                titleEn="Long-form essays"
                descTa="தமிழ் இலக்கியத்தின் வரலாறு, விமர்சனம், புதிய எழுத்தாளர்கள் — தினமும் புதிய கட்டுரைகள்."
                descEn="Literary history, criticism, new voices — fresh writing throughout the week."
              />
              <FeatureCard
                icon={ShieldCheck}
                titleTa="பாதுகாப்பான வாசிப்பு"
                titleEn="Secure reading"
                descTa="உள்ளடக்கம் கேன்வாஸில் காட்டப்படுகிறது — காப்பகப்படுத்த அல்லது நகலெடுக்க முடியாது."
                descEn="Pages render on Canvas with watermarking — no easy copy or download."
              />
              <FeatureCard
                icon={Globe}
                titleTa="இரு மொழி ஆதரவு"
                titleEn="Bilingual experience"
                descTa="தமிழ் முதன்மை, ஆங்கிலம் இரண்டாம் நிலை — மேல் வலதில் மொழியை மாற்றலாம்."
                descEn="Tamil-primary, English secondary — toggle in the top right."
              />
            </div>
          </div>
        </section>

        {/* Contact band */}
        <section
          className="px-6 md:px-14 py-14 md:py-20 border-t border-border-warm"
          style={{ background: "var(--sandalwood)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <Divider label="தொடர்பு · Get in touch" />
            <h2 className="ta-display text-burgundy mt-7" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              <span data-bi lang="ta">எங்களுடன் பேசுங்கள்</span>
              <span data-bi lang="en">Talk to us</span>
            </h2>
            <p
              className="text-ink-2 mt-3 mx-auto"
              style={{ fontFamily: "var(--font-display)", fontSize: 16, lineHeight: 1.7, maxWidth: "52ch" }}
            >
              <span data-bi lang="ta">
                புத்தகங்கள் பற்றிய பரிந்துரைகள், கட்டுரை சமர்ப்பிப்புகள், அல்லது தொழில்நுட்ப ஆதரவு — எங்களை அணுகவும்.
              </span>
              <span data-bi lang="en">
                Book recommendations, article submissions, or technical help — we'd love to hear from you.
              </span>
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="btn btn-primary" style={{ padding: "13px 28px", fontSize: 14 }}>
                  {supportEmail}
                </a>
              )}
              <Link href="/books" className="btn btn-ghost" style={{ padding: "13px 22px", fontSize: 13 }}>
                <span data-bi lang="ta">புத்தகங்களை உலாவு</span>
                <span data-bi lang="en">Browse books</span>
                <span style={{ opacity: 0.6 }}>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}

function Stat({ n, ta, en, border = false }: { n: number; ta: string; en: string; border?: boolean }) {
  return (
    <div
      className="text-center px-3 py-6"
      style={{ borderLeft: border ? "1px solid var(--border-warm)" : undefined }}
    >
      <div className="display text-burgundy" style={{ fontSize: "clamp(32px, 5vw, 44px)", lineHeight: 1 }}>
        {n}+
      </div>
      <div className="ta text-ink-3 mt-1.5" style={{ fontSize: 13 }}>
        <span data-bi lang="ta">{ta}</span>
        <span data-bi lang="en">{en}</span>
      </div>
      <div className="eyebrow eyebrow-sm mt-1 text-gold">{en}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  titleTa,
  titleEn,
  descTa,
  descEn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  titleTa: string;
  titleEn: string;
  descTa: string;
  descEn: string;
}) {
  return (
    <article className="frame" style={{ padding: 28 }}>
      <div
        className="grid place-items-center size-10 mb-4"
        style={{ background: "var(--burgundy)", color: "var(--logo-yellow)" }}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="ta-display text-ink mb-2" style={{ fontSize: 22, lineHeight: 1.3 }}>
        <span data-bi lang="ta">{titleTa}</span>
        <span data-bi lang="en">{titleEn}</span>
      </h3>
      <p
        className="text-ink-2"
        style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.7 }}
      >
        <span data-bi lang="ta" className="ta">
          {descTa}
        </span>
        <span data-bi lang="en">{descEn}</span>
      </p>
    </article>
  );
}
