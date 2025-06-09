import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";

import { Header } from "@/components/header";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Modern Blog",
    default: "Modern Blog",
  },
  description: "A modern blog featuring the latest articles and insights",
  keywords: ["blog", "articles", "modern", "insights", "technology"],
  authors: [{ name: "Modern Blog Team" }],
  creator: "Modern Blog",
  publisher: "Modern Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Modern Blog",
    title: "Modern Blog",
    description: "A modern blog featuring the latest articles and insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modern Blog",
    description: "A modern blog featuring the latest articles and insights",
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Suspense> {children}</Suspense>

        <Footer />
      </body>
    </html>
  );
}
