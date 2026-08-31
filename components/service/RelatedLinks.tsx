import Link from "next/link";

type RelatedLinkItem = { icon: string; title: string; description: string; href: string };

type RelatedLinksProps = {
  eyebrow?: string;
  title: string;
  items: RelatedLinkItem[];
};

export default function RelatedLinks({ eyebrow = "Related Services", title, items }: RelatedLinksProps) {
  return (
    <section className="wt-section on-light">
      <div className="container">
        <span className="wt-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <div className="wt-grid-3">
          {items.map((item) => (
            <Link href={item.href} className="wt-card" key={item.href}>
              <span aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
