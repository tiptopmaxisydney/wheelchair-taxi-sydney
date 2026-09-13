import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // superagent (used by booking-widget/utils/api.ts, ported from tiptopnextjs) pulls in
  // formidable for its Node build, which uses a dynamic require() Turbopack can't bundle
  // for the "use client" component's SSR pass. Treat it as an external runtime require.
  serverExternalPackages: ["superagent", "superagent-promise", "formidable"],
  images: {
    minimumCacheTTL: 31536000,
    qualities: [65, 75],
    // content-hub CMS media (Payload uploads) - dev hub runs on :3001, prod at cms.babyseattaxisydney.com.au.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "https", hostname: "cms.babyseattaxisydney.com.au" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // URL restructure (2026-08): transport-solutions-sydney (tiptopmaxisydney.com.au) is the
  // canonical brand for this keyword - this site's duplicate page permanently redirects there.
  //
  // Aged-care cluster consolidation (2026-09): these 3 pages duplicated
  // /aged-care-transport-sydney/'s intent (see the cannibalisation audit). Their unique
  // content was folded into the canonical page; the CMS docs are soft-retired (noindex,
  // not deleted - see merge-wheelchair-aged-care-cluster-2026-09.ts in content-hub) so this
  // is reversible if Search Console data later suggests a different page should have won.
  async redirects() {
    return [
      {
        source: "/western-sydney-airport-wheelchair-taxi/",
        destination: "https://tiptopmaxisydney.com.au/western-sydney-airport-wheelchair-taxi/",
        permanent: true,
      },
      {
        source: "/aged-care-home-transfers/",
        destination: "/aged-care-transport-sydney/",
        permanent: true,
      },
      {
        source: "/nursing-home-transfers/",
        destination: "/aged-care-transport-sydney/",
        permanent: true,
      },
      {
        source: "/old-age-home-transfers/",
        destination: "/aged-care-transport-sydney/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
