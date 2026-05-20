import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Page not found · Kalaimagal",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md text-center py-20">
          <p className="font-heading text-7xl tracking-tight text-primary tabular-nums">
            404
          </p>
          <h1 className="mt-6 font-heading text-2xl md:text-3xl tracking-tight">
            <span data-bi lang="ta">பக்கம் கிடைக்கவில்லை</span>
            <span data-bi lang="en">Page not found</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span data-bi lang="ta">
              நீங்கள் தேடிய பக்கம் நகர்த்தப்பட்டிருக்கலாம் அல்லது நீக்கப்பட்டிருக்கலாம்.
            </span>
            <span data-bi lang="en">
              The page you're looking for might have moved or been removed.
            </span>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
              <span data-bi lang="ta">முகப்புக்குச் செல்</span>
              <span data-bi lang="en">Go home</span>
            </Link>
            <Link
              href="/books"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              <span data-bi lang="ta">புத்தகங்களை உலாவு</span>
              <span data-bi lang="en">Browse books</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
