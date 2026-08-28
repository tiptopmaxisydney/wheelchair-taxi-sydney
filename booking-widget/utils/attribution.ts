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

// Live snapshot of the page the guest is actually on right now — distinct from
// landing_page (first page of the session), captured fresh at submit time.
export function getCurrentPage(): { source_page?: string; source_page_title?: string } {
  if (typeof window === "undefined") return {};
  return {
    source_page: window.location.href,
    source_page_title: typeof document !== "undefined" ? document.title : undefined,
  };
}
