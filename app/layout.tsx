import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Anton, Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import { SharedGradientFilter } from "@/components/shared-gradient-filter";
import { getSiteUrl } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-year",
  weight: "400",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const socialDescription =
  "Agenda, lieux et artistes — Fête de la musique 2026";
const ogImageUrl = `${siteUrl}/og-image.webp`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fête de la musique 2026",
  description: "Expérience mobile — Fête de la musique 2026",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FDLM 2026",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Fête de la musique 2026",
    description: socialDescription,
    url: "/",
    siteName: "Fête de la musique 2026",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1920,
        height: 1080,
        alt: "Fête de la musique 2026",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fête de la musique 2026",
    description: socialDescription,
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="ios-class-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var i=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);if(i)document.documentElement.classList.add("ios")})();`,
          }}
        />
        <SharedGradientFilter />
        {children}
      </body>
    </html>
  );
}
