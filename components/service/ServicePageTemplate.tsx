import ServiceHero from "./ServiceHero";
import SplitSection from "@/components/home/SplitSection";
import FeatureGrid from "./FeatureGrid";
import ServiceAreas from "@/components/home/ServiceAreas";
import Faq from "@/components/home/Faq";
import FinalCta from "@/components/home/FinalCta";
import type { ServicePage } from "@/lib/servicePages";

export default function ServicePageTemplate({ page }: { page: ServicePage }) {
  return (
    <>
      <ServiceHero eyebrow={page.eyebrow} title={page.h1} description={page.heroDescription} breadcrumbLabel={page.navLabel} />

      <SplitSection
        eyebrow={page.eyebrow}
        title={page.h1}
        paragraphs={page.intro}
        itemsIntro={page.introItemsIntro}
        items={page.introItems}
        image={page.image}
        imageFirst={page.imageFirst}
      />

      <FeatureGrid eyebrow="Why Choose Us" title="What to Expect From Our Service" features={page.features} />

      <Faq columns={[page.faq]} title="Frequently Asked Questions" eyebrow="Questions" />

      <ServiceAreas />
      <FinalCta />
    </>
  );
}
