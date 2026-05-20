import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, FileText, ShieldCheck, Globe } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "எங்களைப் பற்றி — About Kalaimagal",
  description:
    "Kalaimagal is the digital home of Tamil literature — curated PDFs and essays for serious readers.",
};

export default async function AboutPage() {
  const settings = await getSettings<{
    "site.tagline_tamil": string;
    "site.tagline_english": string;
    "site.support_email": string;
  }>([
    "site.tagline_tamil",
    "site.tagline_english",
    "site.support_email",
  ]);
  const taglineTa = settings["site.tagline_tamil"] ?? "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு";
  const taglineEn = settings["site.tagline_english"] ?? "The digital home of Tamil literature";
  const supportEmail = settings["site.support_email"];

  const [pdfCount, blogCount, authorCount] = await Promise.all([
    prisma.content.count({ where: { type: "PDF", status: "PUBLISHED", deletedAt: null } }),
    prisma.content.count({ where: { type: "BLOG", status: "PUBLISHED", deletedAt: null } }),
    prisma.author.count(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/60">
          <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                <span data-bi lang="ta">எங்களைப் பற்றி</span>
                <span data-bi lang="en">About</span>
              </p>
              <h1
                data-bi
                lang="ta"
                className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight"
              >
                {taglineTa}
              </h1>
              <h1
                data-bi
                lang="en"
                className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight"
              >
                {taglineEn}
              </h1>
              <p
                data-bi
                lang="ta"
                className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-prose"
              >
                சங்க காலம் முதல் தற்காலம் வரை — தமிழின் மிகச்சிறந்த புதினங்கள், கவிதைகள், கட்டுரைகள் — அனைத்தையும் ஒரே இடத்தில் கொண்டு வருகிறோம். கவனமாக தேர்ந்தெடுக்கப்பட்டு, அழகாக டிஜிட்டலாக்கப்பட்டது.
              </p>
              <p
                data-bi
                lang="en"
                className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-prose"
              >
                From the Sangam era to today — we bring the best of Tamil novels, poetry, and essays
                together in one place. Carefully curated, beautifully digitized.
              </p>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-b border-border/60 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
              <Stat
                value={pdfCount}
                labelTa="புத்தகங்கள்"
                labelEn="Books"
              />
              <Stat
                value={blogCount}
                labelTa="கட்டுரைகள்"
                labelEn="Articles"
              />
              <Stat
                value={authorCount}
                labelTa="எழுத்தாளர்கள்"
                labelEn="Authors"
              />
            </div>
          </div>
        </section>

        {/* What you'll find */}
        <section className="border-b border-border/60">
          <div className="container mx-auto px-4 md:px-6 py-20">
            <div className="max-w-3xl mb-10">
              <h2 className="font-heading text-3xl md:text-4xl tracking-tight">
                <span data-bi lang="ta">எங்களுடைய தளத்தில் என்ன கிடைக்கும்</span>
                <span data-bi lang="en">What you'll find here</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <FeatureCard
                icon={BookOpen}
                titleTa="தமிழ் புத்தகங்கள்"
                titleEn="Tamil books"
                descTa="புதினங்கள், சிறுகதைகள், கவிதைகள் — பாதுகாப்பான ரீடரில் வாசிக்கலாம்."
                descEn="Novels, short stories, poetry — readable in a secure viewer with no downloads."
              />
              <FeatureCard
                icon={FileText}
                titleTa="ஆழ்ந்த கட்டுரைகள்"
                titleEn="Long-form essays"
                descTa="தமிழ் இலக்கியத்தின் வரலாறு, விமர்சனம், புதிய எழுத்தாளர்கள் — தினமும் புதிய கட்டுரைகள்."
                descEn="Literary history, criticism, and new voices — fresh writing all the time."
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
                descEn="Tamil-primary, English-secondary — toggle in the top right."
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="container mx-auto px-4 md:px-6 py-20">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl md:text-4xl tracking-tight">
                <span data-bi lang="ta">எங்களைத் தொடர்பு கொள்ள</span>
                <span data-bi lang="en">Get in touch</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-prose">
                <span data-bi lang="ta">
                  புத்தகங்கள் பற்றிய பரிந்துரைகள், கட்டுரை சமர்ப்பிப்புகள், அல்லது தொழில்நுட்ப ஆதரவு — எங்களை அணுகவும்.
                </span>
                <span data-bi lang="en">
                  Book recommendations, article submissions, or tech support — we'd love to hear from you.
                </span>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {supportEmail && (
                  <a
                    href={`mailto:${supportEmail}`}
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    {supportEmail}
                  </a>
                )}
                <Link
                  href="/books"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                >
                  <span data-bi lang="ta">புத்தகங்களை உலாவு</span>
                  <span data-bi lang="en">Browse books</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer supportEmail={supportEmail} />
    </>
  );
}

function Stat({
  value,
  labelTa,
  labelEn,
}: {
  value: number;
  labelTa: string;
  labelEn: string;
}) {
  return (
    <div>
      <p className="font-heading text-4xl md:text-5xl tracking-tight text-primary tabular-nums">
        {value}+
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        <span data-bi lang="ta">{labelTa}</span>
        <span data-bi lang="en">{labelEn}</span>
      </p>
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
    <Card>
      <CardContent className="p-6 md:p-7 space-y-3">
        <div className="grid place-items-center size-10 rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <h3 className="font-heading text-lg md:text-xl tracking-tight">
          <span data-bi lang="ta">{titleTa}</span>
          <span data-bi lang="en">{titleEn}</span>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span data-bi lang="ta">{descTa}</span>
          <span data-bi lang="en">{descEn}</span>
        </p>
      </CardContent>
    </Card>
  );
}
