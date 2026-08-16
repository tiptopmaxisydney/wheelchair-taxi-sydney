"use client";

// Entry point for embedding the ported Tiptop booking wizard anywhere on this site.
// Wraps the widget with its own Toast/AntD-theme context and a Suspense boundary
// (TiptopBookingForm reads the URL via useSearchParams, which requires one in the
// App Router) so the call site — e.g. Hero.tsx — can just drop in <TiptopBookingWidget />.
import { Suspense } from "react";
import BookingProvider from "@/booking-widget/context/Provider";
import TiptopBookingForm from "@/booking-widget/components/TiptopBookingForm";

export default function TiptopBookingWidget() {
  return (
    <BookingProvider>
      <Suspense fallback={null}>
        <TiptopBookingForm />
      </Suspense>
    </BookingProvider>
  );
}
