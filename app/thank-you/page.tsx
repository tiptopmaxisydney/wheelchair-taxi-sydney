import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Thank You | Wheelchair Taxi Sydney",
  description: "Thank you for contacting Wheelchair Taxi Sydney. Our team will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <section className="wt-page-hero" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div className="container">
        <div className="wt-page-hero-inner">
          <div className="wt-hero-eyebrow">Request Received</div>
          <h1>Thank You</h1>
          <p>
            Thank you for contacting Wheelchair Taxi Sydney. Our booking team has received your request and will be in touch shortly to
            confirm the details of your trip.
          </p>
          <div className="wt-page-hero-actions">
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
