import type { Metadata } from "next";
import ServiceHero from "@/components/service/ServiceHero";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | Wheelchair Taxi Sydney",
  description: "Privacy Policy for Wheelchair Taxi Sydney, operated by " + siteConfig.legalName + " Pty Ltd.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use and protect information provided to us when you book or enquire about our services."
        breadcrumbLabel="Privacy Policy"
      />

      <section className="wt-section">
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <p style={{ color: "var(--wt-muted)", fontSize: "0.85rem" }}>
              This page provides a general outline of how {siteConfig.legalName} Pty Ltd, operator of Wheelchair Taxi Sydney, approaches
              privacy. It is intended as general information and should be reviewed and confirmed against our current, complete privacy
              policy or by contacting us directly.
            </p>

            <h2>Information We Collect</h2>
            <p>
              When you make a booking or enquiry, we may collect information such as your name, contact details, pickup and destination
              addresses, and details about your wheelchair or mobility equipment. This information is used to arrange and provide
              accessible transport services.
            </p>

            <h2>How We Use Your Information</h2>
            <p>
              Information collected is used to process bookings, allocate suitable vehicles and drivers, communicate with you about your
              trip, and improve our services. We do not sell personal information to third parties.
            </p>

            <h2>Sharing of Information</h2>
            <p>
              Limited information may be shared with drivers or operators involved in fulfilling your booking, and where required, with
              relevant authorities or service partners such as NDIS plan managers or support coordinators, with your consent or as
              required by law.
            </p>

            <h2>Data Security</h2>
            <p>
              We take reasonable steps to protect the personal information we hold from misuse, loss and unauthorised access, use,
              modification or disclosure.
            </p>

            <h2>Your Rights</h2>
            <p>
              You may request access to, or correction of, the personal information we hold about you by contacting us using the details
              below.
            </p>

            <h2>Contact Us</h2>
            <p>
              For questions about this policy or how your information is handled, please contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
              <a href={`tel:${siteConfig.phoneIntl}`}>{siteConfig.phoneIntlDisplay}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
