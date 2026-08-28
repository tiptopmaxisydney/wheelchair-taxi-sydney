"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/booking-widget/utils/attribution";

// No-UI component that captures marketing attribution (utm_*/gclid/fbclid) into
// sessionStorage as early in the session as possible, before the guest reaches
// the booking widget. See booking-widget/utils/attribution.ts.
export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
