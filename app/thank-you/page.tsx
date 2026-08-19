import type { Metadata } from "next";
import ThankYouContent from "@/booking-widget/components/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You | Wheelchair Taxi Sydney",
  description: "Thank you for contacting Wheelchair Taxi Sydney. Our team will be in touch shortly.",
  alternates: { canonical: "/thank-you/" },
  robots: { index: false, follow: true },
};

// Also the Stripe redirect target for the booking widget's payment step
// (see StripeCheckOutForm.tsx) — ThankYouContent detects that case client-side
// (payment_intent_client_secret in the URL + a stored booking summary) and
// renders booking details instead of the generic "thanks for contacting us" copy.
export default function ThankYouPage() {
  return <ThankYouContent />;
}
