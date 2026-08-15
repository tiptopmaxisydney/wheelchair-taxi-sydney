import { serviceAreas } from "@/lib/homeData";

export default function ServiceAreas() {
  return (
    <section className="wt-section">
      <div className="container">
        <span className="wt-eyebrow">Where We Drive</span>
        <h2>Areas We Service Across Sydney</h2>
        <p style={{ maxWidth: 900 }}>
          Wheelchair Taxi Sydney provides accessible transport throughout Sydney, including Sydney CBD, Eastern
          Suburbs, Western Sydney, Northern Sydney, Southern Sydney, Inner West, Parramatta, Blacktown, Liverpool,
          Penrith, Campbelltown, Bankstown and surrounding Sydney suburbs. We also provide longer-distance wheelchair
          transport depending on passenger requirements and vehicle availability.
        </p>
        <div className="wt-areas-grid">
          {serviceAreas.map((area) => (
            <div className="wt-area-card" key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
