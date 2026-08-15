import type { Metadata } from "next";
import ServiceHero from "@/components/service/ServiceHero";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact Us | Wheelchair Taxi Sydney",
  description: "Contact Wheelchair Taxi Sydney by phone, email or WhatsApp to book accessible transport or ask a question.",
};

export default function ContactUsPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Reach our booking team by phone, email or WhatsApp for accessible transport across Sydney."
        breadcrumbLabel="Contact Us"
      />

      <section className="wt-section">
        <div className="container">
          <div className="wt-grid-3">
            <div className="wt-card">
              <h3>
                <i className="fas fa-phone-alt" aria-hidden="true" style={{ marginRight: 8, color: "var(--wt-blue)" }} /> Phone
              </h3>
              <p>
                <a href={`tel:${siteConfig.phoneIntl}`}>{siteConfig.phoneIntlDisplay}</a>
                <br />
                <a href={`tel:${siteConfig.phoneLocal}`}>{siteConfig.phoneLocalDisplay}</a>
              </p>
            </div>
            <div className="wt-card">
              <h3>
                <i className="far fa-envelope" aria-hidden="true" style={{ marginRight: 8, color: "var(--wt-blue)" }} /> Email
              </h3>
              <p>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
            </div>
            <div className="wt-card">
              <h3>
                <i className="fab fa-whatsapp" aria-hidden="true" style={{ marginRight: 8, color: "var(--wt-blue)" }} /> WhatsApp
              </h3>
              <p>
                <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
                  Message us on WhatsApp
                </a>
              </p>
            </div>
          </div>

          <div style={{ marginTop: 48, maxWidth: 700 }}>
            <span className="wt-eyebrow">Head Office</span>
            <h2>Visit or Write to Us</h2>
            <p>
              {siteConfig.address.street}, {siteConfig.address.locality} {siteConfig.address.region} {siteConfig.address.postcode},{" "}
              {siteConfig.address.country}
            </p>
            <p>
              For booking enquiries, please include your pickup and destination, wheelchair or mobility device type, preferred pickup
              time and number of passengers so our team can respond with an accurate quote.
            </p>
            <a href="/#wcb-booking-form" className="wt-btn wt-btn-primary">
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
