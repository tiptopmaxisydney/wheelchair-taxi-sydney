import type { Metadata } from "next";
import ServiceHero from "@/components/service/ServiceHero";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Cookie Policy | Wheelchair Taxi Sydney",
  description: "Cookie Policy for the Wheelchair Taxi Sydney website, operated by " + siteConfig.legalName + " Pty Ltd.",
  alternates: { canonical: "/cookie-policy/" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="How this website uses cookies to support functionality and understand how it is used."
        breadcrumbLabel="Cookie Policy"
      />

      <section className="wt-section">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <p style={{ color: "var(--wt-muted)", fontSize: "0.85rem" }}>
              This page provides a general outline of how cookies may be used on this website. It is intended as general information and
              should be reviewed and confirmed against our current, complete cookie policy.
            </p>

            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help the website function correctly, remember
              your preferences and provide information about how the site is used.
            </p>

            <h2>How We Use Cookies</h2>
            <p>This website may use cookies for purposes such as:</p>
            <ul>
              <li>Enabling core website functionality, such as the booking form</li>
              <li>Understanding how visitors use the website, to help us improve it</li>
              <li>Remembering preferences between visits</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings, including blocking or deleting cookies. Please note
              that disabling cookies may affect the functionality of some parts of this website, such as the online booking form.
            </p>

            <h2>Contact Us</h2>
            <p>
              For questions about this policy, please contact us at <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
