import type { Faq } from "./homeData";
import { cmsFindMany, cmsFindOne, mapMedia } from "./cmsClient";

export type ServiceImage = { src: string; alt: string; width: number; height: number };

export type ServicePage = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  image: ServiceImage;
  imageFirst?: boolean;
  intro: string[];
  introItemsIntro?: string;
  introItems?: string[];
  features: { title: string; description: string }[];
  faq: Faq[];
};

type CmsPageDoc = {
  slug: string;
  navLabel?: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow?: string;
  h1: string;
  heroDescription: string;
  image: unknown;
  imageFirst?: boolean;
  intro: { text: string }[];
  introItemsIntro?: string;
  introItems?: { text: string }[];
  features: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
};

function mapPage(doc: CmsPageDoc): ServicePage {
  const media = mapMedia(doc.image);
  return {
    slug: doc.slug,
    navLabel: doc.navLabel ?? "",
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    eyebrow: doc.eyebrow ?? "",
    h1: doc.h1,
    heroDescription: doc.heroDescription,
    image: { src: media.url, alt: media.alt, width: media.width, height: media.height },
    imageFirst: doc.imageFirst,
    intro: doc.intro.map((p) => p.text),
    introItemsIntro: doc.introItemsIntro,
    introItems: doc.introItems?.map((i) => i.text),
    features: doc.features,
    faq: doc.faq,
  };
}

export async function getServicePages(): Promise<ServicePage[]> {
  const docs = await cmsFindMany<CmsPageDoc>("pages");
  return docs.map(mapPage);
}

export async function getServicePage(slug: string): Promise<ServicePage | undefined> {
  const doc = await cmsFindOne<CmsPageDoc>("pages", slug);
  return doc ? mapPage(doc) : undefined;
}
