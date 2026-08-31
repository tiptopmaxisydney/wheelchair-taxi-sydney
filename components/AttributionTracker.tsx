"use client";

import { useEffect } from "react";
import { captureAttribution, recordSourcePage } from "@/booking-widget/utils/attribution";
import { trackEvent } from "@/lib/ga4";

// No-UI component that captures marketing attribution (utm_*/gclid/fbclid) into
// sessionStorage as early in the session as possible, before the guest reaches
// the booking widget. See booking-widget/utils/attribution.ts.
//
// Also records the originating page for every "Book Now" CTA. The booking
// form itself only lives on the homepage (#wcb-booking-form), so every CTA
// site-wide links to "/#wcb-booking-form" — without this, source_page would
// always end up being the homepage, never the service page a guest actually
// clicked Book Now from.
//
// Also fires phone_click/whatsapp_click GA4 events for every tel:/WhatsApp link site-wide
// (Header, StickyCta, ServiceHero, Hero, FinalCta, ...) via one delegated listener, rather
// than adding an onClick handler (and "use client") to each of those components individually.
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      if (href.includes("#wcb-booking-form")) {
        recordSourcePage();
      }
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { source_page: window.location.pathname });
      }
      if (href.startsWith("https://wa.me/")) {
        trackEvent("whatsapp_click", { source_page: window.location.pathname });
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
