import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = { title: "புதிய கடவுச்சொல் — Set new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 lang="ta" className="font-heading text-3xl tracking-tight">
          புதிய கடவுச்சொல்
        </h1>
        <p lang="en" className="mt-1 text-sm italic text-muted-foreground">
          Set a new password
        </p>
      </div>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="text-center text-sm text-destructive">
          Missing reset token. Use the link from your email.
        </p>
      )}
    </div>
  );
}
