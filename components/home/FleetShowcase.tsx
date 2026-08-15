import Image from "next/image";
import { fleetTypes } from "@/lib/homeData";

export default function FleetShowcase() {
  return (
    <section className="wt-section on-light">
      <div className="container">
        <span className="wt-eyebrow">Matched To Your Equipment</span>
        <h2>A Vehicle Type for Every Mobility Need</h2>
        <div className="wt-fleet-grid">
          {fleetTypes.map((fleet) => (
            <div className="wt-fleet-card" key={fleet.title}>
              <Image src={fleet.image} alt={fleet.title} width={90} height={90} loading="lazy" />
              <h4>{fleet.title}</h4>
              <p>{fleet.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
