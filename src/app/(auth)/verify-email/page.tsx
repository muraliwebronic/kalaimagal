import Link from "next/link";
import { AuthCard } from "@/components/layout/AuthCard";

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
    <AuthCard titleTa={ok ? "மின்னஞ்சல் உறுதி" : "உறுதி தோல்வி"} titleEn={ok ? "Email verified" : "Verification failed"}>
      <div className="text-center">
        <div
          className="mx-auto mb-5 grid place-items-center size-14"
          style={{
            border: `1px solid ${ok ? "var(--peacock)" : "var(--kumkum)"}`,
            color: ok ? "var(--peacock)" : "var(--kumkum)",
            fontSize: 24,
          }}
          aria-hidden="true"
        >
          {ok ? "✓" : "!"}
        </div>
        <p lang="ta" className="ta text-ink mb-2">{ta}</p>
        <p
          lang="en"
          className="text-ink-3"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
        >
          {en}
        </p>
        <div className="mt-7">
          <Link
            href={ok ? "/account" : "/"}
            className="btn btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: 14 }}
          >
            {ok ? (
              <>
                <span data-bi lang="ta">என் கணக்குக்கு செல்</span>
                <span data-bi lang="en">Go to account</span>
              </>
            ) : (
              <>
                <span data-bi lang="ta">முகப்புக்குச் செல்</span>
                <span data-bi lang="en">Go home</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
