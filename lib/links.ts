export type ResolvableLocation = {
  slug?: string;
  locationType?: string;
  parentRegion?: { slug?: string } | string | null;
};

export type LinkTarget = {
  targetPage?: { slug?: string } | string | null;
  targetLocation?: ResolvableLocation | string | null;
  href?: string;
};

function locationHref(location: ResolvableLocation): string {
  if (location.locationType === "suburb" && location.parentRegion && typeof location.parentRegion === "object" && location.parentRegion.slug) {
    return `/locations/${location.parentRegion.slug}/${location.slug}/`;
  }
  return `/locations/${location.slug}/`;
}

/** Prefers a relationship target (stays correct if the target's slug changes) over the free-text href fallback. */
export function resolveLink(link: LinkTarget): string {
  if (link.targetPage && typeof link.targetPage === "object" && link.targetPage.slug) {
    return `/${link.targetPage.slug}/`;
  }
  if (link.targetLocation && typeof link.targetLocation === "object" && link.targetLocation.slug) {
    return locationHref(link.targetLocation);
  }
  return link.href ?? "#";
}
