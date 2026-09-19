import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import EmergencySOS from "@/components/common/EmergencySOS";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "HUMSAFAR | Senior Care Companion",
  description: "Accessible, AI-powered digital companion for senior citizens.",
  manifest: "/manifest.json",
  themeColor: "#0A1128",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 min-h-screen pb-32`}>
        {children}
        <EmergencySOS langCode="hi-IN" />
      </body>
    </html>
  );
}
