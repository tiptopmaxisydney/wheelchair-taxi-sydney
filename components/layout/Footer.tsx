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
            <Image src="/images/logo-new.png" alt={siteConfig.name} width={180} height={42} />
            <p style={{ marginTop: 16, fontSize: "0.88rem" }}>
              Safe, accessible wheelchair transport across Sydney, for hospitals, airports, NDIS travel and everyday
              life.
            </p>
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

        <p className="wt-footer-disclaimer">
          Disclaimer: Wheelchair Taxi Sydney is a website operated by {siteConfig.legalName} Pty Ltd, an authorised
          transport booking service provider. Wheelchair Taxi Sydney does not accept the NSW Taxi Transport Subsidy
          Scheme (TTSS) at this stage. If you require transport assistance through a government subsidy program or
          another approved payment scheme, please confirm eligibility and accepted payment methods when booking.
          Bookings may be fulfilled by suitably authorised and accredited drivers and vehicles operating under
          applicable NSW transport laws and regulations. Vehicle type, operator and branding may vary depending on
          availability.
        </p>
      </div>

      <div className="wt-footer-bottom">
        Copyright © {year} {siteConfig.legalName} Pty Ltd
      </div>
    </footer>
  );
}
