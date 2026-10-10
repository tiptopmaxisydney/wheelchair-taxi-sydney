import Image from "next/image";
import { FaGoogle, FaStar } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";

// Accessible Wheelchair Transport Sydney's own Google Business Profile — never TipTop Maxi Sydney's.
export const GOOGLE_REVIEW_LINK = "https://share.google/XwCsRiZjKtHRvr84b";
const QR_SRC = "/images/google-review-qr.png";

const THANK_YOU_TEXT = `Thank you for choosing ${siteConfig.name}. Your feedback helps us improve our accessible transport services and provide a better experience for our passengers and their families.`;

type Props = {
  // "section": full-width page section (home page)
  // "card": compact card for the thank-you / booking confirmation page
  // "footer": small block inside the dark footer
  variant?: "section" | "card" | "footer";
};

function ReviewButton({ small = false }: { small?: boolean }) {
  return (
    <a
      href={GOOGLE_REVIEW_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`wt-btn wt-btn-primary wt-review-btn${small ? " wt-review-btn-sm" : ""}`}
    >
      <FaGoogle aria-hidden="true" /> Leave a Google Review
    </a>
  );
}

function Qr({ size }: { size: number }) {
  return (
    <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="wt-review-qr" aria-label="Open our Google Review page">
      <Image src={QR_SRC} alt={`Scan to review ${siteConfig.name} on Google`} width={size} height={size} />
    </a>
  );
}

export default function GoogleReview({ variant = "section" }: Props) {
  if (variant === "footer") {
    return (
      <div className="wt-review-footer">
        <h3>Review Us on Google</h3>
        <div className="wt-review-footer-row">
          <Qr size={96} />
          <div>
            <p>Travelled with us? We&apos;d love your feedback.</p>
            <ReviewButton small />
          </div>
        </div>
      </div>
    );
  }

  const stars = (
    <div className="wt-review-stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
  );

  if (variant === "card") {
    return (
      <div className="wt-review-card">
        <div className="wt-review-copy">
          {stars}
          <h2>How was your journey?</h2>
          <p>{THANK_YOU_TEXT}</p>
          <ReviewButton />
        </div>
        <div className="wt-review-qr-wrap">
          <Qr size={150} />
          <span>Scan with your phone camera</span>
        </div>
      </div>
    );
  }

  return (
    <section className="wt-section on-light" aria-labelledby="google-review-heading">
      <div className="container">
        <div className="wt-review-card wt-review-card-lg">
          <div className="wt-review-copy">
            {stars}
            <h2 id="google-review-heading">Share Your Experience on Google</h2>
            <p>{THANK_YOU_TEXT}</p>
            <ReviewButton />
          </div>
          <div className="wt-review-qr-wrap">
            <Qr size={180} />
            <span>Scan with your phone camera to leave a review</span>
          </div>
        </div>
      </div>
    </section>
  );
}
