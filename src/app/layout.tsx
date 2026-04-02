import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Chinese AI Researchers Ranking | 全球华人AI科学家影响力排行榜",
  description:
    "Comprehensive ranking of the most influential AI researchers and scientists of Chinese descent worldwide, featuring H-index, citations, and impact metrics. 全球华人人工智能科学家影响力综合排名。",
  keywords: ["AI researchers", "Chinese scientists", "H-index", "machine learning", "华人AI科学家", "影响力排行"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
