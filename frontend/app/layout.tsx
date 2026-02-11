import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx

export const metadata: Metadata = {
  title: "ClipFarmer – AI Clip Generator",
  description:
    "Turn long videos into viral short clips automatically using AI.",
  metadataBase: new URL("https://clipfarmer.app"),
  openGraph: {
    title: "ClipFarmer – AI Clip Generator",
    description: "Automatically turn long videos into viral short clips.",
    url: "https://clipfarmer.app",
    siteName: "ClipFarmer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7954671576426890"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
