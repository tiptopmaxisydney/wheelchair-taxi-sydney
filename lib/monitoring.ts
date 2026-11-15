// Shared Sentry settings for the browser, Node and edge runtimes.
//
// Sentry stays completely off unless NEXT_PUBLIC_SENTRY_DSN is set, so local dev and any
// deploy without the variable behave exactly as before. NEXT_PUBLIC_* values are inlined at
// build time, so the DSN must be in the server's .env when `npm run build` runs.
import type { BrowserOptions } from "@sentry/nextjs";

// Matches this site's `key` in the content-hub (Nexus2) Sites collection, so incidents can be
// linked back to the right tenant in the IT Monitoring section.
export const SITE_KEY = "wheelchair";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryOptions = {
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
  // Free plan: errors only. Performance tracing and session replay draw on separate quotas
  // (and replay would record customers filling in booking forms), so both stay off.
  tracesSampleRate: 0,
  // Sentry 11 collects request bodies, cookies, headers and query strings by default. Turn all
  // of that off: booking forms carry customer names, phone numbers and addresses.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { allow: ["user-agent", "content-type", "referer"] }, response: false },
    httpBodies: [],
    urlQueryParams: false,
    graphQL: { document: false, variables: false },
    genAI: { inputs: false, outputs: false },
  },
  initialScope: { tags: { site: SITE_KEY } },
} satisfies BrowserOptions;
