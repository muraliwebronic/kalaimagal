import { notFound } from "next/navigation";
import { PdfReader } from "@/components/viewer/PdfReader";
import { getPublicContentBySlug } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getPublicContentBySlug(slug);
  return {
    title: c ? `${c.titleTamil} — Read` : "Not found",
  };
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getPublicContentBySlug(slug);
  if (!book || book.type !== "PDF") notFound();
  if (!book.filePath || !book.pageCount) {
    // Published PDFs must have a file. If not, hide it.
    notFound();
  }

  const user = await getCurrentUser();
  const [isSubscribed, fullUser] = await Promise.all([
    user
      ? prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: "ACTIVE",
            expiresAt: { gt: new Date() },
          },
          select: { id: true },
        }).then(Boolean)
      : Promise.resolve(false),
    user
      ? prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true, email: true, phone: true },
        })
      : Promise.resolve(null),
  ]);

  const priceInrSetting = await getSetting<number>("payment.current_price_inr");
  const priceInr = typeof priceInrSetting === "number" ? priceInrSetting : 99;

  return (
    <PdfReader
      contentId={book.id}
      pageCount={book.pageCount}
      isPremium={book.isPremium}
      isSubscribed={isSubscribed}
      isLoggedIn={!!user}
      user={fullUser}
      titleTamil={book.titleTamil}
      titleEnglish={book.titleEnglish}
      authorNameTamil={book.contentAuthors[0]?.author.nameTamil ?? null}
      priceInr={priceInr}
      backHref={`/books/${book.slug}`}
    />
  );
}
