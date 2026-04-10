import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "バイスル | 特典ショップ",
  description:
    "埼玉西武ライオンズ × アメフリ 特典を購入できるバイスルショップ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
