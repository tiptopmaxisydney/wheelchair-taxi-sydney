import { siteConfig } from "@/lib/siteConfig";

export default function FinalCta() {
  return (
    <section className="wt-section">
      <div className="container">
        <div className="wt-final-cta">
          <h2>Need Assistance or Have Feedback?</h2>
          <p>
            We are committed to providing reliable and professional customer service. If you have questions about an
            upcoming booking, require additional assistance or would like to provide feedback after your journey,
            our customer support team is available to help.
          </p>
          <div className="wt-final-actions">
            <a href={`mailto:${siteConfig.email}`} className="wt-btn wt-btn-primary">
              Email Us
            </a>
            <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-outline-inverted">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
