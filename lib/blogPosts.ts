import { cmsFindMany, cmsFindOne, mapMedia } from "./cmsClient";

export type BlogSection = { heading?: string; paragraphs: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  image: { src: string; alt: string; width: number; height: number };
  sections: BlogSection[];
};

type CmsBlogPostDoc = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  image: unknown;
  sections: { heading?: string; paragraphs: { text: string }[] }[];
};

function mapPost(doc: CmsBlogPostDoc): BlogPost {
  const media = mapMedia(doc.image);
  return {
    slug: doc.slug,
    title: doc.title,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    excerpt: doc.excerpt,
    date: doc.date,
    image: { src: media.url, alt: media.alt, width: media.width, height: media.height },
    sections: doc.sections.map((s) => ({ heading: s.heading, paragraphs: s.paragraphs.map((p) => p.text) })),
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const docs = await cmsFindMany<CmsBlogPostDoc>("blog-posts", { sort: "-date" });
  return docs.map(mapPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const doc = await cmsFindOne<CmsBlogPostDoc>("blog-posts", slug);
  return doc ? mapPost(doc) : undefined;
}
