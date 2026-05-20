import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { LogoutButton } from "../LogoutButton";

export const metadata = { title: "பாதுகாப்பு — Security" };

export default async function SecurityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const sessions = await prisma.session.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastUsedAt: "desc" },
    select: { id: true, deviceInfo: true, ipAddress: true, lastUsedAt: true, createdAt: true },
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Sessions */}
      <section className="frame" style={{ padding: 28 }}>
        <div className="flex items-end justify-between gap-3 mb-4">
          <div>
            <div className="eyebrow mb-1">
              <span data-bi lang="ta">செயலில் உள்ள சாதனங்கள்</span>
              <span data-bi lang="en">Active sessions</span>
            </div>
            <h2 className="ta-display text-ink" style={{ fontSize: 22 }}>
              <span data-bi lang="ta">{sessions.length} சாதனம்</span>
              <span data-bi lang="en">{sessions.length} device{sessions.length === 1 ? "" : "s"}</span>
            </h2>
          </div>
        </div>

        <ul className="divide-y divide-border-warm">
          {sessions.map((s) => {
            const isCurrent = s.id === user.sessionId;
            return (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="text-ink" style={{ fontFamily: "var(--font-display)", fontSize: 14 }}>
                    {s.deviceInfo ?? "Unknown device"}
                    {isCurrent && (
                      <span className="badge-km badge-km-free ml-2 inline-flex">
                        <span data-bi lang="ta">இப்போதைய</span>
                        <span data-bi lang="en">Current</span>
                      </span>
                    )}
                  </p>
                  <p className="eyebrow eyebrow-sm mt-1.5">
                    {s.ipAddress ?? "—"} · last active {s.lastUsedAt.toLocaleString()}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pt-4">
          <LogoutButton all />
        </div>
      </section>

      {/* Change password */}
      <section className="frame" style={{ padding: 28 }}>
        <div className="eyebrow mb-1">
          <span data-bi lang="ta">கடவுச்சொல்லை மாற்று</span>
          <span data-bi lang="en">Change password</span>
        </div>
        <h2 className="ta-display text-ink mb-3" style={{ fontSize: 22 }}>
          <span data-bi lang="ta">கடவுச்சொல் மீட்பு</span>
          <span data-bi lang="en">Reset your password</span>
        </h2>
        <p className="text-ink-2 mb-5" style={{ fontFamily: "var(--font-display)", fontSize: 14, lineHeight: 1.7 }}>
          <span data-bi lang="ta">
            உங்கள் கடவுச்சொல்லை மாற்ற, பாதுகாப்பான மீட்பு இணைப்பை மின்னஞ்சலில் பெற்று மாற்றலாம்.
          </span>
          <span data-bi lang="en">
            For security, we send a reset link to your email — click it to set a new password.
          </span>
        </p>
        <Link
          href="/forgot-password"
          className="btn btn-ghost"
          style={{ padding: "10px 22px", fontSize: 13 }}
        >
          <span data-bi lang="ta">மீட்பு இணைப்பு அனுப்பு</span>
          <span data-bi lang="en">Send reset link</span>
          <span style={{ opacity: 0.6 }}>→</span>
        </Link>
      </section>
    </div>
  );
}
