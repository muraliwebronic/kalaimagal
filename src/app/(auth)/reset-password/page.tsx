import { ResetPasswordForm } from "./ResetPasswordForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata = { title: "புதிய கடவுச்சொல் — Set new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <AuthCard
      titleTa="புதிய கடவுச்சொல்"
      titleEn="Set a new password"
      subtitleTa={!token ? "மீட்பு இணைப்பு தவறானது அல்லது காலாவதியானது." : undefined}
      subtitleEn={!token ? "Reset link is missing or expired. Request a new one." : undefined}
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-center text-sm" style={{ color: "var(--kumkum)" }}>
          <span data-bi lang="ta">டோக்கன் இல்லை. மின்னஞ்சலில் உள்ள இணைப்பை பயன்படுத்தவும்.</span>
          <span data-bi lang="en">Missing reset token. Use the link from your email.</span>
        </p>
      )}
    </AuthCard>
  );
}
