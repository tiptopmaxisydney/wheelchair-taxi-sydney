import type { Metadata } from "next";
import ServiceHero from "@/components/service/ServiceHero";
import SplitSection from "@/components/home/SplitSection";
import FeatureGrid from "@/components/service/FeatureGrid";
import ServiceAreas from "@/components/home/ServiceAreas";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "About Us | Wheelchair Taxi Sydney",
  description:
    "Learn about Wheelchair Taxi Sydney, our approach to accessible transport, and how we support passengers, families and organisations across Sydney.",
};

export default function AboutUsPage() {
  return (
    <>
      <ServiceHero
        eyebrow="About Us"
        title="Sydney's Dedicated Wheelchair Taxi Specialists"
        description="Accessible transport built around the needs of each passenger, from everyday trips to important appointments."
        breadcrumbLabel="About Us"
      />

      <SplitSection
        eyebrow="Our Story"
        title="Purpose-Built Accessible Transport"
        paragraphs={[
          "Wheelchair Taxi Sydney was established to provide dedicated, wheelchair accessible transport across the Sydney metropolitan area. Rather than treating accessibility as an add-on, our vehicles, booking process and driver training are all built around the needs of passengers who use wheelchairs, mobility scooters or other mobility equipment.",
          "We work with private passengers, families, aged care providers, hospitals, disability organisations and eligible NDIS participants, adapting our service to the specific requirements of each booking.",
        ]}
        image={{ src: "/images/wheelchair-taxi-booking.png", alt: "Wheelchair Taxi Sydney booking and service overview", width: 600, height: 480 }}
        imageFirst
      />

      <FeatureGrid
        eyebrow="Our Approach"
        title="What Guides Our Service"
        features={[
          {
            title: "Passenger-First Planning",
            description:
              "Every booking starts with a conversation about your wheelchair type, passenger needs and travel details, so we can allocate the right vehicle.",
          },
          {
            title: "Trained, Respectful Drivers",
            description:
              "Our drivers are trained in safe wheelchair loading, correct restraint use and providing respectful assistance throughout the journey.",
          },
          {
            title: "Maintained, Accessible Fleet",
            description:
              "Our vehicles are regularly maintained and set up to comply with applicable NSW transport and safety requirements.",
          },
        ]}
      />

      <SplitSection
        title="Who We Work With"
        paragraphs={["We proudly provide accessible transport for a wide range of passengers and organisations across Sydney, including:"]}
        items={[
          "Private individuals and families",
          "Older Australians and aged care residents",
          "Hospital patients and medical facilities",
          "Disability support organisations",
          "Eligible NDIS participants, depending on plan management arrangements",
          "Corporate clients and event organisers",
        ]}
        image={{ src: "/images/organisations-and-customers-we-assist.webp", alt: "Organisations and customers Wheelchair Taxi Sydney assists", width: 600, height: 400 }}
        background="light"
      />

      <ServiceAreas />
      <FinalCta />
    </>
  );
}
