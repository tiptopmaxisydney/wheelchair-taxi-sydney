import { whyChooseUs } from "@/lib/homeData";

export default function WhyChooseUs() {
  return (
    <section className="wt-section on-light">
      <div className="container">
        <span className="wt-eyebrow">Why Choose Us</span>
        <h2>Why Choose Our Wheelchair Taxi Service?</h2>
        <div className="wt-grid-3">
          {whyChooseUs.map((item) => (
            <div className="wt-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
