import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaMapMarkerAlt, FaRegEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";
import { footerServices, footerLinks } from "@/lib/homeData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="wt-footer">
      <div className="container">
        <div className="wt-footer-grid">
          <div>
            <Image src="/images/logo-new.png" alt={siteConfig.searchName} width={180} height={42} />
            <p style={{ marginTop: 16, marginBottom: 6, fontWeight: 700, color: "#fff" }}>{siteConfig.name}</p>
            <p style={{ fontSize: "0.88rem" }}>
              Safe and reliable wheelchair accessible transport across Sydney for medical appointments, hospitals,
              airport transfers, aged care, NDIS-related travel and everyday journeys.
            </p>
            <p style={{ fontSize: "0.8rem" }}>Registered Business Name: {siteConfig.name}</p>
            <div className="wt-footer-socials">
              <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" />
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <FaYoutube aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3>Services</h3>
            <ul>
              {footerServices.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Useful Links</h3>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Head Office</h3>
            <ul className="wt-footer-contact">
              <li>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>
                  {siteConfig.address.street}, {siteConfig.address.locality} {siteConfig.address.region}{" "}
                  {siteConfig.address.postcode}
                </span>
              </li>
              <li>
                <FaRegEnvelope aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li>
                <FaPhoneAlt aria-hidden="true" />
                <a href={`tel:${siteConfig.phoneIntl}`}>{siteConfig.phoneIntlDisplay}</a>
              </li>
              <li>
                <FaWhatsapp aria-hidden="true" />
                <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="wt-footer-disclaimer">
          <p>
            {siteConfig.searchName} operates under the registered business name {siteConfig.name}.
          </p>
          <p>
            {siteConfig.searchName} does not currently accept payments through the NSW Taxi Transport Subsidy Scheme
            (TTSS). If you require transport through TTSS, another government subsidy program, or an approved payment
            arrangement, please confirm eligibility and accepted payment methods before booking.
          </p>
          <p>
            Bookings may be fulfilled by suitably authorised and accredited drivers and wheelchair accessible vehicles
            operating in accordance with applicable NSW transport laws and regulations. Vehicle type, operator and
            branding may vary depending on availability and passenger requirements.
          </p>
        </div>
      </div>

      <div className="wt-footer-bottom">
        Copyright © {year} {siteConfig.legalName} Pty Ltd
      </div>
    </footer>
  );
}
