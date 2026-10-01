"use client";

import { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";
import BookingForm from "./BookingForm";
import TiptopBookingWidget from "@/booking-widget/components/TiptopBookingWidget";

// Header's "Book Now" links to #tiptop-booking-form (the wrapper below, default
// state), "Quote" links to #wcb-booking-form (BookingForm's own <form> id) —
// only one of the two forms is ever mounted, toggled by which hash is active.
const QUOTE_HASH = "#wcb-booking-form";

export default function Hero() {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      setShowQuote(hash === QUOTE_HASH);
      if (hash) {
        // Wait a tick so the form matching the new hash has mounted before
        // scrolling — the browser's own scroll-to-fragment can't find it yet.
        requestAnimationFrame(() => {
          document.getElementById("tiptop-booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <section className="wt-hero">
      <div className="container">
        <div className="wt-hero-grid">
          <div>
            <div className="wt-hero-eyebrow">Sydney&apos;s Accessible Transport Specialist</div>
            <h1>Accessible Wheelchair Transport Sydney</h1>
            <div id="tiptop-booking-form">
              {showQuote ? <BookingForm /> : <TiptopBookingWidget />}
            </div>
            <p>
              Professional wheelchair accessible transport with suitable vehicles, experienced drivers and safe
              wheelchair boarding for medical appointments, airports, hospitals, aged care and everyday journeys.
            </p>
            <div className="wt-hero-actions">
              <a href="#tiptop-booking-form" className="wt-btn wt-btn-primary">
                Book Transport
              </a>
              <a href={QUOTE_HASH} className="wt-btn wt-btn-outline">
                Get a Quote
              </a>
              <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-outline">
                <FaPhoneAlt aria-hidden="true" /> Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
