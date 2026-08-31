import type { Metadata } from "next";

export type SeoWorkflowDoc = {
  seoStatus?: "draft" | "review" | "approved" | string;
  indexOverride?: "none" | "forceIndex" | "forceNoindex" | string;
};

export type QualityCheckDoc = {
  metaTitle?: string;
  metaDescription?: string;
  /** Pages use h1, Locations use name - qualityGate accepts either as "the page's heading". */
  h1?: string;
  name?: string;
  heroDescription?: string;
  image?: { src?: string } | null;
  contentSections?: unknown[];
  intro?: unknown[];
};

export type QualityCheckResult = { passed: boolean; reasons: string[] };

const MIN_TITLE_LENGTH = 15;
const MIN_DESCRIPTION_LENGTH = 70;
const MIN_HERO_LENGTH = 40;

/** Structural completeness check - not a word-count/readability engine, just "is this page actually finished". */
export function qualityGate(doc: QualityCheckDoc): QualityCheckResult {
  const reasons: string[] = [];

  if (!doc.metaTitle || doc.metaTitle.trim().length < MIN_TITLE_LENGTH) reasons.push("metaTitle missing or too short");
  if (!doc.metaDescription || doc.metaDescription.trim().length < MIN_DESCRIPTION_LENGTH) reasons.push("metaDescription missing or too short");
  if (!doc.h1?.trim() && !doc.name?.trim()) reasons.push("h1/name missing");
  if (!doc.heroDescription || doc.heroDescription.trim().length < MIN_HERO_LENGTH) reasons.push("heroDescription missing or too thin");
  if (!doc.image?.src) reasons.push("image missing");

  const hasBody = (doc.contentSections?.length ?? 0) > 0 || (doc.intro?.length ?? 0) > 0;
  if (!hasBody) reasons.push("no body content (contentSections/intro both empty)");

  return { passed: reasons.length === 0, reasons };
}

/** forceIndex/forceNoindex always win; otherwise a page needs seoStatus "approved" AND a passing quality gate. */
export function isIndexable(doc: SeoWorkflowDoc & QualityCheckDoc): boolean {
  if (doc.indexOverride === "forceIndex") return true;
  if (doc.indexOverride === "forceNoindex") return false;
  return doc.seoStatus === "approved" && qualityGate(doc).passed;
}

/**
 * Same workflow rules as isIndexable, without the structural quality gate - for content shapes
 * (e.g. blog posts) that don't carry metaTitle/h1/contentSections and so can't be run through
 * qualityGate(). Use isIndexable() instead for anything Page/Location-shaped.
 */
export function isIndexableByStatus(doc: SeoWorkflowDoc): boolean {
  if (doc.indexOverride === "forceIndex") return true;
  if (doc.indexOverride === "forceNoindex") return false;
  return doc.seoStatus === "approved";
}

export function robotsMeta(doc: SeoWorkflowDoc & QualityCheckDoc): Metadata["robots"] {
  return { index: isIndexable(doc), follow: true };
}
