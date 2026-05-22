import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink, Loader2, AlertCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { EditContentForm } from "./EditContentForm";

function RenderStatusBanner({
  state,
  progress,
  total,
  error,
}: {
  state: "PENDING" | "RENDERING" | "READY" | "FAILED";
  progress: number;
  total: number;
  error: string | null;
}) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  if (state === "FAILED") {
    return (
      <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/5 p-4">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="size-4 mt-0.5 text-destructive" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-destructive">Render failed</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error ?? "Unknown error"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Reset to retry via the API: <code className="font-mono">POST /api/admin/content/{"{id}"}/retry-render</code>{" "}
              (or update <code className="font-mono">renderState=PENDING</code> in Studio).
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
      <div className="flex items-start gap-2.5">
        {state === "RENDERING" ? (
          <Loader2 className="size-4 mt-0.5 text-amber-600 animate-spin" />
        ) : (
          <Clock className="size-4 mt-0.5 text-amber-600" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Pre-rendering pages ({progress} of {total})
          </p>
          <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/70">
            The book stays in DRAFT until every page is in the base cache. Publish will be locked until rendering is READY.
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/60 dark:bg-amber-900/40">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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

      {content.type === "PDF" && content.renderState !== "READY" && (
        <RenderStatusBanner
          state={content.renderState}
          progress={content.renderProgress}
          total={content.pageCount ?? 0}
          error={content.renderError}
        />
      )}

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
          renderState: content.renderState,
        }}
      />
    </div>
  );
}
