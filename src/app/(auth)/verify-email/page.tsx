import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "மின்னஞ்சல் உறுதி — Verify email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Result
        ta="உறுதி இணைப்பு கிடைக்கவில்லை."
        en="No verification link provided."
        ok={false}
      />
    );
  }

  // POST to our own verify-email API server-side so the user doesn't need JS
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    return (
      <Result
        ta={data.alreadyVerified ? "ஏற்கனவே உறுதிசெய்யப்பட்டது." : "மின்னஞ்சல் உறுதிசெய்யப்பட்டது."}
        en={data.alreadyVerified ? "Already verified." : "Email verified."}
        ok
      />
    );
  }
  return (
    <Result
      ta="இணைப்பு செல்லாது அல்லது காலாவதியானது."
      en={data.error ?? "Link is invalid or expired."}
      ok={false}
    />
  );
}

function Result({ ta, en, ok }: { ta: string; en: string; ok: boolean }) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full ${
          ok ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
        }`}
        aria-hidden="true"
      >
        {ok ? "✓" : "!"}
      </div>
      <h1 lang="ta" className="font-heading text-2xl tracking-tight">
        {ta}
      </h1>
      <p lang="en" className="mt-2 text-sm italic text-muted-foreground">
        {en}
      </p>
      <div className="mt-8">
        <Link
          href={ok ? "/account" : "/"}
          className={cn(buttonVariants({ size: "lg" }))}
        >
          {ok ? "என் கணக்குக்கு செல்லவும் / Go to account" : "முகப்புக்கு / Home"}
        </Link>
      </div>
    </div>
  );
}
