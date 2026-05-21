import type { Metadata } from "next";
import { Noto_Serif_Tamil, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { getUserLang } from "@/lib/user-lang";
import { getCurrentUser } from "@/lib/auth";
import { JsonLd, organizationLd, websiteLd } from "@/lib/jsonld";
import { Toaster } from "@/components/ui/sonner";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileTopBarWrapper } from "@/components/layout/MobileTopBarWrapper";
import "./globals.css";

const tamilSerif = Noto_Serif_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
  const [userLang, user] = await Promise.all([getUserLang(), getCurrentUser()]);
  return (
    <html
      lang={userLang}
      data-lang={userLang}
      className={`${tamilSerif.variable} ${cormorant.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      {/* Bottom padding on mobile so the fixed bottom nav doesn't cover content */}
      <body className="min-h-full flex flex-col bg-paper text-ink font-display pb-16 lg:pb-0">
        <MobileTopBarWrapper>
          <MobileTopBar />
        </MobileTopBarWrapper>
        {children}
        <MobileBottomNav
          lang={userLang}
          user={user ? { name: user.name, email: user.email, role: user.role } : null}
        />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
