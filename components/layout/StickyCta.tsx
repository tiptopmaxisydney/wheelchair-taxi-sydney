import { FaPhoneAlt, FaWhatsapp, FaFileAlt, FaCalendarCheck } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";

export default function StickyCta() {
  return (
    <div className="wt-sticky-cta">
      <a href={`tel:${siteConfig.phoneIntl}`}>
        <FaPhoneAlt aria-hidden="true" /> Call Now
      </a>
      <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
        <FaWhatsapp aria-hidden="true" /> WhatsApp
      </a>
      <a href="/#tiptop-booking-form">
        <FaCalendarCheck aria-hidden="true" /> Book Now
      </a>
      <a href="/#wcb-booking-form">
        <FaFileAlt aria-hidden="true" /> Quote
      </a>
    </div>
  );
}
