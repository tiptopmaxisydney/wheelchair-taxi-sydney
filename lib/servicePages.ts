import type { Faq } from "./homeData";
import { cmsFindMany, cmsFindOne, mapMedia } from "./cmsClient";
import { mergeFaqs, type FaqLibraryDoc } from "./faq";
import { resolveLink, type LinkTarget } from "./links";
import type { SeoWorkflowDoc } from "./seo";

export type ServiceImage = { src: string; alt: string; width: number; height: number };
export type ContentSection = { heading?: string; paragraphs: string[]; bulletList: string[] };
export type RelatedLink = { icon: string; title: string; description: string; href: string };

export type ServicePage = SeoWorkflowDoc & {
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
  contentSections: ContentSection[];
  faq: Faq[];
  relatedLinks: RelatedLink[];
  targetKeyword?: string;
};

type CmsPageDoc = SeoWorkflowDoc & {
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
  contentSections?: Array<{ heading?: string; paragraphs?: { text: string }[]; bulletList?: { text: string }[] }>;
  faq: { question: string; answer: string }[];
  relatedFaqs?: (FaqLibraryDoc | string)[];
  relatedLinks?: Array<{ icon?: string; title: string; description: string } & LinkTarget>;
  targetKeyword?: string;
};

function mapPage(doc: CmsPageDoc): ServicePage {
  const media = mapMedia(doc.image);
  return {
    slug: doc.slug,
    seoStatus: doc.seoStatus,
    indexOverride: doc.indexOverride,
    targetKeyword: doc.targetKeyword,
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
    contentSections: (doc.contentSections ?? []).map((s) => ({
      heading: s.heading,
      paragraphs: (s.paragraphs ?? []).map((p) => p.text),
      bulletList: (s.bulletList ?? []).map((b) => b.text),
    })),
    faq: mergeFaqs(doc.faq, doc.relatedFaqs ?? []),
    relatedLinks: (doc.relatedLinks ?? []).map((r) => ({ icon: r.icon || "🔗", title: r.title, description: r.description, href: resolveLink(r) })),
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
