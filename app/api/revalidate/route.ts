import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the content-hub CMS after a page/post is published, so the edit shows up
// without waiting for the hourly ISR revalidation in lib/cmsClient.ts.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("pages", "max");
  revalidateTag("blog-posts", "max");
  revalidatePath("/");
  revalidatePath("/blog");

  const slug = request.nextUrl.searchParams.get("slug");
  if (slug) revalidatePath(`/${slug}`);

  return NextResponse.json({ revalidated: true });
}
