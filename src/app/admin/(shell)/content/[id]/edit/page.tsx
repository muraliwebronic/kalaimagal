import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { EditContentForm } from "./EditContentForm";

export const metadata = { title: "Edit content · Admin" };

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contentId = Number(id);
  if (!Number.isFinite(contentId)) notFound();

  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      contentAuthors: { include: { author: true }, orderBy: { sortOrder: "asc" } },
      contentCategories: { include: { category: true } },
    },
  });
  if (!content) notFound();

  const lang = await getAdminLang();

  return (
    <div className="px-6 md:px-10 py-8 max-w-4xl">
      <Link
        href="/admin/content"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        {t(adminStrings.common.back, lang)}
      </Link>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
            <span lang="ta">{content.titleTamil}</span>
          </h1>
          {content.titleEnglish && (
            <p className="mt-1 text-base italic text-muted-foreground">
              {content.titleEnglish}
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
            id={content.id} · type={content.type} · pages={content.pageCount ?? "—"}
          </p>
        </div>
        {content.status === "PUBLISHED" && (
          <Link
            href={content.type === "PDF" ? `/books/${content.slug}` : `/blogs/${content.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <ExternalLink className="size-3.5" />
            View live
          </Link>
        )}
      </div>

      <EditContentForm
        lang={lang}
        initial={{
          id: content.id,
          type: content.type,
          slug: content.slug,
          titleTamil: content.titleTamil,
          titleEnglish: content.titleEnglish,
          description: content.description,
          excerpt: content.excerpt,
          bodyText: content.bodyText,
          isPremium: content.isPremium,
          isFeatured: content.isFeatured,
          status: content.status,
          language: content.language,
          readingTimeMinutes: content.readingTimeMinutes,
          metaTitle: content.metaTitle,
          metaDescription: content.metaDescription,
        }}
      />
    </div>
  );
}
