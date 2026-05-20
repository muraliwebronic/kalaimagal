import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata = { title: "கடவுச்சொல் மீட்பு — Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      titleTa="கடவுச்சொல் மீட்பு"
      titleEn="Reset your password"
      subtitleTa="உங்கள் மின்னஞ்சலை உள்ளிடவும் — மீட்பு இணைப்பை அனுப்புகிறோம்."
      subtitleEn="Enter your email — we'll send a reset link."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
