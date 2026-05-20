import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testSmtp() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`Testing SMTP with:
    Host: ${host}
    Port: ${port}
    Secure: ${secure}
    User: ${user}
  `);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection verified successfully!");
    
    const fromEmail = process.env.EMAIL_FROM || user;
    const toEmail = 'muralikrishna@webronic.com';
    
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: "test",
      text: "hi this si from smtp"
    };
    
    console.log(`Sending test email from ${fromEmail} to ${toEmail}...`);
    const sendResult = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent! Message ID:", sendResult.messageId);
    
  } catch (error) {
    console.error("❌ SMTP Test failed:", error);
  }
}

testSmtp();
