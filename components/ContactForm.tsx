"use client";

import { useState } from "react";
import { FaPhoneAlt, FaRegEnvelope, FaWhatsapp } from "react-icons/fa";
import { sendContactMessage, type ContactPayload } from "@/lib/contactApi";
import { siteConfig } from "@/lib/siteConfig";
import CountryCode from "@/booking-widget/utils/countryCode.json";

// Same de-duplication as the booking widget's Step4YourDetails (e.g. +1 US/Canada).
const dialCodes = CountryCode.filter(
  (item, index, self) => index === self.findIndex((t) => t.dial_code === item.dial_code)
);

const DEFAULT_DIAL_CODE = "+61";

const emptyForm: ContactPayload = { name: "", email: "", phone: "", service: "", message: "" };

type ContactFormProps = {
  services: string[];
  /** Rendered as the page's h1 — the form is the first section on the contact page. */
  title: string;
};

export default function ContactForm({ services, title }: ContactFormProps) {
  const [form, setForm] = useState<ContactPayload>(emptyForm);
  const [dialCode, setDialCode] = useState(DEFAULT_DIAL_CODE);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      // The backend only has a single `phone` field, so the dial code travels with it.
      await sendContactMessage({ ...form, phone: `${dialCode} ${form.phone.trim()}` });
      setForm(emptyForm);
      setDialCode(DEFAULT_DIAL_CODE);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="wt-section on-light" id="contact-form">
      <div className="container">
        <div className="wt-contact-grid">
          <div className="wt-contact-intro">
            <span className="wt-eyebrow">Get In Touch Now</span>
            <h1 className="wt-contact-title">{title}</h1>
            <p>
              Send us your trip details or question and our team will get back to you as soon as possible. For urgent
              bookings, call us any time — we&apos;re available 24/7.
            </p>
            <ul className="wt-contact-quick">
              <li>
                <FaPhoneAlt aria-hidden="true" />
                <a href={`tel:${siteConfig.phoneLocal}`}>{siteConfig.phoneLocalDisplay}</a>
              </li>
              <li>
                <FaRegEnvelope aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li>
                <FaWhatsapp aria-hidden="true" />
                <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>

          <div className="wt-contact-card">
            {submitted ? (
              <div className="wt-contact-success" role="status">
                <h3>Thank you for contacting us.</h3>
                <p>One of our customer support agents will get back to you as soon as possible.</p>
                <p>
                  In case your inquiry is urgent, please call us on{" "}
                  <a href={`tel:${siteConfig.phoneLocal}`}>{siteConfig.phoneLocalDisplay}</a> (locals) or{" "}
                  <a href={`tel:${siteConfig.phoneIntl}`}>{siteConfig.phoneIntlDisplay}</a> (international). You can
                  also text or WhatsApp us on{" "}
                  <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
                    +61 410 025 786
                  </a>{" "}
                  or email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
                </p>
                <button type="button" className="wt-btn wt-btn-outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="wt-contact-form" onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" aria-label="Full name" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  aria-label="Email Address"
                />
                <div className="wt-contact-phone">
                  <select value={dialCode} onChange={(e) => setDialCode(e.target.value)} aria-label="Country code">
                    {dialCodes.map((country) => (
                      <option key={country.code} value={country.dial_code}>
                        {country.flag} {country.dial_code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                  />
                </div>
                <select name="service" value={form.service} onChange={handleChange} required aria-label="Type Of Service">
                  <option value="">Type Of Service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Write Your Message"
                  aria-label="Write Your Message"
                  className="wt-contact-full"
                />
                {error && (
                  <p className="wt-contact-error wt-contact-full" role="alert">
                    {error}
                  </p>
                )}
                <div className="wt-contact-full">
                  <button type="submit" disabled={loading} className="wt-btn wt-btn-primary">
                    {loading ? "Sending..." : "Submit Now"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
