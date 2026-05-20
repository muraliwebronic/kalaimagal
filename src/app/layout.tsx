import type { Metadata } from "next";
import { Noto_Serif_Tamil, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { getUserLang } from "@/lib/user-lang";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Tamil display + body — Noto Serif Tamil gives the editorial / manuscript
// feel the redesign calls for (vs Noto Sans Tamil which reads more modern).
const tamilSerif = Noto_Serif_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// English display — Cormorant Garamond reads as a classical book typeface
// with italics for editorial captions.
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
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
    default: "Kalaimagal — கலைமகள் | The reading home for Tamil literature",
    template: "%s · Kalaimagal",
  },
  description:
    "தமிழ் இலக்கியத்தின் வாசிப்பு வீடு — Tamil e-books and essays, from the classical to the contemporary.",
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
      className={`${tamilSerif.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink font-display">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
