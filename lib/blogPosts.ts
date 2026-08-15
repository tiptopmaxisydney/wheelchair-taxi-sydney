export type BlogSection = { heading?: string; paragraphs: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  image: { src: string; alt: string; width: number; height: number };
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-ndis",
    title: "What Is the NDIS? A Simple Guide for Passengers and Families",
    metaTitle: "What Is the NDIS? | Wheelchair Taxi Sydney Blog",
    metaDescription:
      "A plain-English introduction to the National Disability Insurance Scheme (NDIS) and how it can relate to accessible transport in Sydney.",
    excerpt:
      "A plain-English look at what the NDIS is, who it supports, and how accessible transport can fit into a participant's plan.",
    date: "2026-03-18",
    image: { src: "/images/what-is-ndis.webp", alt: "NDIS participant using wheelchair accessible transport", width: 1024, height: 546 },
    sections: [
      {
        paragraphs: [
          "The National Disability Insurance Scheme, better known as the NDIS, is an Australian Government program that provides funding and support to eligible people with permanent and significant disability. For many participants and their families, understanding how the scheme works, and how everyday services like transport fit into it, can take some time to navigate.",
        ],
      },
      {
        heading: "Who Is the NDIS For?",
        paragraphs: [
          "The NDIS is designed for Australians under 65 who have a permanent disability that significantly affects their ability to take part in everyday activities. Eligibility and the exact supports funded under a plan are determined by the National Disability Insurance Agency (NDIA) based on each individual's circumstances.",
        ],
      },
      {
        heading: "How Plan Management Works",
        paragraphs: [
          "NDIS participants generally manage their funding in one of three ways: self-managed, where the participant handles payments directly; plan-managed, where a registered plan manager processes payments on the participant's behalf; or NDIA-managed, where the agency manages payments directly with providers. The management style can affect how a participant arranges and pays for services, including transport.",
        ],
      },
      {
        heading: "Where Transport Fits In",
        paragraphs: [
          "Reliable transport is often an important part of daily life for NDIS participants, supporting access to therapy sessions, community activities, education, employment and social events. If transport is included in your plan, it is worth discussing your travel needs, including any wheelchair or mobility equipment, with your support coordinator or plan manager so appropriate arrangements can be made.",
          "If you have questions about how your specific plan relates to booking transport, your support coordinator or the NDIA are the best points of contact for guidance specific to your circumstances.",
        ],
      },
    ],
  },
  {
    slug: "where-can-disabled-taxi-services-find-support-in-sydney",
    title: "Where Can Disabled Taxi Services Find Support in Sydney?",
    metaTitle: "Support Services for Disabled Taxi Passengers in Sydney | Wheelchair Taxi Sydney Blog",
    metaDescription:
      "An overview of support organisations and resources available to disabled taxi passengers and accessible transport providers in Sydney.",
    excerpt: "A look at the organisations and resources that support accessible transport passengers and providers across Sydney.",
    date: "2026-04-02",
    image: {
      src: "/images/benefits-of-disabled-taxi-sydney.webp",
      alt: "Wheelchair accessible taxi supporting a passenger in Sydney",
      width: 1024,
      height: 683,
    },
    sections: [
      {
        paragraphs: [
          "Accessible transport does not exist in isolation. Passengers, families, aged care providers and disability organisations across Sydney all play a role in helping people get where they need to go safely and comfortably. Knowing where to turn for information and support can make a real difference.",
        ],
      },
      {
        heading: "Disability Support Organisations",
        paragraphs: [
          "A range of disability support and advocacy organisations operate across Sydney, offering information, advocacy and referral services for people with disability and their families. These organisations can often point passengers toward transport options, funding pathways and other practical resources relevant to their situation.",
        ],
      },
      {
        heading: "Support Coordinators and Plan Managers",
        paragraphs: [
          "For NDIS participants, support coordinators and plan managers are often the first point of contact when arranging transport as part of a broader support plan. They can help clarify what is funded and assist with coordinating regular travel needs, such as therapy appointments or community access.",
        ],
      },
      {
        heading: "Community and Local Resources",
        paragraphs: [
          "Local councils, community transport services and aged care providers can also be valuable resources, particularly for passengers who are not NDIS participants but still require accessible transport support. Many community organisations maintain lists of accessible transport providers in their area.",
          "Wherever you start, being clear about your mobility equipment, typical trip types and any support needs will help any organisation, including a transport provider like ours, connect you with the right service more quickly.",
        ],
      },
    ],
  },
  {
    slug: "are-there-any-events-for-disability-service-provider",
    title: "Are There Any Events for Disability Service Providers in Sydney?",
    metaTitle: "Events for Disability Service Providers in Sydney | Wheelchair Taxi Sydney Blog",
    metaDescription:
      "A look at the types of industry events, expos and community activities relevant to disability service providers operating in Sydney.",
    excerpt: "An overview of the kinds of expos, conferences and community events relevant to disability service providers in Sydney.",
    date: "2026-04-20",
    image: {
      src: "/images/wheelchair-accessible-ford-transit-custom.jpg",
      alt: "Wheelchair accessible vehicle used to attend a disability services event",
      width: 1024,
      height: 683,
    },
    sections: [
      {
        paragraphs: [
          "Sydney regularly hosts events relevant to the disability sector, from large industry expos to smaller community gatherings. For disability service providers, including transport operators like ours, these events are valuable opportunities to connect with participants, families and other organisations.",
        ],
      },
      {
        heading: "Industry Expos and Conferences",
        paragraphs: [
          "Larger disability sector expos typically bring together service providers, assistive technology suppliers, advocacy groups and NDIS-related organisations under one roof. These events often include information sessions, exhibitor stalls and opportunities for participants and families to explore available services in person.",
        ],
      },
      {
        heading: "Community and Local Events",
        paragraphs: [
          "Smaller, community-based events, such as those run by local councils, aged care facilities or disability support groups, also play an important role in connecting people with local services. Transport is often a practical consideration for these events, and accessible vehicles help ensure participants can attend without added stress.",
        ],
      },
      {
        heading: "Why Transport Matters at These Events",
        paragraphs: [
          "Whether it is a major expo or a local community day, getting to and from the venue safely is often just as important as the event itself. If you are planning to attend a disability sector event in Sydney and need wheelchair accessible transport, it is worth booking ahead, particularly for larger events where parking and access points can be busy.",
        ],
      },
    ],
  },
  {
    slug: "rsl-club-sydney",
    title: "Visiting an RSL Club in Sydney? Accessible Transport Tips",
    metaTitle: "Accessible Transport to RSL Clubs in Sydney | Wheelchair Taxi Sydney Blog",
    metaDescription:
      "Tips for planning accessible transport to RSL clubs across Sydney, including drop-off, parking and mobility considerations.",
    excerpt: "Practical tips for planning wheelchair accessible transport to RSL clubs across Sydney for events and social visits.",
    date: "2026-05-05",
    image: {
      src: "/images/rsl-club-sydney-wheelchair-taxi.png",
      alt: "Wheelchair accessible taxi outside an RSL club in Sydney",
      width: 1024,
      height: 576,
    },
    sections: [
      {
        paragraphs: [
          "RSL clubs are popular destinations across Sydney for social gatherings, live entertainment, meals and community events. Many members and visitors with mobility equipment enjoy regular outings to their local club, and planning accessible transport ahead of time helps the visit go smoothly.",
        ],
      },
      {
        heading: "Planning Your Drop-Off",
        paragraphs: [
          "Most RSL clubs have designated accessible parking and drop-off areas, though these can vary by venue and get busy during peak times such as weekends or event nights. When booking transport, it helps to mention the specific club and, where known, your preferred entrance so your driver can plan the most suitable drop-off point.",
        ],
      },
      {
        heading: "Timing Your Return Trip",
        paragraphs: [
          "For social outings, return trip timing can be less predictable than a medical appointment. Let your driver or booking team know roughly how long you expect to stay, and consider booking your return trip in advance if you are visiting during a busy period, such as a club event or weekend evening.",
        ],
      },
      {
        heading: "Travelling With Family or Friends",
        paragraphs: [
          "Many outings to RSL clubs involve family or friends travelling together. Our vehicles are generally able to accommodate a wheelchair user along with accompanying passengers, subject to vehicle capacity, so the whole group can travel together where possible.",
        ],
      },
    ],
  },
  {
    slug: "best-wheelchair-taxi-service-in-sydney-for-safe-comfortable-travel",
    title: "What to Look for in the Best Wheelchair Taxi Service in Sydney",
    metaTitle: "Best Wheelchair Taxi Service in Sydney: What to Look For | Wheelchair Taxi Sydney Blog",
    metaDescription:
      "Key things to consider when choosing a wheelchair taxi service in Sydney, from driver training to vehicle suitability and booking flexibility.",
    excerpt: "A practical checklist for choosing a wheelchair accessible taxi service in Sydney that suits your needs.",
    date: "2026-05-22",
    image: {
      src: "/images/best-wheelchair-taxi-service-sydney.webp",
      alt: "Safe and comfortable wheelchair taxi service in Sydney",
      width: 1024,
      height: 683,
    },
    sections: [
      {
        paragraphs: [
          "With a number of transport options available across Sydney, it can be worth knowing what to look for when choosing a wheelchair accessible taxi service, particularly for regular trips like medical appointments or NDIS-funded travel.",
        ],
      },
      {
        heading: "Vehicle Suitability",
        paragraphs: [
          "Not all accessible vehicles suit every wheelchair or mobility scooter. Before booking, check whether the provider can confirm vehicle suitability based on your equipment's dimensions and weight, rather than offering a one-size-fits-all vehicle.",
        ],
      },
      {
        heading: "Driver Training and Experience",
        paragraphs: [
          "Safe wheelchair loading, correct restraint use and respectful passenger assistance all depend on driver training. It is reasonable to ask a provider about how their drivers are trained to assist wheelchair and mobility scooter users.",
        ],
      },
      {
        heading: "Booking Flexibility",
        paragraphs: [
          "Look for a service that can accommodate both advance bookings, useful for planning around appointments and events, and reasonable flexibility for shorter-notice requests where possible. Providers who support recurring bookings can also be helpful for passengers with regular appointments.",
        ],
      },
      {
        heading: "Clear Communication",
        paragraphs: [
          "Finally, a good accessible transport provider should be easy to reach and transparent about pricing, vehicle availability and any limitations on wheelchair size or weight. Clear communication before your trip helps avoid surprises on the day of travel.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
