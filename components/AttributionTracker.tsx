"use client";

import { useEffect } from "react";
import { captureAttribution, recordSourcePage } from "@/booking-widget/utils/attribution";

// No-UI component that captures marketing attribution (utm_*/gclid/fbclid) into
// sessionStorage as early in the session as possible, before the guest reaches
// the booking widget. See booking-widget/utils/attribution.ts.
//
// Also records the originating page for every "Book Now" CTA. The booking
// form itself only lives on the homepage (#wcb-booking-form), so every CTA
// site-wide links to "/#wcb-booking-form" — without this, source_page would
// always end up being the homepage, never the service page a guest actually
// clicked Book Now from.
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (href && href.includes("#wcb-booking-form")) {
        recordSourcePage();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
