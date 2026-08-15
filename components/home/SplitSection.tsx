import Image from "next/image";

type SplitSectionProps = {
  eyebrow?: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  itemsIntro?: string;
  numbered?: boolean;
  image: { src: string; alt: string; width: number; height: number };
  imageFirst?: boolean;
  background?: "white" | "light";
};

export default function SplitSection({
  eyebrow,
  title,
  paragraphs,
  items,
  itemsIntro,
  numbered,
  image,
  imageFirst,
  background = "white",
}: SplitSectionProps) {
  const ListTag = numbered ? "ol" : "ul";

  return (
    <section className={`wt-section${background === "light" ? " on-light" : ""}`}>
      <div className="container">
        <div className={`wt-split${imageFirst ? "" : " reverse"}`}>
          <div className="wt-split-media">
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
          </div>
          <div className="wt-split-body">
            {eyebrow && <span className="wt-eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {items && (
              <>
                {itemsIntro && <p>{itemsIntro}</p>}
                <ListTag>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ListTag>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
