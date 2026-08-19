"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaShuttleVan,
  FaUserFriends,
} from "react-icons/fa";
import { STRIPE_ACCESS_KEY } from "@/booking-widget/utils/api";
import { siteConfig } from "@/lib/siteConfig";

interface BookingSummary {
  pickup_address?: string;
  drop_address?: string;
  date?: string;
  time?: string;
  is_return_trip?: boolean;
  return_pickup_address?: string;
  return_drop_address?: string;
  return_date?: string;
  return_time?: string;
  vehicle_name?: string;
  passenger?: number;
  booking_id?: string;
  amount?: number;
}

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) =>
  value === undefined || value === null || value === "" ? null : (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );

export default function ThankYouContent() {
  // Defaults to "confirmed" for the in-page (non-redirect) success flow, which
  // only ever routes here once Stripe has already reported success. It only
  // flips to "checking"/"failed" when we land here via a redirect-based
  // payment method and need to verify payment_intent_client_secret.
  const [paymentStatus, setPaymentStatus] = useState<"confirmed" | "checking" | "failed">("confirmed");
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("tiptop_last_booking");
      if (stored) setBooking(JSON.parse(stored));
    } catch {
      // ignore — malformed/unavailable sessionStorage, just show the generic message
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) return;

    setPaymentStatus("checking");
    loadStripe(STRIPE_ACCESS_KEY as string).then(async (stripe) => {
      if (!stripe) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      setPaymentStatus(paymentIntent?.status === "succeeded" ? "confirmed" : "failed");
    });
  }, []);

  const bookingRef = booking?.booking_id ? booking.booking_id.slice(-8).toUpperCase() : undefined;
  const isBookingPayment = !!booking; // distinguishes a paid booking from the plain "contact us" thank-you

  return (
    <section className="wt-page-hero" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div className="container">
        <div className="wt-page-hero-inner mx-auto text-center">
          <div className="wt-hero-eyebrow">
            {paymentStatus === "failed" ? "Payment Not Confirmed" : "Request Received"}
          </div>

          {paymentStatus === "failed" ? (
            <>
              <h1>We couldn&apos;t confirm your payment</h1>
              <p>
                Please check your card details and try booking again, or contact us if you believe this is a
                mistake.
              </p>
            </>
          ) : isBookingPayment ? (
            <>
              <h1>Your Transfer Has Been Booked</h1>
              <p>
                Thank you for booking online and completing the payment. Please check your email for confirmation —
                if you don&apos;t receive one, call us at {siteConfig.phoneLocalDisplay}.
              </p>
            </>
          ) : (
            <>
              <h1>Thank You</h1>
              <p>
                Thank you for contacting Wheelchair Taxi Sydney. Our booking team has received your request and will
                be in touch shortly to confirm the details of your trip.
              </p>
            </>
          )}

          {paymentStatus !== "failed" && booking && (
            <div className="max-w-[520px] w-full mx-auto my-6 text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                <FaCheckCircle className="text-2xl text-[var(--wt-blue)]" />
              </div>

              <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Booking Summary
                  </span>
                  {bookingRef && (
                    <span className="rounded-full bg-[var(--wt-blue-light)] px-3 py-1 text-xs font-bold text-[var(--wt-blue)]">
                      #{bookingRef}
                    </span>
                  )}
                </div>

                <div className="px-5">
                  <DetailRow
                    icon={<FaMapMarkerAlt className="text-[var(--wt-blue)]" />}
                    label="Pickup"
                    value={booking.pickup_address}
                  />
                  <DetailRow
                    icon={<FaMapMarkerAlt className="text-[var(--wt-accent)]" />}
                    label="Drop-off"
                    value={booking.drop_address}
                  />
                  <DetailRow
                    icon={<FaRegCalendarAlt className="text-[var(--wt-blue)]" />}
                    label="Pickup date & time"
                    value={[booking.date, booking.time].filter(Boolean).join(" ") || undefined}
                  />
                  {booking.is_return_trip && (
                    <>
                      <DetailRow
                        icon={<FaMapMarkerAlt className="text-[var(--wt-blue)]" />}
                        label="Return pickup"
                        value={booking.return_pickup_address}
                      />
                      <DetailRow
                        icon={<FaMapMarkerAlt className="text-[var(--wt-accent)]" />}
                        label="Return drop-off"
                        value={booking.return_drop_address}
                      />
                      <DetailRow
                        icon={<FaRegCalendarAlt className="text-[var(--wt-blue)]" />}
                        label="Return date & time"
                        value={[booking.return_date, booking.return_time].filter(Boolean).join(" ") || undefined}
                      />
                    </>
                  )}
                  <DetailRow
                    icon={<FaShuttleVan className="text-[var(--wt-blue)]" />}
                    label="Vehicle"
                    value={booking.vehicle_name}
                  />
                  <DetailRow
                    icon={<FaUserFriends className="text-[var(--wt-blue)]" />}
                    label="Passengers"
                    value={booking.passenger}
                  />
                </div>

                {!!booking.amount && (
                  <div className="flex items-center justify-between bg-[var(--wt-blue-light)] px-5 py-4">
                    <span className="text-sm font-semibold text-slate-700">Amount paid</span>
                    <span className="text-lg font-bold text-[var(--wt-blue)]">
                      AUD ${Number(booking.amount).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="wt-page-hero-actions justify-center">
            <Link href="/" className="wt-btn wt-btn-primary">
              Back to Home
            </Link>
            <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-outline-inverted">
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
