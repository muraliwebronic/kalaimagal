import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BooksLoading() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="mb-10">
            <div className="h-9 w-48 bg-secondary rounded animate-pulse" />
            <div className="mt-3 h-4 w-32 bg-secondary/60 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-md overflow-hidden border border-border/60 bg-card">
      <div className="aspect-[3/4] w-full bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-secondary/60 rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-secondary/40 rounded animate-pulse" />
      </div>
    </div>
  );
}
