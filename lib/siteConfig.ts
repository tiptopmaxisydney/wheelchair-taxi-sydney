export const siteConfig = {
  name: "Wheelchair Taxi Sydney",
  legalName: "TipTop Transport Solutions",
  url: "https://wheelchairtaxisydney.com.au",
  description:
    "Book a wheelchair taxi in Sydney for airport, hospital, aged care and NDIS transport. Reliable wheelchair accessible vehicles with professional drivers.",
  phoneLocal: "0296699390",
  phoneLocalDisplay: "(02) 9669 9390",
  phoneIntl: "+61296699390",
  phoneIntlDisplay: "+61 2 9669 9390",
  email: "bookings@wheelchairtaxisydney.com.au",
  whatsapp: "https://wa.me/+61410025786",
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  social: {
    facebook: "https://www.facebook.com/tiptoptransportsolutions/",
    youtube: "https://www.youtube.com/channel/UCgHnPRVHFJXdR6gWBuskwDQ",
  },
  apps: {
    appStore: "https://apps.apple.com/us/app/tiptop-ride/id6739037902",
    playStore: "https://play.google.com/store/apps/details?id=com.tiptop.ride",
  },
  address: {
    street: "16/2A",
    locality: "Liverpool",
    region: "NSW",
    postcode: "2170",
    country: "AU",
  },
} as const;
