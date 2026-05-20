import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = { title: "கடவுச்சொல் மீட்பு — Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 lang="ta" className="font-heading text-3xl tracking-tight">
          கடவுச்சொல் மீட்பு
        </h1>
        <p lang="en" className="mt-1 text-sm italic text-muted-foreground">
          Reset your password
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
