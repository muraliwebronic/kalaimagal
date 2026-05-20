import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { NewPdfForm } from "./NewPdfForm";
import { NewBlogForm } from "./NewBlogForm";

export const metadata = { title: "New content · Admin" };

export default async function NewContentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const lang = await getAdminLang();
  const sp = await searchParams;
  const type = sp.type === "BLOG" ? "BLOG" : "PDF";

  return (
    <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto">
      <Link
        href="/admin/content"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        {t(adminStrings.common.back, lang)}
      </Link>

      <h1 className="font-heading text-2xl md:text-3xl tracking-tight">
        {type === "PDF"
          ? t(adminStrings.content.newPdf, lang)
          : t(adminStrings.content.newBlog, lang)}
      </h1>

      <div className="mt-8">
        {type === "PDF" ? <NewPdfForm lang={lang} /> : <NewBlogForm lang={lang} />}
      </div>
    </div>
  );
}
