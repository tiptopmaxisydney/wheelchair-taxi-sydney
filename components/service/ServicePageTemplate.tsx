import ServiceHero from "./ServiceHero";
import SplitSection from "@/components/home/SplitSection";
import FeatureGrid from "./FeatureGrid";
import RelatedLinks from "./RelatedLinks";
import ServiceAreas from "@/components/home/ServiceAreas";
import Faq from "@/components/home/Faq";
import FinalCta from "@/components/home/FinalCta";
import JsonLd from "@/components/JsonLd";
import { webPageJsonLd, breadcrumbJsonLd, faqPageJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/siteConfig";
import type { ServicePage } from "@/lib/servicePages";

export default function ServicePageTemplate({ page }: { page: ServicePage }) {
  const url = `${siteConfig.url}/${page.slug}/`;

  return (
    <>
      <JsonLd data={webPageJsonLd({ url, name: page.metaTitle, description: page.metaDescription })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: siteConfig.url }, { name: page.navLabel || page.h1, url }])} />
      <JsonLd data={serviceJsonLd({ name: page.h1, description: page.heroDescription, url })} />
      {page.faq.length > 0 && <JsonLd data={faqPageJsonLd(page.faq)} />}

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

      {page.contentSections.map((section, i) => (
        <section className="wt-section" key={i}>
          <div className="container">
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs.map((p, pi) => (
              <p key={pi}>{p}</p>
            ))}
            {section.bulletList.length > 0 && (
              <ul>
                {section.bulletList.map((item, li) => (
                  <li key={li}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <FeatureGrid eyebrow="Why Choose Us" title="What to Expect From Our Service" features={page.features} />

      {page.relatedLinks.length > 0 && <RelatedLinks title="You Might Also Need" items={page.relatedLinks} />}

      <Faq columns={[page.faq]} title="Frequently Asked Questions" eyebrow="Questions" />

      <ServiceAreas />
      <FinalCta />
    </>
  );
}
