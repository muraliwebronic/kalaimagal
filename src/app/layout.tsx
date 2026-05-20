import type { Metadata } from "next";
import { Noto_Sans_Tamil, Lora, JetBrains_Mono } from "next/font/google";
import { getUserLang } from "@/lib/user-lang";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";
import { Toaster } from "@/components/ui/sonner";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userLang = await getUserLang();
  return (
    <html
      lang={userLang}
      data-lang={userLang}
      className={`${notoTamil.variable} ${lora.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
