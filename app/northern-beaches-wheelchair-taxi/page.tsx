import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";
import Faq from "@/components/home/Faq";
import JsonLd from "@/components/JsonLd";
import { webPageJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/lib/siteConfig";

// Northern Beaches regional hub. Hand-built (not a CMS `pages` doc) because the brief needs
// tables, a numbered booking process and region-specific schema the generic
// ServicePageTemplate can't express. This static segment takes precedence over app/[slug].
// Build this as the single Northern Beaches hub - don't clone it into thin suburb pages.

const SLUG = "northern-beaches-wheelchair-taxi";
const URL = `${siteConfig.url}/${SLUG}/`;
const BOOKING_HREF = "/wheelchair-taxi-booking/";

const META_TITLE = "Northern Beaches Wheelchair Taxi | Accessible Transport";
const META_DESCRIPTION =
  "Book wheelchair taxi transport across Sydney's Northern Beaches. Accessible vans for powered wheelchairs, hospital appointments, airport trips and NDIS travel.";
const H1 = "Northern Beaches Wheelchair Taxi & Accessible Transport";

export const metadata: Metadata = {
  // absolute: the brief's exact title, without the layout's "| <brand>" template suffix
  // (which would push it well past ~60 characters).
  title: { absolute: META_TITLE },
  description: META_DESCRIPTION,
  keywords: [
    "northern beaches wheelchair taxi",
    "wheelchair taxi Northern Beaches",
    "wheelchair accessible taxi Northern Beaches",
    "disabled taxi Northern Beaches",
    "wheelchair transport Manly",
    "wheelchair taxi Dee Why",
  ],
  alternates: { canonical: `/${SLUG}/` },
  robots: { index: true, follow: true },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: URL, type: "website" },
};

const serviceCards = [
  {
    title: "Wheelchair accessible vehicles",
    description: "Manual and powered wheelchair transport, subject to equipment dimensions and vehicle compatibility.",
    href: "/wheelchair-accessible-taxi/",
  },
  {
    title: "Medical and hospital appointments",
    description: "Planned trips to hospitals, specialist clinics, rehabilitation and therapy appointments.",
    href: "/hospital-transport-sydney/",
  },
  {
    title: "Airport wheelchair transfers",
    description: "Accessible pickups and drop-offs for Sydney Airport domestic and international terminals.",
    href: "/wheelchair-taxi-airport-sydney/",
  },
  {
    title: "Community and everyday travel",
    description: "Transport for family visits, shopping, community activities and social outings.",
    href: "/door-to-door-wheelchair-transport/",
  },
];

const suburbAreas = [
  { area: "Manly and surrounds", suburbs: "Manly, Fairlight, Balgowlah, Balgowlah Heights, Seaforth, Clontarf, Queenscliff" },
  { area: "Dee Why and Brookvale", suburbs: "Dee Why, Brookvale, Narraweena, Cromer, North Curl Curl, South Curl Curl, Freshwater" },
  { area: "Frenchs Forest area", suburbs: "Frenchs Forest, Forestville, Belrose, Allambie Heights, Beacon Hill, Davidson, Killarney Heights" },
  { area: "Narrabeen and Collaroy", suburbs: "Narrabeen, North Narrabeen, Collaroy, Wheeler Heights, Elanora Heights, Ingleside" },
  { area: "Mona Vale and Pittwater", suburbs: "Mona Vale, Warriewood, Bayview, Church Point, Newport, Bilgola, Avalon Beach" },
  { area: "Northern end", suburbs: "Palm Beach, Whale Beach, Clareville, Terrey Hills, Duffys Forest" },
];

const equipment = [
  { type: "Manual wheelchair", considerations: "Width, occupied dimensions, securement compatibility" },
  { type: "Electric/powered wheelchair", considerations: "Width, length, height, combined occupied weight and restraint points" },
  { type: "Mobility scooter", considerations: "Dimensions, weight and whether occupied travel is permitted in the allocated vehicle" },
  { type: "Large or specialised wheelchair", considerations: "Additional clearance, headroom, equipment configuration and available space" },
  { type: "Two wheelchair passengers", considerations: "Suitable multi-wheelchair vehicle availability and number of accompanying passengers" },
];

const bookingSteps = [
  { title: "Provide your journey details", text: "Tell us the pickup address, destination, date, time and whether you need a return trip." },
  { title: "Tell us about the wheelchair", text: "Confirm whether it is manual or powered, approximate measurements, combined occupied weight and any special requirements." },
  { title: "Confirm passengers and assistance", text: "Include the number of carers, family members, other passengers and any luggage." },
  { title: "Review your quote", text: "Our team checks vehicle suitability, availability, pricing and booking instructions." },
  { title: "Receive booking confirmation", text: "The trip is arranged once the details and booking have been confirmed." },
];

const faqs = [
  {
    question: "Can I book a wheelchair taxi in Manly, Dee Why or Mona Vale?",
    answer:
      "Yes. We arrange pre-booked wheelchair accessible transport throughout these suburbs and surrounding Northern Beaches areas. Vehicle availability is confirmed for your requested travel time.",
  },
  {
    question: "Can a powered wheelchair remain occupied during the journey?",
    answer:
      "Many powered wheelchairs can be transported with the passenger seated in the wheelchair, provided the allocated vehicle and wheelchair are compatible and safe securement is possible. Please provide the wheelchair's dimensions and occupied weight.",
  },
  {
    question: "Do you provide wheelchair taxis to Northern Beaches Hospital?",
    answer:
      "Yes. We arrange pre-booked wheelchair accessible transfers to Northern Beaches Hospital in Frenchs Forest, including planned outpatient appointments and hospital discharge journeys.",
  },
  {
    question: "Can I book a return wheelchair taxi or regular weekly transport?",
    answer:
      "Yes. You can request a return journey or recurring transport for medical appointments, therapy, aged care or community activities. Each journey is arranged according to availability.",
  },
  {
    question: "Can I use NDIS funding or TTSS vouchers?",
    answer:
      "We provide transport for eligible self-managed and plan-managed NDIS participants, subject to their funding arrangements. We are not an NDIS-registered provider and do not accept NSW TTSS vouchers or smartcards.",
  },
  {
    question: "Do you offer wheelchair taxi transfers from the Northern Beaches to Sydney Airport?",
    answer:
      "Yes. We arrange accessible transfers to Sydney Airport's domestic and international terminals. Provide luggage, wheelchair and passenger details so that we can check vehicle suitability.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking as early as possible, particularly for powered wheelchairs, hospital appointments, airport trips and multiple wheelchair passengers. Same-day requests may be considered depending on availability.",
  },
];

const relatedLinks = [
  { title: "Book Wheelchair Accessible Transport", description: "Request a quote or booking online.", href: BOOKING_HREF },
  { title: "Hospital Transport Sydney", description: "Accessible transfers for appointments, admissions and discharge.", href: "/hospital-transport-sydney/" },
  { title: "Sydney Airport Wheelchair Taxi", description: "Domestic and international terminal transfers.", href: "/wheelchair-taxi-airport-sydney/" },
  { title: "NDIS Wheelchair Transport Sydney", description: "Transport for self-managed and plan-managed participants.", href: "/ndis-transport-sydney/" },
  { title: "Aged Care Transport", description: "Transfers for aged care and retirement residents.", href: "/aged-care-transport-sydney/" },
  { title: "Electric Wheelchair Transport", description: "Vehicles for larger powered wheelchairs.", href: "/wheelchair-taxi-for-electric-wheelchairs/" },
];

const areaServed = ["Northern Beaches", "Manly", "Dee Why", "Brookvale", "Frenchs Forest", "Mona Vale", "Narrabeen", "Palm Beach"];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${URL}#service`,
  name: "Northern Beaches Wheelchair Taxi Service",
  serviceType: "Wheelchair Accessible Transport",
  description:
    "Pre-booked wheelchair accessible transport in Sydney's Northern Beaches for medical appointments, airport transfers, aged care and everyday journeys.",
  url: URL,
  // References the single site-wide business entity from app/layout.tsx rather than declaring a
  // second LocalBusiness, so search engines don't see duplicate/conflicting business details.
  provider: { "@id": `${siteConfig.url}/#organization` },
  areaServed: areaServed.map((name) => ({ "@type": "Place", name: `${name}, NSW` })),
};

export default function NorthernBeachesPage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ url: URL, name: META_TITLE, description: META_DESCRIPTION })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: `${siteConfig.url}/` },
          { name: "Northern Beaches Wheelchair Taxi", url: URL },
        ])}
      />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqPageJsonLd(faqs)} />

      {/* Hero */}
      <section className="wt-page-hero">
        <div className="container">
          <div className="wt-page-hero-inner">
            <nav className="wt-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / Northern Beaches
            </nav>
            <div className="wt-hero-eyebrow">Northern Beaches, Sydney</div>
            <h1>{H1}</h1>
            <p>
              Reliable pre-booked wheelchair transport across Manly, Dee Why, Brookvale, Mona Vale, Narrabeen, Newport,
              Palm Beach and surrounding Northern Beaches suburbs.
            </p>
            <div className="wt-page-hero-actions">
              <Link href={BOOKING_HREF} className="wt-btn wt-btn-primary">
                Book Wheelchair Transport
              </Link>
              <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-outline-inverted">
                <FaPhoneAlt aria-hidden="true" /> Call {siteConfig.phoneLocalDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="wt-section">
        <div className="container">
          <div className="wt-split reverse">
            <div className="wt-split-media">
              <Image
                src="/images/wheelchair-accessible-ford-transit-custom.jpg"
                alt="Wheelchair accessible van with rear ramp for Northern Beaches wheelchair transport"
                width={980}
                height={420}
                loading="lazy"
              />
            </div>
            <div className="wt-split-body">
              <span className="wt-eyebrow">Accessible transport</span>
              <h2>Wheelchair Accessible Taxi Services Across the Northern Beaches</h2>
              <p>
                {siteConfig.name} provides wheelchair accessible taxi and private transport services across Sydney&apos;s
                Northern Beaches. We help passengers using manual wheelchairs, powered wheelchairs and compatible
                mobility scooters travel to medical appointments, hospitals, Sydney Airport, aged care facilities and
                everyday destinations.
              </p>
              <p>
                Our booking team helps match your mobility equipment and passenger requirements with a suitable vehicle,
                including wheelchair accessible vans fitted with a ramp or hydraulic lift where available.
              </p>
              <p>
                Finding suitable wheelchair transport should not require guessing whether a vehicle can accommodate your
                mobility equipment. Our Northern Beaches wheelchair taxi booking service is designed around the
                passenger&apos;s needs, from selecting an accessible vehicle to arranging assistance at pickup and
                drop-off.
              </p>
              <p>
                We provide pre-booked transport for people with disability, older passengers, wheelchair users, families,
                carers and organisations.
              </p>
            </div>
          </div>

          <div className="wt-nb-cards">
            {serviceCards.map((card) => (
              <Link href={card.href} className="wt-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Suburbs */}
      <section className="wt-section on-light" id="suburbs">
        <div className="container">
          <span className="wt-eyebrow">Service area</span>
          <h2>Northern Beaches Suburbs We Service</h2>
          <p className="wt-nb-lede">
            We arrange wheelchair accessible transport across the Northern Beaches, including coastal, residential and
            hospital precincts.
          </p>
          <div className="wt-nb-table-wrap">
            <table className="wt-nb-table">
              <thead>
                <tr>
                  <th scope="col">Service area</th>
                  <th scope="col">Suburbs covered</th>
                </tr>
              </thead>
              <tbody>
                {suburbAreas.map((row) => (
                  <tr key={row.area}>
                    <th scope="row">{row.area}</th>
                    <td>{row.suburbs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wt-nb-lede">
            Whether you need a wheelchair taxi from Manly to Sydney Airport, Dee Why to Northern Beaches Hospital, or
            Mona Vale to a medical appointment, our team can help organise a suitable vehicle based on availability.
          </p>
          <p className="wt-nb-lede">
            For trips starting outside these suburbs, <Link href="/contact-us/">contact our booking team</Link> to
            discuss your pickup location.
          </p>
        </div>
      </section>

      {/* Hospital */}
      <section className="wt-section">
        <div className="container">
          <div className="wt-split">
            <div className="wt-split-media">
              <Image
                src="/images/accessible-van-assistance.webp"
                alt="Driver assisting a wheelchair passenger into an accessible van for a hospital appointment"
                width={800}
                height={533}
                loading="lazy"
              />
            </div>
            <div className="wt-split-body">
              <span className="wt-eyebrow">Accessible hospital transfers for patients, carers and families</span>
              <h2>Wheelchair Transport to Northern Beaches Hospital</h2>
              <p>
                We arrange wheelchair taxi transfers to and from Northern Beaches Hospital, located at 105 Frenchs Forest
                Road West, Frenchs Forest NSW 2086.
              </p>
              <p>
                Journeys can be arranged for specialist consultations, scheduled medical appointments, outpatient
                procedures, rehabilitation and planned hospital discharge.
              </p>
              <p>
                Please tell our team the relevant hospital entrance, appointment time, mobility assistance needed and
                whether return transport is required. Passengers attending appointments should allow additional time for
                traffic, boarding and reaching the correct department.
              </p>
              <p className="wt-nb-notice">
                <strong>Important:</strong> This is a pre-booked transport service, not an emergency ambulance or
                clinical patient transport service.
              </p>
              <p>
                More on <Link href="/hospital-transport-sydney/">hospital transport across Sydney</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="wt-section on-light">
        <div className="container">
          <span className="wt-eyebrow">Mobility equipment</span>
          <h2>Powered Wheelchair, Manual Wheelchair and Mobility Scooter Transport</h2>
          <p className="wt-nb-lede">
            Different mobility devices require different vehicle clearances, restraints and boarding arrangements. We
            confirm these requirements before allocating an accessible taxi.
          </p>
          <div className="wt-nb-table-wrap">
            <table className="wt-nb-table">
              <thead>
                <tr>
                  <th scope="col">Mobility equipment</th>
                  <th scope="col">Booking considerations</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((row) => (
                  <tr key={row.type}>
                    <th scope="row">{row.type}</th>
                    <td>{row.considerations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wt-nb-lede">
            Where appropriate, a vehicle with a hydraulic lift may be preferable for large powered wheelchairs. Ramp
            availability and suitability must be checked before confirmation.
          </p>
          <p className="wt-nb-lede">
            Our priority is to allocate a vehicle that can safely accommodate the passenger and equipment rather than
            relying solely on the description &ldquo;wheelchair taxi.&rdquo; See also{" "}
            <Link href="/wheelchair-taxi-for-electric-wheelchairs/">electric wheelchair transport</Link>,{" "}
            <Link href="/wheelchair-taxi-for-manual-wheelchairs/">manual wheelchair transport</Link> and{" "}
            <Link href="/wheelchair-taxi-for-mobility-scooters/">mobility scooter transport</Link>.
          </p>
        </div>
      </section>

      {/* Airport / NDIS / Aged care */}
      <section className="wt-section">
        <div className="container">
          <div className="wt-nb-prose-grid">
            <div>
              <h2>Northern Beaches Wheelchair Taxi to Sydney Airport</h2>
              <p>
                We provide pre-booked wheelchair accessible transport between Northern Beaches suburbs and Sydney Airport.
                Transfers are available for both domestic and international flights, subject to booking and suitable
                vehicle availability.
              </p>
              <p>
                When arranging your airport transfer, provide your travel date, flight details where relevant, wheelchair
                dimensions, passenger count and luggage requirements. This helps ensure the allocated vehicle has the
                necessary capacity for the wheelchair, other passengers and luggage.
              </p>
              <p>
                For pickups at Sydney Airport, our team will confirm the appropriate terminal pickup arrangements. We do
                not offer an in-terminal meet-and-greet or baggage-belt collection service.
              </p>
              <p>
                <Link href="/wheelchair-taxi-airport-sydney/">Sydney Airport wheelchair taxi details</Link>
              </p>
            </div>
            <div>
              <h2>NDIS Wheelchair Transport in the Northern Beaches</h2>
              <p>
                We provide accessible transport for eligible self-managed and plan-managed NDIS participants in the
                Northern Beaches. Trips may include therapy appointments, community participation, medical visits, social
                outings, educational activities and recurring appointments.
              </p>
              <p>
                Our service is not an NDIS-registered provider. Customers and their plan managers should confirm the
                suitability of their funding and invoice arrangements before travel.
              </p>
              <p>We can assist with organising transport schedules and providing appropriate booking documentation.</p>
              <p>
                <Link href="/ndis-transport-sydney/">NDIS wheelchair transport across Sydney</Link>
              </p>
            </div>
            <div>
              <h2>Aged Care and Nursing Home Wheelchair Transport</h2>
              <p>
                We assist residents of aged care facilities, retirement communities and supported accommodation across
                the Northern Beaches. Our booking team can coordinate pickup instructions, contact details and the level
                of assistance required with the resident, family member or authorised care provider.
              </p>
              <p>
                For nursing home transfers, please provide information about the pickup entrance, wheelchair type,
                accompanying carer, appointment schedule and any additional support needed.
              </p>
              <p>
                Drivers provide transport-related assistance within their role; clinical care, patient lifting and
                medical supervision must be arranged separately.
              </p>
              <p>
                <Link href="/aged-care-transport-sydney/">Aged care transport in Sydney</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="wt-section on-light">
        <div className="container">
          <div className="wt-nb-narrow">
            <span className="wt-eyebrow">Fares</span>
            <h2>How Much Does a Wheelchair Taxi Cost in the Northern Beaches?</h2>
            <p>Wheelchair taxi fares depend on the journey and accessibility requirements.</p>
            <p>
              Our pricing considers the pickup and destination, travel distance, suitable vehicle type, number of
              wheelchair passengers, additional stops and any agreed waiting time.
            </p>
            <p>
              Indicative Sydney metropolitan wheelchair taxi fares start from A$85 for a standard one-way booking, but
              Northern Beaches trips may cost more depending on distance, positioning and other requirements. This is a
              guide, not a guaranteed fare for every Northern Beaches suburb.
            </p>
            <p>
              Before confirming your booking, our team can provide the applicable fare and explain any included or
              additional charges.
            </p>
            <p className="wt-nb-notice">
              For transparency, please note that we do not currently accept NSW TTSS vouchers or smartcards. Payment or
              invoicing arrangements must be confirmed before booking.
            </p>
          </div>
        </div>
      </section>

      {/* How to book */}
      <section className="wt-section">
        <div className="container">
          <span className="wt-eyebrow">Booking process</span>
          <h2>How to Book Your Northern Beaches Wheelchair Taxi</h2>
          <ol className="wt-nb-steps">
            {bookingSteps.map((step, i) => (
              <li className="wt-step" key={step.title}>
                <div className="wt-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="wt-nb-lede">
            You can contact our team on <a href={`tel:${siteConfig.phoneIntl}`}>{siteConfig.phoneLocalDisplay}</a> or
            email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>

      <Faq columns={[faqs.slice(0, 4), faqs.slice(4)]} title="Northern Beaches Wheelchair Taxi FAQs" eyebrow="Questions" />

      {/* Related */}
      <section className="wt-section">
        <div className="container">
          <span className="wt-eyebrow">Related services</span>
          <h2>More Accessible Transport Services</h2>
          <div className="wt-grid-3 wt-nb-related">
            {relatedLinks.map((item) => (
              <Link href={item.href} className="wt-card" key={item.href}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wt-section">
        <div className="container">
          <div className="wt-final-cta">
            <h2>Book Wheelchair Accessible Transport in the Northern Beaches</h2>
            <p>
              Need transport for a hospital appointment, airport transfer, aged care visit or family outing? Contact{" "}
              {siteConfig.name} to discuss your wheelchair type, journey details and preferred pickup time.
            </p>
            <div className="wt-final-actions">
              <a href={`tel:${siteConfig.phoneIntl}`} className="wt-btn wt-btn-primary">
                <FaPhoneAlt aria-hidden="true" /> Call Booking Team
              </a>
              <a href={`mailto:${siteConfig.email}`} className="wt-btn wt-btn-outline-inverted">
                <FaRegEnvelope aria-hidden="true" /> Email Booking Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
