import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";

type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
};

export default function ServiceHero({ eyebrow, title, description, breadcrumbLabel }: ServiceHeroProps) {
  return (
    <section className="wt-page-hero">
      <div className="container">
        <div className="wt-page-hero-inner">
          <div className="wt-breadcrumb">
            <Link href="/">Home</Link> / {breadcrumbLabel}
          </div>
          <div className="wt-hero-eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="wt-page-hero-actions">
            <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-primary">
              <FaPhoneAlt aria-hidden="true" /> Call Us
            </a>
            <a href="/#wcb-booking-form" className="wt-btn wt-btn-outline-inverted">
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
