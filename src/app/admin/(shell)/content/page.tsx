import Link from "next/link";
import { FilePlus, Upload } from "lucide-react";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";

export default async function AdminContentListPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const lang = await getAdminLang();
  const sp = await searchParams;

  const where: Prisma.ContentWhereInput = {
    deletedAt: null,
    ...(sp.type === "PDF" || sp.type === "BLOG" ? { type: sp.type } : {}),
    ...(sp.status === "DRAFT" || sp.status === "PUBLISHED" || sp.status === "ARCHIVED"
      ? { status: sp.status }
      : {}),
  };

  const items = await prisma.content.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
    include: {
      contentAuthors: {
        include: { author: true },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
      createdBy: { select: { name: true } },
    },
  });

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
            {t(adminStrings.content.listTitle, lang)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/content/new?type=BLOG"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <FilePlus className="size-4" />
            {t(adminStrings.content.newBlog, lang)}
          </Link>
          <Link
            href="/admin/content/new?type=PDF"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <Upload className="size-4" />
            {t(adminStrings.content.newPdf, lang)}
          </Link>
        </div>
      </div>

      <FilterBar lang={lang} currentType={sp.type} currentStatus={sp.status} />

      {items.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <p className="text-sm text-muted-foreground">No content found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t(adminStrings.common.title, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.common.type, lang)}</th>
                <th className="px-4 py-3 font-medium">{t(adminStrings.common.status, lang)}</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium text-right">Updated</th>
                <th className="px-4 py-3 font-medium text-right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((c) => {
                const statusLabel = adminStrings.content.statusBadge[c.status];
                return (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/content/${c.id}/edit`}
                        className="font-medium hover:text-primary"
                      >
                        <span lang="ta">{c.titleTamil}</span>
                      </Link>
                      {c.titleEnglish && (
                        <p className="text-xs text-muted-foreground italic">
                          {c.titleEnglish}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-normal">
                        {c.type}
                      </Badge>
                      {c.isPremium && (
                        <Badge className="ml-1.5 font-normal">Premium</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={c.status === "PUBLISHED" ? "default" : "secondary"}
                        className="font-normal"
                      >
                        {t(statusLabel, lang)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {c.contentAuthors[0]?.author.nameTamil ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                      {c.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/content/${c.id}/edit`}
                        className="text-xs text-primary hover:underline"
                      >
                        {t(adminStrings.common.edit, lang)}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function FilterBar({
  lang: _lang,
  currentType,
  currentStatus,
}: {
  lang: string;
  currentType?: string;
  currentStatus?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <FilterGroup label="Type" current={currentType} param="type" options={["", "PDF", "BLOG"]} />
      <FilterGroup
        label="Status"
        current={currentStatus}
        param="status"
        options={["", "DRAFT", "PUBLISHED", "ARCHIVED"]}
      />
    </div>
  );
}

function FilterGroup({
  label,
  current,
  param,
  options,
}: {
  label: string;
  current?: string;
  param: string;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      {options.map((opt) => {
        const active = (current ?? "") === opt;
        const href = opt
          ? `/admin/content?${param}=${opt}`
          : `/admin/content`;
        return (
          <Link
            key={opt || "all"}
            href={href}
            className={
              active
                ? "rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                : "rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            }
          >
            {opt || "All"}
          </Link>
        );
      })}
    </div>
  );
}
