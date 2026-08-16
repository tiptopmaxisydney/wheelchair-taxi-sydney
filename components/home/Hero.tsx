import { FaPhoneAlt } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";
import BookingForm from "./BookingForm";

export default function Hero() {
  return (
    <section className="wt-hero">
      <div className="container">
        <div className="wt-hero-grid">
          <div>
            <div className="wt-hero-eyebrow">Sydney&apos;s Accessible Transport Specialist</div>
            <h1>Wheelchair Taxi Sydney - Safe and Reliable Accessible Transport</h1>
            <p>
              Professional wheelchair accessible taxi services with trained drivers, safe wheelchair loading, and
              comfortable transport for medical appointments, airports, hospitals and everyday travel.
            </p>
            <div className="wt-hero-actions">
              <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-primary">
                <FaPhoneAlt aria-hidden="true" /> Call Us
              </a>
            </div>
          </div>
          <div>
            <BookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
