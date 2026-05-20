import type { Metadata } from "next";
import { Noto_Sans_Tamil, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-sans",
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kalaimagal — கலைமகள் | The digital home of Tamil literature",
    template: "%s · Kalaimagal",
  },
  description: "தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு — Tamil e-books and essays, curated and edited for serious readers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ta"
      className={`${notoTamil.variable} ${lora.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
