import { siteConfig } from "@/lib/siteConfig";

export default function StickyCta() {
  return (
    <div className="wt-sticky-cta">
      <a href={`tel:${siteConfig.phoneIntl}`}>
        <i className="fas fa-phone-alt" aria-hidden="true" /> Call Now
      </a>
      <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp" aria-hidden="true" /> WhatsApp
      </a>
      <a href="#wcb-booking-form">
        <i className="fas fa-file-alt" aria-hidden="true" /> Quote
      </a>
    </div>
  );
}
