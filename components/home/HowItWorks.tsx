import { howItWorks } from "@/lib/homeData";

export default function HowItWorks() {
  return (
    <section className="wt-section">
      <div className="container">
        <span className="wt-eyebrow">How It Works</span>
        <h2>How We Assist You Throughout Your Journey</h2>
        <p style={{ maxWidth: 760 }}>
          From the moment your booking is confirmed until you reach your destination, our team follows a structured
          process designed to provide a smooth and comfortable experience.
        </p>
        <div className="wt-steps">
          {howItWorks.map((step) => (
            <div className="wt-step" key={step.step}>
              <div className="wt-step-num">{step.step}</div>
              <h3>{step.title}</h3>
              {step.intro && <p>{step.intro}</p>}
              <ul>
                {step.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
