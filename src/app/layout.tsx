import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"] });

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HUMSAFAR (हमसफ़र) | Senior Care & AI Scam Shield Companion",
  description: "Culturally tuned, elder-first protective companion application for Indian seniors and remote guardians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased selection:bg-amber-400 selection:text-slate-900`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
