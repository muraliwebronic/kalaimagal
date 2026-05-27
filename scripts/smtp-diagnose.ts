/**
 * SMTP diagnostic — verifies the transport handshake and fires a single
 * test mail with full SMTP debug log so we can see exactly what the
 * relay accepts / rejects. Run:
 *
 *   npx tsx scripts/smtp-diagnose.ts
 */
import "dotenv/config";
import nodemailer from "nodemailer";

const TO = process.argv[2] ?? "muralikris812@gmail.com";

async function main() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  console.log("── SMTP config (in-memory) ─────────────────────────");
  console.log("host:   ", host);
  console.log("port:   ", port);
  console.log("secure: ", secure);
  console.log("user:   ", user);
  console.log("pass:   ", pass ? `***(${pass.length} chars)` : "<missing>");
  console.log("from:   ", from);
  console.log("to:     ", TO);
  console.log("────────────────────────────────────────────────────");

  // From-domain vs auth-domain alignment check
  const userDomain = user?.split("@")[1];
  const fromMatch = (from ?? "").match(/<([^>]+)>/) ?? [];
  const fromAddr = fromMatch[1] ?? from ?? "";
  const fromDomain = fromAddr.split("@")[1];
  if (userDomain && fromDomain && userDomain !== fromDomain) {
    console.log(`⚠  DOMAIN MISMATCH: auth user @${userDomain} vs From: @${fromDomain}`);
    console.log("   Most receivers will reject this as spoofing unless the");
    console.log("   sending server is in From-domain's SPF and signs DKIM");
    console.log("   for that domain.");
    console.log("────────────────────────────────────────────────────");
  }

  const tx = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    logger: true,
    debug: true,
  });

  console.log("\n── verify() — TCP + TLS + AUTH handshake ──────────");
  try {
    await tx.verify();
    console.log("✓ transport OK");
  } catch (e) {
    console.log("✗ transport FAILED:", e instanceof Error ? e.message : e);
    process.exit(1);
  }

  console.log("\n── sendMail() ─────────────────────────────────────");
  try {
    const info = await tx.sendMail({
      from,
      replyTo: process.env.EMAIL_REPLY_TO,
      to: TO,
      subject: "Kalaimagal SMTP diagnostic",
      text:
        "This is an SMTP diagnostic from the Kalaimagal project.\n\n" +
        "If you got it in Inbox: deliverability is fine.\n" +
        "If you got it in Spam: SPF/DKIM/DMARC misalignment.\n" +
        "If you didn't get it: the server rejected after RCPT — see the log above.",
      html:
        "<p>This is an SMTP diagnostic from the <b>Kalaimagal</b> project.</p>" +
        "<p>If you got it in <b>Inbox</b>: deliverability is fine.</p>" +
        "<p>If you got it in <b>Spam</b>: SPF/DKIM/DMARC misalignment.</p>" +
        "<p>If you didn't get it: the server rejected after RCPT — see the SMTP log on the sender side.</p>",
    });
    console.log("\n── result ─────────────────────────────────────────");
    console.log("messageId :", info.messageId);
    console.log("accepted  :", info.accepted);
    console.log("rejected  :", info.rejected);
    console.log("response  :", info.response);
    console.log("envelope  :", info.envelope);
  } catch (e) {
    console.log("\n✗ sendMail FAILED:");
    console.log(e instanceof Error ? e.message : e);
    if (e instanceof Error && "response" in e) {
      console.log("smtp response:", e.response);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("uncaught:", e);
  process.exit(1);
});
