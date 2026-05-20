import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { strings } from "@/lib/strings";

export interface ContentCardData {
  id: number;
  slug: string;
  type: "PDF" | "BLOG";
  titleTamil: string;
  titleEnglish?: string | null;
  excerpt?: string | null;
  description?: string | null;
  coverImageUrl?: string | null;
  isPremium: boolean;
  authorNameTamil?: string | null;
  readingTimeMinutes?: number | null;
}

export function ContentCard({ item }: { item: ContentCardData }) {
  const href = item.type === "PDF" ? `/books/${item.slug}` : `/blogs/${item.slug}`;
  const blurb = item.excerpt ?? item.description ?? "";

  return (
    <Link href={href} className="group block">
      <Card className="h-full overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-md">
        {/* Cover */}
        <div className="relative aspect-[3/4] w-full bg-muted overflow-hidden">
          {item.coverImageUrl ? (
            // Use <img> until cover-url comes through next/image-friendly route
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverImageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                lang="ta"
                className="font-heading text-2xl text-muted-foreground/40 px-4 text-center"
              >
                {item.titleTamil.slice(0, 24)}
              </span>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Badge variant={item.isPremium ? "default" : "secondary"} className="font-normal">
              {item.isPremium ? strings.badge.premium.ta : strings.badge.free.ta}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-2 p-4">
          <h3
            lang="ta"
            className="font-heading text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors"
          >
            {item.titleTamil}
          </h3>
          {item.titleEnglish && (
            <p lang="en" className="text-xs italic text-muted-foreground line-clamp-1">
              {item.titleEnglish}
            </p>
          )}
          {item.authorNameTamil && (
            <p lang="ta" className="text-sm text-muted-foreground line-clamp-1">
              {item.authorNameTamil}
            </p>
          )}
          {blurb && (
            <p lang="ta" className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed">
              {blurb}
            </p>
          )}
          {item.readingTimeMinutes && (
            <p className="text-xs text-muted-foreground pt-1">
              {item.readingTimeMinutes} min read
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
