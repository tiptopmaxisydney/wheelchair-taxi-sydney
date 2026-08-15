import Image from "next/image";
import Link from "next/link";
import FinalCta from "@/components/home/FinalCta";
import type { BlogPost } from "@/lib/blogPosts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostTemplate({ post }: { post: BlogPost }) {
  return (
    <>
      <section className="wt-page-hero">
        <div className="container">
          <div className="wt-page-hero-inner">
            <div className="wt-breadcrumb">
              <Link href="/">Home</Link> / <Link href="/blog/">Blog</Link> / {post.title}
            </div>
            <div className="wt-hero-eyebrow">{formatDate(post.date)}</div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
        </div>
      </section>

      <section className="wt-section">
        <div className="container">
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              style={{ borderRadius: "var(--wt-radius-lg)", marginBottom: 32, width: "100%", height: "auto" }}
              priority
            />
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
