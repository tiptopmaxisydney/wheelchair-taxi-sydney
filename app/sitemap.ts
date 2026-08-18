import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
import { getServicePages } from "@/lib/servicePages";
import { getBlogPosts } from "@/lib/blogPosts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicePages, blogPosts] = await Promise.all([getServicePages(), getBlogPosts()]);
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/aboutus/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/contact-us/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/blog/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/privacy-policy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/cookie-policy/`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const services: MetadataRoute.Sitemap = servicePages.map((page) => ({
    url: `${siteConfig.url}/${page.slug}/`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...services, ...posts];
}
