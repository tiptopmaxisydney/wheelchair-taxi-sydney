import type { Metadata, Viewport } from "next";
import { Lato, Inter } from "next/font/google";
import Script from "next/script";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import "@/booking-widget/booking-widget.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StickyCta from "@/components/layout/StickyCta";
import AttributionTracker from "@/components/AttributionTracker";
import { siteConfig } from "@/lib/siteConfig";
import { GA_MEASUREMENT_ID } from "@/lib/ga4";

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
    default: "Accessible Wheelchair Transport Sydney | Wheelchair Taxi Sydney",
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
    title: "Accessible Wheelchair Transport Sydney | NDIS & Airport Transfers",
    description:
      "Book wheelchair accessible transport in Sydney. NDIS transport, airport transfers, aged care & hospital trips.",
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
  "@type": ["TravelAgency", "TaxiService", "LocalBusiness", "Organization"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: siteConfig.searchName,
  legalName: siteConfig.legalName,
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
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.youtube,
    siteConfig.social.linkedin,
    siteConfig.apps.appStore,
    siteConfig.apps.playStore,
    siteConfig.siblingBrands.tiptopMaxiSydney,
    siteConfig.siblingBrands.babySeatTaxiSydney,
    siteConfig.siblingBrands.tiptopRideBooking,
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  alternateName: siteConfig.searchName,
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
          <AttributionTracker />
          <Header />
          <main>{children}</main>
          <Footer />
          <StickyCta />
        </AntdRegistry>

        {(siteConfig.googleAdsId || GA_MEASUREMENT_ID) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.googleAdsId || GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${siteConfig.googleAdsId ? `gtag('config', '${siteConfig.googleAdsId}');` : ""}
                ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });` : ""}
              `}
            </Script>
          </>
        )}

        {/* Tealium tag (marketingcenter). Parameters is set before utag.js loads so the tag can read ExternalUid. */}
        <Script id="tealium-utag" strategy="afterInteractive">
          {`
            window.Parameters = window.Parameters || { ExternalUid: 'czs359' };
            var utag_data = {};
            (function(a,b,c,d){a='https://tags.tiqcdn.com/utag/marketingcenter/common/prod/utag.js';
            b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
            a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a); })();
          `}
        </Script>
      </body>
    </html>
  );
}
