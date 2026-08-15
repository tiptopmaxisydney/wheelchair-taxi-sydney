import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function AppSection() {
  return (
    <section className="wt-section">
      <div className="container">
        <div className="wt-app-wrap">
          <div>
            <span className="wt-eyebrow">Book From Your Phone</span>
            <h2>Book a Wheelchair Taxi In Seconds With Our App</h2>
            <p>
              Track your driver, save regular pickup addresses, and manage{" "}
              <Link href="/ndis-transport-sydney/">NDIS</Link> or recurring bookings from your phone &ndash;
              available on iOS and Android.
            </p>
            <div className="wt-app-buttons">
              <a href={siteConfig.apps.appStore} className="wt-app-btn" target="_blank" rel="noreferrer">
                <i className="fab fa-apple" aria-hidden="true" style={{ fontSize: "1.4rem" }} />
                <span>
                  <span className="sub">Download on the</span>iOS App Store
                </span>
              </a>
              <a href={siteConfig.apps.playStore} className="wt-app-btn" target="_blank" rel="noreferrer">
                <i className="fab fa-google-play" aria-hidden="true" style={{ fontSize: "1.3rem" }} />
                <span>
                  <span className="sub">Get it on</span>Google Play
                </span>
              </a>
            </div>
          </div>
          <div>
            <Image
              src="/images/tiptopride-app.webp"
              alt="Screens from the TipTop Ride app used to book a wheelchair taxi in Sydney"
              width={600} height={554}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
