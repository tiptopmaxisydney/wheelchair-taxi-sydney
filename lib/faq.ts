import type { Faq } from "./homeData";

export type FaqLibraryDoc = { question?: string; answer?: string };

/** Combines a page's own FAQs with tagged library FAQs pulled in via relatedFaqs, deduped by question text. */
export function mergeFaqs(embedded: Faq[], library: (FaqLibraryDoc | string)[] = []): Faq[] {
  const merged = [...embedded];
  const seen = new Set(embedded.map((f) => f.question.trim().toLowerCase()));

  for (const doc of library) {
    if (typeof doc === "string" || !doc.question || !doc.answer) continue;
    const key = doc.question.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ question: doc.question, answer: doc.answer });
  }

  return merged;
}
