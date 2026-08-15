import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ServiceHero from "@/components/service/ServiceHero";
import { blogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog | Wheelchair Taxi Sydney",
  description: "News, guides and helpful information about wheelchair accessible transport, NDIS travel and aged care transfers in Sydney.",
};

export default function BlogPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Blog"
        title="News & Guides"
        description="Helpful articles about wheelchair accessible transport, NDIS travel and aged care transfers across Sydney."
        breadcrumbLabel="Blog"
      />

      <section className="wt-section">
        <div className="container">
          <div className="wt-blog-grid">
            {blogPosts.map((post) => (
              <Link href={`/${post.slug}/`} key={post.slug} className="wt-blog-card">
                <Image src={post.image.src} alt={post.image.alt} width={400} height={225} style={{ width: "100%", height: "auto" }} />
                <div className="wt-blog-card-body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
