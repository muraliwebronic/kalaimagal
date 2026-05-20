import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { PlanForm } from "../PlanForm";

export const metadata = { title: "New plan · Admin" };

export default async function NewPlanPage() {
  const lang = await getAdminLang();
  return (
    <div className="px-6 md:px-10 py-8 max-w-2xl">
      <Link
        href="/admin/plans"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        {t(adminStrings.common.back, lang)}
      </Link>
      <h1 className="font-heading text-2xl md:text-3xl tracking-tight mb-8">
        New plan
      </h1>
      <PlanForm lang={lang} mode="create" />
    </div>
  );
}
