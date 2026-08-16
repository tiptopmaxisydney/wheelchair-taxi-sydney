import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import SplitSection from "@/components/home/SplitSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FleetShowcase from "@/components/home/FleetShowcase";
import ServiceAreas from "@/components/home/ServiceAreas";
import Faq from "@/components/home/Faq";
import AppSection from "@/components/home/AppSection";
import FinalCta from "@/components/home/FinalCta";
import {
  fleetIncludes,
  wheelchairInfoPoints,
  bookingSteps,
  driverAssistance,
  organisationsWeAssist,
  faqColumns,
} from "@/lib/homeData";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Wheelchair Taxi Sydney | Accessible Wheelchair Transport Service",
  description: siteConfig.description,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqColumns.flat().map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Hero />
      <AboutSection />

      <SplitSection
        eyebrow="Our Service"
        title="Professional Wheelchair Accessible Taxi Service Sydney"
        paragraphs={[
          "A wheelchair accessible taxi requires careful planning to ensure passengers can travel safely and comfortably. At Wheelchair Taxi Sydney, we provide accessible transport solutions designed around the needs of each passenger.",
          "When you make a booking, our team confirms your requirements, including wheelchair type, passenger needs and travel details, so we can arrange a suitable vehicle for your journey.",
        ]}
        itemsIntro="Our service includes:"
        items={fleetIncludes}
        image={{ src: "/images/space-for-carers-and-family-members.webp", alt: "Interior of wheelchair accessible taxi with extra space for carers and family members", width: 600, height: 400 }}
      />

      <WhyChooseUs />
      <HowItWorks />
      <FleetShowcase />

      <SplitSection
        title="Sydney Airport Wheelchair Taxi Transfers"
        eyebrow="Airport Transfers"
        paragraphs={[
          "Airport travel can be challenging when passengers require wheelchair assistance. Our wheelchair airport transfer service helps passengers travel between Sydney's international and domestic terminals, homes, hotels, hospitals and aged care facilities.",
          "When booking an airport wheelchair taxi, please provide your pickup location, flight details, number of passengers, wheelchair type and amount of luggage so we can arrange the most suitable vehicle for your journey.",
        ]}
        image={{ src: "/images/wheelchair-taxi-sydney.jpg", alt: "Wheelchair taxi Sydney", width: 600, height: 483 }}
        imageFirst
      />

      <SplitSection
        title="Hospital and Medical Wheelchair Transport Sydney"
        eyebrow="Medical Transport"
        paragraphs={[
          "Attending medical appointments is an important part of everyday life for many passengers. We provide wheelchair transport for trips to hospitals, medical centres, rehabilitation facilities, specialist appointments and allied health providers.",
          "Whether it is a single appointment or regular transport, our team can assist with planning your journey.",
        ]}
        image={{ src: "/images/nursing-home-transfer.jpg", alt: "Nursing home transfer", width: 600, height: 400 }}
        background="light"
      />

      <SplitSection
        title="NDIS Wheelchair Transport Sydney"
        eyebrow="NDIS Transport"
        paragraphs={[
          "Wheelchair Taxi Sydney provides accessible transport options for NDIS participants across Sydney. We support passengers travelling for NDIS appointments, therapy sessions, community participation, education, employment and social activities.",
          "Our team can discuss your transport requirements and help organise a suitable wheelchair accessible vehicle.",
        ]}
        image={{ src: "/images/aged-care-home-transfers.png", alt: "Aged care home transfers", width: 600, height: 397 }}
        imageFirst
      />

      <SplitSection
        title="Aged Care and Nursing Home Wheelchair Transfers Sydney"
        eyebrow="Aged & Disability Care"
        paragraphs={[
          "Transport from aged care facilities requires understanding, patience and reliable coordination. We assist elderly passengers travelling from aged care homes, nursing homes, retirement villages and supported accommodation facilities.",
          "Common trips include doctor appointments, hospital visits, family gatherings, community activities and personal appointments. We understand that elderly passengers may need additional time and assistance during pickup and drop-off.",
        ]}
        image={{ src: "/images/what-is-ndis.webp", alt: "NDIS wheelchair transport Sydney", width: 600, height: 320 }}
        background="light"
      />

      <SplitSection
        eyebrow="Wheelchair Information That Helps Us Prepare"
        title="Providing your wheelchair details when booking allows us to dispatch the most suitable vehicle"
        itemsIntro="Helpful information includes:"
        items={wheelchairInfoPoints}
        image={{ src: "/images/what-is-ndis.webp", alt: "Wheelchair information", width: 600, height: 320 }}
        imageFirst
      />

      <SplitSection
        title="Simple Booking Process"
        paragraphs={["Booking your wheelchair accessible transport is straightforward."]}
        numbered
        items={bookingSteps}
        image={{ src: "/images/maxi-van.png", alt: "Maxi van wheelchair taxi", width: 604, height: 310 }}
        background="light"
      />

      <SplitSection
        title="Professional Drivers Focused on Accessible Transport"
        paragraphs={[
          "Our drivers understand that every passenger has different mobility requirements. They aim to provide respectful assistance while helping passengers travel comfortably and confidently.",
        ]}
        itemsIntro="Depending on your requirements, assistance may include:"
        items={driverAssistance}
        image={{ src: "/images/accessible-van-assistance.webp", alt: "Accessible van assistance", width: 600, height: 400 }}
        imageFirst
      />

      <SplitSection
        title="Organisations and Customers We Assist"
        paragraphs={["We proudly provide transport for a wide range of customers across Sydney, including:"]}
        items={organisationsWeAssist}
        image={{ src: "/images/organisations-and-customers-we-assist.webp", alt: "Organisations and customers we assist", width: 600, height: 400 }}
        background="light"
      />

      <ServiceAreas />
      <Faq />
      <AppSection />
      <FinalCta />
    </>
  );
}
