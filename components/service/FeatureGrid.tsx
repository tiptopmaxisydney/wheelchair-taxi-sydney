type Feature = { title: string; description: string };

type FeatureGridProps = {
  eyebrow: string;
  title: string;
  features: Feature[];
  background?: "white" | "light";
};

export default function FeatureGrid({ eyebrow, title, features, background = "light" }: FeatureGridProps) {
  return (
    <section className={`wt-section${background === "light" ? " on-light" : ""}`}>
      <div className="container">
        <span className="wt-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <div className="wt-grid-3">
          {features.map((feature) => (
            <div className="wt-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
