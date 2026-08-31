// GA4 event tracking for Wheelchair Taxi Sydney. gtag.js itself is bootstrapped in
// app/layout.tsx (shared with the existing Google Ads tag) - this just fires events onto it.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Blank until a real GA4 property is created - every trackEvent() call below no-ops safely
// until then, since app/layout.tsx only configures gtag for whichever IDs are set.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
