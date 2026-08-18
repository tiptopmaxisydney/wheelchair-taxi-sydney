// Thin client for the shared content-hub CMS (Payload). Every site fetches only its own
// docs, scoped server-side via `where[site.key][equals]=<SITE_KEY>` - the hub serves all
// four sites from one API, keyed by the `sites` collection.
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3001";
const SITE_KEY = "wheelchair";

// How long a page is cached before Next.js silently revalidates it in the background.
// The CMS also pings /api/revalidate on publish for near-immediate updates - this is the fallback.
const REVALIDATE_SECONDS = 3600;

export type CmsMedia = { url: string; alt: string; width: number; height: number };

type PayloadListResponse<T> = { docs: T[] };

async function cmsFetch<T>(path: string, searchParams: Record<string, string>): Promise<T> {
  const url = new URL(`/api/${path}`, CMS_URL);
  for (const [key, value] of Object.entries(searchParams)) url.searchParams.set(key, value);

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: [path] } });
  if (!res.ok) throw new Error(`CMS request failed: ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export async function cmsFindMany<T>(collection: string, extraWhere: Record<string, string> = {}): Promise<T[]> {
  const where: Record<string, string> = { "where[site.key][equals]": SITE_KEY, depth: "2", limit: "200" };
  for (const [k, v] of Object.entries(extraWhere)) where[k] = v;
  const data = await cmsFetch<PayloadListResponse<T>>(collection, where);
  return data.docs;
}

export async function cmsFindOne<T>(collection: string, slug: string): Promise<T | undefined> {
  const docs = await cmsFindMany<T>(collection, { "where[slug][equals]": slug, limit: "1" });
  return docs[0];
}

export function mapMedia(media: unknown): CmsMedia {
  const doc = media as { url?: string; alt?: string; width?: number; height?: number } | null;
  const rawUrl = doc?.url ?? "";
  return {
    url: rawUrl.startsWith("http") ? rawUrl : `${CMS_URL}${rawUrl}`,
    alt: doc?.alt ?? "",
    width: doc?.width ?? 800,
    height: doc?.height ?? 533,
  };
}
