import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Gopuram, Thoranam, Divider } from "@/components/brand/Decor";



export default function NotFound() {
  return (
    <>
      <title>பக்கம் கிடைக்கவில்லை · Page not found</title>
      <Header />
      <main className="flex-1 paper-warm relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
          <Gopuram width={900} height={200} />
        </div>

        <div className="relative px-6 md:px-14 py-20 md:py-28 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-5 opacity-90">
            <Thoranam width={280} height={22} />
          </div>

          <p
            className="display text-burgundy"
            style={{
              fontSize: "clamp(64px, 12vw, 120px)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
            }}
          >
            404
          </p>

          <div className="my-5 w-full">
            <Divider />
          </div>

          <h1 lang="ta" className="ta-display text-ink" style={{ fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.25 }}>
            <span data-bi lang="ta">பக்கம் கிடைக்கவில்லை</span>
            <span data-bi lang="en">Page not found</span>
          </h1>
          <p
            className="text-ink-2 mt-3"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 17 }}
          >
            <span data-bi lang="ta">Page not found</span>
            <span data-bi lang="en">பக்கம் கிடைக்கவில்லை</span>
          </p>
          <p
            className="text-ink-3 mt-4"
            style={{ fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1.7 }}
          >
            <span data-bi lang="ta">
              நீங்கள் தேடிய பக்கம் நகர்த்தப்பட்டிருக்கலாம் அல்லது நீக்கப்பட்டிருக்கலாம்.
            </span>
            <span data-bi lang="en">
              The page you're looking for might have moved or been removed.
            </span>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary" style={{ padding: "13px 28px", fontSize: 14 }}>
              <span data-bi lang="ta">முகப்புக்குச் செல்</span>
              <span data-bi lang="en">Go home</span>
            </Link>
            <Link href="/books" className="btn btn-ghost" style={{ padding: "13px 22px", fontSize: 13 }}>
              <span data-bi lang="ta">புத்தகங்களை உலாவு</span>
              <span data-bi lang="en">Browse books</span>
              <span style={{ opacity: 0.6 }}>→</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
