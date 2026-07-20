import type { Metadata } from "next";
import { Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "PropertyFix AI — AI maintenance & contractor dispatch for property teams",
    template: "%s · PropertyFix AI",
  },
  description:
    "Tenants report issues in seconds. AI triages urgency and trade, drafts a clean job ticket, and dispatches the right contractor — while landlords stay informed. Built for UK property agencies.",
  openGraph: {
    title: "PropertyFix AI",
    description:
      "AI maintenance triage and contractor dispatch for property agencies, landlords, and property managers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Satoshi — distinctive geometric body font (Fontshare) */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
        <style>{`:root{--font-satoshi:'Satoshi'}`}</style>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
