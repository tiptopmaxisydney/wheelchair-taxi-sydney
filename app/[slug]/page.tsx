import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "@/components/service/ServicePageTemplate";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate";
import { servicePages, getServicePage } from "@/lib/servicePages";
import { blogPosts, getBlogPost } from "@/lib/blogPosts";

export function generateStaticParams() {
  return [...servicePages.map((p) => ({ slug: p.slug })), ...blogPosts.map((p) => ({ slug: p.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const servicePage = getServicePage(slug);
  if (servicePage) {
    return { title: servicePage.metaTitle, description: servicePage.metaDescription };
  }
  const post = getBlogPost(slug);
  if (post) {
    return { title: post.metaTitle, description: post.metaDescription };
  }
  return {};
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const servicePage = getServicePage(slug);
  if (servicePage) {
    return <ServicePageTemplate page={servicePage} />;
  }

  const post = getBlogPost(slug);
  if (post) {
    return <BlogPostTemplate post={post} />;
  }

  notFound();
}
