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
  metadataBase: new URL("https://researchers.psyverse.fun"),
  title: "Global Chinese AI Researchers Ranking | 全球华人AI科学家影响力排行榜",
  description:
    "Comprehensive ranking of the most influential AI researchers and scientists of Chinese descent worldwide, featuring H-index, citations, and impact metrics. 全球华人人工智能科学家影响力综合排名。",
  keywords: ["AI researchers", "Chinese scientists", "H-index", "machine learning", "华人AI科学家", "影响力排行"],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Chinese AI Researchers" }],
    title: "Global Chinese AI Researchers Ranking",
    description: "全球华人人工智能科学家影响力综合排名。",
    url: "https://researchers.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "Chinese AI Researchers Ranking",
    description: "全球华人人工智能科学家影响力综合排名。",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0908" },
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
