// Shared Sentry settings for the browser, Node and edge runtimes.
//
// Sentry stays completely off unless NEXT_PUBLIC_SENTRY_DSN is set, so local dev and any
// deploy without the variable behave exactly as before. NEXT_PUBLIC_* values are inlined at
// build time, so the DSN must be in the server's .env when `npm run build` runs.

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
  sendDefaultPii: false,
  initialScope: { tags: { site: SITE_KEY } },
};
