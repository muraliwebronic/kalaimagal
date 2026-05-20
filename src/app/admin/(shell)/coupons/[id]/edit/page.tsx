import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getAdminLang } from "@/lib/admin/lang";
import { adminStrings, t } from "@/lib/admin/strings";
import { CouponForm } from "../../CouponForm";

export const metadata = { title: "Edit coupon · Admin" };

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const couponId = Number(id);
  if (!Number.isFinite(couponId)) notFound();

  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) notFound();

  const lang = await getAdminLang();

  return (
    <div className="px-6 md:px-10 py-8 max-w-2xl">
      <Link
        href="/admin/coupons"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        {t(adminStrings.common.back, lang)}
      </Link>
      <h1 className="font-heading text-2xl md:text-3xl tracking-tight mb-8 font-mono">{coupon.code}</h1>
      <CouponForm
        lang={lang}
        mode="edit"
        initial={{
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value.toString(),
          maxUses: coupon.maxUses,
          perUserLimit: coupon.perUserLimit,
          validUntil: coupon.validUntil,
          isActive: coupon.isActive,
        }}
      />
    </div>
  );
}
