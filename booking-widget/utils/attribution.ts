// Marketing attribution captured client-side and carried through to the booking
// submission. website_source (hostname) is already captured robustly server-side
// from the Origin header — this adds the layer server can't see: which brand
// (defense-in-depth alongside website_source), which campaign, and which page.
const STORAGE_KEY = "tt_attribution";
const BRAND = "wheelchair-taxi-sydney";
const PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export interface Attribution {
  brand: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  source_page?: string;
  source_page_title?: string;
}

// Captures utm_*/gclid/fbclid from the current URL into sessionStorage. A fresh
// campaign click (any of those params present) always overwrites what's stored;
// otherwise the first-touch values already captured this session are kept, so
// internal navigation between pages doesn't wipe out the original attribution.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const incoming: Record<string, string> = {};
    let hasParams = false;
    for (const key of PARAM_KEYS) {
      const value = params.get(key);
      if (value) {
        incoming[key] = value;
        hasParams = true;
      }
    }
    if (hasParams || !sessionStorage.getItem(STORAGE_KEY)) {
      const attribution: Attribution = {
        brand: BRAND,
        ...incoming,
        landing_page: window.location.href,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    }
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — attribution is
    // best-effort, never block the booking flow over it.
  }
}

// Self-capturing read — safe to call even if nothing has mounted the tracker yet.
export function getAttribution(): Attribution {
  captureAttribution();
  if (typeof window === "undefined") return { brand: BRAND };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { brand: BRAND };
}

// The actual booking form only lives on the homepage (#wcb-booking-form) —
// every "Book Now" CTA across the site, no matter which page it's on, is a
// same-site link to "/#wcb-booking-form". So a live read of
// window.location.href at submit time (the old behaviour) always reports the
// homepage, never the page the guest actually clicked Book Now from. Call
// this from a click listener on those CTAs, before the browser navigates
// away, to record the real originating page instead.
export function recordSourcePage() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const attribution: Attribution = raw ? JSON.parse(raw) : { brand: BRAND };
    attribution.source_page = window.location.href;
    attribution.source_page_title = document.title;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage unavailable — best-effort, never block navigation over it.
  }
}

// The page the guest actually clicked Book Now from (recorded by
// recordSourcePage before the same-site navigation to the homepage form).
// Falls back to a live read of the current page for the rare case a guest
// reaches the form some other way (e.g. lands directly on
// /#wcb-booking-form, or Book Now is clicked from the homepage itself).
export function getCurrentPage(): { source_page?: string; source_page_title?: string } {
  const attribution = getAttribution();
  if (attribution.source_page) {
    return { source_page: attribution.source_page, source_page_title: attribution.source_page_title };
  }
  if (typeof window === "undefined") return {};
  return {
    source_page: window.location.href,
    source_page_title: typeof document !== "undefined" ? document.title : undefined,
  };
}
