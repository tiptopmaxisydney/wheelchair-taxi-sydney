import type { Metadata, Viewport } from "next";
import { Lato, Inter } from "next/font/google";
import Script from "next/script";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import "@/booking-widget/booking-widget.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyCta from "@/components/layout/StickyCta";
import { siteConfig } from "@/lib/siteConfig";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Wheelchair Taxi Sydney | Accessible Wheelchair Transport Service",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/cropped-wheelchair-taxi-sydney-airport--270x270.png",
    shortcut: "/images/cropped-wheelchair-taxi-sydney-airport--270x270.png",
    apple: "/images/cropped-wheelchair-taxi-sydney-airport--270x270.png",
  },
  keywords: [
    "wheelchair taxi sydney",
    "wheelchair accessible taxi",
    "wheelchair accessible transport sydney",
    "NDIS transport sydney",
    "disability transport sydney",
    "accessible taxi service",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    title: "Wheelchair Taxi Sydney | NDIS & Airport Transfers | Book 24/7",
    description:
      "Book a wheelchair-accessible taxi in Sydney 24/7. NDIS transport, airport transfers, aged care & hospital rides.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1d69b4",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "Organization"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phoneIntl,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postcode,
    addressCountry: siteConfig.address.country,
  },
  areaServed: { "@type": "City", name: "Sydney" },
  sameAs: [siteConfig.social.facebook, siteConfig.social.youtube],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  publisher: { "@id": `${siteConfig.url}/#organization` },
  inLanguage: "en-AU",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${lato.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body id="top">
        <AntdRegistry>
          <Header />
          <main>{children}</main>
          <Footer />
          <StickyCta />
        </AntdRegistry>

        {siteConfig.googleAdsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.googleAdsId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
