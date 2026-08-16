declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the Google Ads booking conversion event. No-ops (with a console
 * warning) until NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL is set from the
 * Ads conversion action, since firing with a placeholder label would just
 * report a broken conversion in the Ads account.
 */
export function trackBookingConversion(bookingId?: string) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (!adsId || !conversionLabel) {
    window.console?.warn(
      "[Google Ads] Booking conversion not tracked: set NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL to enable it."
    );
    return;
  }
  if (!window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${adsId}/${conversionLabel}`,
    value: 1.0,
    currency: "AUD",
    transaction_id: bookingId ?? "",
  });
}
