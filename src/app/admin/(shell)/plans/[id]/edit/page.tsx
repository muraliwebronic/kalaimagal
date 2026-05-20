import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { PlanForm } from "../../PlanForm";

export const metadata = { title: "Edit plan · Admin" };

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const planId = Number(id);
  if (!Number.isFinite(planId)) notFound();

  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) notFound();

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
        {plan.nameEnglish}
      </h1>
      <PlanForm
        lang={lang}
        mode="edit"
        initial={{
          id: plan.id,
          slug: plan.slug,
          nameTamil: plan.nameTamil,
          nameEnglish: plan.nameEnglish,
          descriptionTamil: plan.descriptionTamil,
          descriptionEnglish: plan.descriptionEnglish,
          priceInr: plan.priceInr.toString(),
          durationDays: plan.durationDays,
          isActive: plan.isActive,
          isFeatured: plan.isFeatured,
        }}
      />
    </div>
  );
}
