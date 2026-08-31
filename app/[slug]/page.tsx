import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "@/components/service/ServicePageTemplate";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate";
import { getServicePages, getServicePage } from "@/lib/servicePages";
import { getBlogPosts, getBlogPost } from "@/lib/blogPosts";
import { robotsMeta, isIndexableByStatus } from "@/lib/seo";

export async function generateStaticParams() {
  const [servicePages, blogPosts] = await Promise.all([getServicePages(), getBlogPosts()]);
  return [...servicePages.map((p) => ({ slug: p.slug })), ...blogPosts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const servicePage = await getServicePage(slug);
  if (servicePage) {
    return {
      title: servicePage.metaTitle,
      description: servicePage.metaDescription,
      keywords: [servicePage.navLabel, servicePage.eyebrow, "wheelchair taxi sydney", "wheelchair accessible transport"],
      alternates: { canonical: `/${slug}/` },
      robots: robotsMeta(servicePage),
    };
  }
  const post = await getBlogPost(slug);
  if (post) {
    return {
      title: post.metaTitle,
      description: post.metaDescription,
      keywords: [post.title, "wheelchair taxi sydney blog", "accessible transport"],
      alternates: { canonical: `/${slug}/` },
      robots: { index: isIndexableByStatus(post), follow: true },
    };
  }
  return {};
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const servicePage = await getServicePage(slug);
  if (servicePage) {
    return <ServicePageTemplate page={servicePage} />;
  }

  const post = await getBlogPost(slug);
  if (post) {
    return <BlogPostTemplate post={post} />;
  }

  notFound();
}
