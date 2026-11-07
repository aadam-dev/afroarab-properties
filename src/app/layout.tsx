import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { ThemeProvider } from "@/components/site/ThemeProvider";
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
  axes: ["SOFT", "opsz", "WONK"],
});

/** Editorial body + figure numerals for luxury write-ups */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  icons: {
    icon: [{ url: "/brand/favicon-180.png", sizes: "180x180", type: "image/png" }],
    apple: "/brand/favicon-180.png",
  },
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

const themeInitScript = `(function(){try{var t=localStorage.getItem('aa-theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

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
      data-theme="light"
      className={`${manrope.variable} ${fraunces.variable} ${cormorant.variable} ${plex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
