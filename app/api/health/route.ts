import { NextResponse } from "next/server";
import { SITE_KEY } from "@/lib/monitoring";

// Health check for external uptime monitoring (Better Stack).
//
// Always answers 200 while this Next.js process is up, so "site down" and "a dependency is
// down" stay distinguishable. Point the uptime monitor at this URL with a keyword check for
// `"status":"ok"` to also alert when the CMS or the booking API stops responding.

type CheckResult = "ok" | "down" | "not-configured";

async function probe(url: string | undefined): Promise<CheckResult> {
  if (!url) return "not-configured";
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4000) });
    // Any non-5xx answer means the service is reachable (the API root itself may 404).
    return res.status < 500 ? "ok" : "down";
  } catch {
    return "down";
  }
}

export async function GET() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL;
  const [cms, bookingApi] = await Promise.all([
    // Sites is publicly readable in content-hub, so this needs no credentials.
    probe(cmsUrl ? `${cmsUrl.replace(/\/$/, "")}/api/sites?limit=1&depth=0` : undefined),
    probe(process.env.NEXT_PUBLIC_API_ROOT),
  ]);

  return NextResponse.json(
    {
      status: cms === "down" || bookingApi === "down" ? "degraded" : "ok",
      site: SITE_KEY,
      checks: { cms, bookingApi },
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
