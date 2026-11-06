import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Afro Arab Properties — Everyone can buy a house",
    template: "%s · Afro Arab Properties",
  },
  description:
    "Afro Arab Properties develops homes and titled land across Greater Accra with clearer inventory, interest-free payment paths, and live plot exploration.",
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Afro Arab Properties",
    title: "Afro Arab Properties — Everyone can buy a house",
    description:
      "Homes, titled land, and interactive plot selection for buyers across Ghana and the diaspora.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Afro Arab Properties",
    description: "Everyone can buy a house — when the project facts are clear.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Afro Arab Properties",
    url: siteUrl,
    areaServed: "GH",
    description:
      "Real estate development and construction across Greater Accra, Ghana.",
  };

  return (
    <html
      lang="en-GH"
      className={`${manrope.variable} ${fraunces.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sand-50 text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
