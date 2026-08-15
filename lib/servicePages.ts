import type { Faq } from "./homeData";

export type ServiceImage = { src: string; alt: string; width: number; height: number };

export type ServicePage = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  image: ServiceImage;
  imageFirst?: boolean;
  intro: string[];
  introItemsIntro?: string;
  introItems?: string[];
  features: { title: string; description: string }[];
  faq: Faq[];
};

const IMG = {
  interior: { src: "/images/space-for-carers-and-family-members.webp", width: 600, height: 400 },
  airport: { src: "/images/wheelchair-taxi-sydney.jpg", width: 600, height: 483 },
  nursingHome: { src: "/images/nursing-home-transfer.jpg", width: 600, height: 400 },
  agedCare: { src: "/images/aged-care-home-transfers.png", width: 600, height: 397 },
  ndis: { src: "/images/what-is-ndis.webp", width: 600, height: 320 },
  maxiVan: { src: "/images/maxi-van.png", width: 604, height: 310 },
  vanAssistance: { src: "/images/accessible-van-assistance.webp", width: 600, height: 400 },
  organisations: { src: "/images/organisations-and-customers-we-assist.webp", width: 600, height: 400 },
  booking: { src: "/images/wheelchair-taxi-booking.png", width: 600, height: 480 },
  silverService: { src: "/images/silver-service-wheelchair-taxi.jpg", width: 600, height: 359 },
  fareEstimator: { src: "/images/wheelchair-taxi-fare-estimator.png", width: 600, height: 600 },
  transitCustom: { src: "/images/wheelchair-accessible-ford-transit-custom.jpg", width: 600, height: 400 },
} as const;

export const servicePages: ServicePage[] = [
  // Disability & community transport
  {
    slug: "ndis-transport-sydney",
    navLabel: "NDIS Wheelchair Transport Sydney",
    metaTitle: "NDIS Wheelchair Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible NDIS transport across Sydney for therapy, appointments, community access and everyday travel. Self-managed and plan-managed participants welcome.",
    eyebrow: "NDIS Transport",
    h1: "NDIS Wheelchair Transport Sydney",
    heroDescription:
      "Accessible transport for NDIS participants travelling to therapy sessions, appointments, community activities and everyday commitments across Sydney.",
    image: { ...IMG.ndis, alt: "Wheelchair accessible vehicle used for NDIS transport in Sydney" },
    intro: [
      "Wheelchair Taxi Sydney supports NDIS participants who need dependable, wheelchair accessible transport for the appointments and activities that make up daily life. Whether you manage your own plan, work with a plan manager, or are supported by the NDIA, our booking team can talk through the details of your trip before it is confirmed.",
      "We understand that consistency matters for many participants, particularly when transport is part of a regular therapy or support routine. Where possible, we aim to accommodate recurring bookings with drivers who understand your travel pattern.",
    ],
    introItemsIntro: "Our NDIS transport support can include:",
    introItems: [
      "Travel to allied health and therapy appointments",
      "Transport to day programs and community activities",
      "Support coordination and plan manager liaison on request",
      "Trips for participants using manual or powered wheelchairs",
      "Assistance for carers or support workers travelling with participants",
    ],
    features: [
      {
        title: "Funding Arrangements",
        description:
          "We can discuss self-managed and plan-managed travel arrangements with you or your support coordinator before your trip is booked.",
      },
      {
        title: "Consistent Drivers Where Possible",
        description:
          "For regular appointments, we try to match participants with familiar drivers who understand their routine and preferences.",
      },
      {
        title: "Flexible Booking Windows",
        description:
          "From same-day requests to standing weekly bookings, our team works with participants to plan transport around their schedule.",
      },
    ],
    faq: [
      {
        question: "Do you accept NDIS-funded bookings?",
        answer:
          "We provide transport that NDIS participants can arrange under applicable funding arrangements. Please discuss your plan management type with our team when booking so we can confirm the details.",
      },
      {
        question: "Can I book recurring NDIS transport?",
        answer:
          "Yes. Let us know your regular appointment days and times and we will do our best to arrange consistent, reliable transport around your routine.",
      },
      {
        question: "Can a support worker travel with me?",
        answer: "Yes, our vehicles have space for a support worker or carer to travel alongside NDIS participants.",
      },
    ],
  },
  {
    slug: "ttss-taxi-sydney",
    navLabel: "TTSS Taxi Sydney",
    metaTitle: "TTSS Taxi Sydney Information | Wheelchair Taxi Sydney",
    metaDescription:
      "Information about the NSW Taxi Transport Subsidy Scheme (TTSS) and how it relates to wheelchair accessible transport bookings in Sydney.",
    eyebrow: "TTSS Information",
    h1: "TTSS Taxi Sydney",
    heroDescription:
      "Understanding how the NSW Taxi Transport Subsidy Scheme works alongside wheelchair accessible transport bookings.",
    image: { ...IMG.booking, alt: "Passenger booking a wheelchair accessible taxi in Sydney" },
    intro: [
      "The NSW Taxi Transport Subsidy Scheme (TTSS) is a government program that assists eligible passengers with severe and permanent disabilities to access subsidised taxi travel. Eligibility, subsidy amounts and accepted payment methods are determined by Transport for NSW, not by individual transport operators.",
      "Wheelchair Taxi Sydney currently does not accept TTSS vouchers as a form of payment. If TTSS assistance is central to how you plan to pay for your trip, please confirm accepted payment methods with our booking team before your journey, or contact Transport for NSW directly for scheme details and approved providers.",
    ],
    introItemsIntro: "When contacting us about a booking, it helps to confirm:",
    introItems: [
      "Your preferred payment method",
      "Whether the trip needs to be pre-booked or same-day",
      "Any wheelchair or mobility equipment details",
      "Pickup and destination addresses",
    ],
    features: [
      {
        title: "Transparent Payment Information",
        description:
          "We aim to be upfront about accepted payment methods so passengers can plan their trip and budget with confidence.",
      },
      {
        title: "Accessible Vehicles",
        description:
          "Regardless of payment method, our fleet is built around safe, comfortable wheelchair accessible transport.",
      },
      {
        title: "Helpful Booking Team",
        description: "Our team can answer questions about payment options before you confirm your booking.",
      },
    ],
    faq: [
      {
        question: "Does Wheelchair Taxi Sydney accept TTSS vouchers?",
        answer:
          "No, Wheelchair Taxi Sydney does not currently accept the NSW Taxi Transport Subsidy Scheme (TTSS) as a payment method. Please confirm accepted payment options with us before booking.",
      },
      {
        question: "Where can I find out more about TTSS eligibility?",
        answer:
          "TTSS eligibility and scheme details are managed by Transport for NSW. Please contact them directly or visit the official Transport for NSW website for current information.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "Please contact our booking team to confirm current accepted payment methods for your trip.",
      },
    ],
  },
  {
    slug: "aged-care-transport-sydney",
    navLabel: "Aged Care Transport Sydney",
    metaTitle: "Aged Care Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transport for aged care residents across Sydney, including appointments, family visits and community outings.",
    eyebrow: "Aged & Disability Care",
    h1: "Aged Care Transport Sydney",
    heroDescription:
      "Patient, accessible transport for elderly passengers travelling from aged care and retirement communities across Sydney.",
    image: { ...IMG.agedCare, alt: "Elderly passenger being assisted into a wheelchair accessible vehicle" },
    imageFirst: true,
    intro: [
      "Travelling from an aged care facility often requires more time, coordination and care than a typical trip. Our drivers are experienced in assisting elderly passengers, including those with limited mobility, memory-related conditions or additional support needs, and aim to work respectfully with facility staff and family members.",
      "We provide transport for individual residents as well as coordinated group outings, subject to vehicle availability and facility scheduling requirements.",
    ],
    introItemsIntro: "Common aged care transport requests include:",
    introItems: [
      "Medical and specialist appointments",
      "Transfers between aged care facilities",
      "Family visits and social outings",
      "Day program and community activity transport",
      "End-to-end coordination with facility staff",
    ],
    features: [
      {
        title: "Patient, Trained Drivers",
        description: "Our drivers understand that elderly passengers may need extra time and reassurance during pickup and drop-off.",
      },
      {
        title: "Facility Coordination",
        description: "We can liaise with aged care staff to confirm pickup windows, room numbers and any specific handover instructions.",
      },
      {
        title: "Comfortable, Accessible Vehicles",
        description: "Our fleet is designed to accommodate manual and powered wheelchairs along with mobility aids.",
      },
    ],
    faq: [
      {
        question: "Can you collect a resident directly from their room or facility entrance?",
        answer: "Yes, subject to facility policy. Please share any specific access instructions when booking.",
      },
      {
        question: "Do you provide transport for group outings from aged care homes?",
        answer: "Yes, subject to vehicle availability and group size. Contact us to discuss your requirements.",
      },
      {
        question: "Can family members travel with the resident?",
        answer: "Yes, our vehicles generally have room for a family member or carer to travel alongside the passenger.",
      },
    ],
  },
  {
    slug: "old-age-home-transfers",
    navLabel: "Old Age Home Transfers",
    metaTitle: "Old Age Home Transfers Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transfers to and from old age homes across Sydney, with drivers experienced in assisting elderly passengers.",
    eyebrow: "Aged & Disability Care",
    h1: "Old Age Home Transfers",
    heroDescription: "Accessible, respectful transfers to and from old age homes for elderly passengers across Sydney.",
    image: { ...IMG.nursingHome, alt: "Wheelchair accessible vehicle used for old age home transfers" },
    intro: [
      "Moving between an old age home and an appointment, hospital or family event can be stressful without the right transport support. We aim to make these transfers as calm and predictable as possible, with drivers who take the time needed for safe wheelchair loading and unloading.",
      "Bookings can be arranged directly by residents, family members or facility staff, depending on the resident's care arrangements.",
    ],
    introItemsIntro: "We can assist with:",
    introItems: [
      "Scheduled transfers to medical appointments",
      "One-off or recurring family visit transport",
      "Transfers between care facilities",
      "Coordination with facility staff around pickup times",
    ],
    features: [
      {
        title: "Experienced With Elderly Passengers",
        description: "Our drivers are trained to assist passengers with reduced mobility calmly and safely.",
      },
      {
        title: "Reliable Scheduling",
        description: "We recommend pre-booking transfers where possible to help ensure the vehicle and driver are ready on time.",
      },
      {
        title: "Wheelchair Restraint Systems",
        description: "Vehicles are fitted with restraint systems to secure wheelchairs safely for the journey.",
      },
    ],
    faq: [
      {
        question: "Who can book an old age home transfer?",
        answer: "Bookings can be made by the resident, a family member, or facility staff on the resident's behalf.",
      },
      {
        question: "Can you arrange a return trip on the same day?",
        answer: "Yes, please let us know your appointment time and expected duration so we can arrange a return pickup.",
      },
      {
        question: "Do your drivers assist with getting in and out of the vehicle?",
        answer: "Yes, our drivers can assist with boarding and alighting as part of the service.",
      },
    ],
  },
  {
    slug: "nursing-home-transfers",
    navLabel: "Nursing Home Transfers",
    metaTitle: "Nursing Home Transfers Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible nursing home transfers across Sydney for medical appointments, family visits and facility-to-facility transport.",
    eyebrow: "Aged & Disability Care",
    h1: "Nursing Home Transfers",
    heroDescription: "Safe, accessible transfers to and from nursing homes across Sydney, with careful assistance at every step.",
    image: { ...IMG.nursingHome, alt: "Driver assisting a nursing home resident into a wheelchair accessible vehicle" },
    imageFirst: true,
    intro: [
      "Nursing home residents often have specific mobility, medical or comfort needs that should be considered before a trip is confirmed. Our booking team will ask about wheelchair type, any equipment being brought along, and the nature of the appointment so we can allocate a suitable vehicle and allow enough time for the transfer.",
      "We work with residents, families and nursing home staff to coordinate pickup times that fit around facility routines and appointment schedules.",
    ],
    introItemsIntro: "Nursing home transfers we assist with include:",
    introItems: [
      "Hospital and specialist appointments",
      "Dialysis and other regular treatment transport",
      "Family gatherings and community events",
      "Transfers between nursing homes and hospitals",
    ],
    features: [
      {
        title: "Careful Handling",
        description: "Drivers take the time needed to safely position and secure wheelchairs before departure.",
      },
      {
        title: "Facility-Friendly Communication",
        description: "We can coordinate pickup and drop-off details directly with nursing home staff where needed.",
      },
      {
        title: "Support for Recurring Appointments",
        description: "We can help arrange regular transport for residents with ongoing treatment schedules.",
      },
    ],
    faq: [
      {
        question: "Can nursing home staff book on behalf of a resident?",
        answer: "Yes, staff members can arrange bookings on behalf of residents with appropriate details about the trip.",
      },
      {
        question: "Do you transport residents with dementia or memory-related conditions?",
        answer: "Yes, our drivers aim to provide a calm, reassuring experience. Please share any relevant guidance when booking.",
      },
      {
        question: "Can you accommodate a wheelchair with attached medical equipment?",
        answer: "Please provide details of any attached equipment when booking so we can confirm vehicle suitability.",
      },
    ],
  },
  {
    slug: "aged-care-home-transfers",
    navLabel: "Aged Care Home Transfers",
    metaTitle: "Aged Care Home Transfers Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Reliable wheelchair accessible transfers for aged care home residents across Sydney, coordinated around appointments and facility schedules.",
    eyebrow: "Aged & Disability Care",
    h1: "Aged Care Home Transfers",
    heroDescription: "Coordinated, accessible transfers for aged care home residents travelling across Sydney.",
    image: { ...IMG.agedCare, alt: "Wheelchair accessible vehicle outside an aged care home" },
    intro: [
      "Aged care home transfers often involve more planning than a standard taxi trip, from confirming wheelchair dimensions to allowing extra time for boarding. Our team works through these details with residents, families or facility staff before confirming a booking.",
      "We aim to provide a consistent, comfortable experience so residents feel at ease throughout the journey.",
    ],
    introItemsIntro: "Transfers we support include:",
    introItems: [
      "Appointments with GPs and specialists",
      "Allied health and therapy visits",
      "Family functions and community outings",
      "Transfers to and from hospital",
    ],
    features: [
      {
        title: "Respectful Assistance",
        description: "Our drivers are trained to provide dignified, patient support throughout pickup and drop-off.",
      },
      {
        title: "Suitable Vehicle Allocation",
        description: "We match vehicles to wheelchair size, luggage and passenger numbers where relevant.",
      },
      {
        title: "Clear Communication",
        description: "We keep facility staff and family informed of pickup timing where required.",
      },
    ],
    faq: [
      {
        question: "How far in advance should we book a transfer?",
        answer: "We recommend booking as early as possible for appointments, though we will always try to accommodate shorter-notice requests where availability allows.",
      },
      {
        question: "Can you assist with mobility equipment other than wheelchairs?",
        answer: "Please tell us about any additional mobility equipment when booking so we can confirm suitability.",
      },
      {
        question: "Is there a cost difference for aged care transfers?",
        answer: "Fares are based on trip details such as distance, vehicle type and any additional requirements. Contact us for a quote.",
      },
    ],
  },

  // Airport transfers
  {
    slug: "wheelchair-taxi-airport-sydney",
    navLabel: "Wheelchair Taxi Sydney Airport",
    metaTitle: "Wheelchair Taxi Sydney Airport | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible airport transfers to and from Sydney Airport's domestic and international terminals, with assistance for luggage and mobility equipment.",
    eyebrow: "Airport Transfers",
    h1: "Wheelchair Taxi Sydney Airport",
    heroDescription:
      "Accessible transfers to and from Sydney Airport's domestic and international terminals, built around flight times and mobility equipment.",
    image: { ...IMG.airport, alt: "Wheelchair taxi at Sydney Airport" },
    intro: [
      "Airport travel involves extra planning when a passenger uses a wheelchair or mobility scooter. We provide accessible transfers between Sydney Airport's terminals and homes, hotels, hospitals and aged care facilities, with drivers who can assist with luggage as well as mobility equipment.",
      "When booking, please share your flight details, pickup or drop-off terminal, luggage amount and wheelchair type so we can allocate a suitable vehicle and allow appropriate time for terminal access.",
    ],
    introItemsIntro: "Our airport transfer service covers:",
    introItems: [
      "Domestic and international terminal pickups and drop-offs",
      "Luggage assistance alongside wheelchair loading",
      "Flight delay monitoring where flight details are provided",
      "Transfers to hotels, homes, hospitals and aged care facilities",
    ],
    features: [
      {
        title: "Terminal Familiarity",
        description: "Our drivers are familiar with Sydney Airport's terminal layout and accessible pickup and drop-off points.",
      },
      {
        title: "Luggage & Equipment Assistance",
        description: "We can assist with luggage in addition to mobility equipment, subject to vehicle capacity.",
      },
      {
        title: "Flight-Aware Scheduling",
        description: "Share your flight number and we will factor it into your pickup planning.",
      },
    ],
    faq: [
      {
        question: "Do you monitor flight arrival times?",
        answer: "If you provide your flight number, we take it into account when planning your pickup, subject to availability.",
      },
      {
        question: "Can you transfer a powered wheelchair to the airport?",
        answer: "Yes, subject to wheelchair dimensions and vehicle availability. Please share wheelchair details when booking.",
      },
      {
        question: "How much luggage can you carry?",
        answer: "Luggage capacity depends on the vehicle and wheelchair size. Let us know your luggage amount so we can allocate a suitable vehicle.",
      },
    ],
  },
  {
    slug: "sydney-domestic-airport-wheelchair-taxi",
    navLabel: "Sydney Domestic Airport Wheelchair Taxi",
    metaTitle: "Sydney Domestic Airport Wheelchair Taxi | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transfers to and from Sydney Domestic Airport terminals, with drivers experienced in accessible airport pickups.",
    eyebrow: "Airport Transfers",
    h1: "Sydney Domestic Airport Wheelchair Taxi",
    heroDescription: "Accessible pickups and drop-offs at Sydney's domestic terminals, timed around your flight.",
    image: { ...IMG.airport, alt: "Wheelchair accessible vehicle at Sydney domestic airport terminal" },
    imageFirst: true,
    intro: [
      "Travelling through the domestic terminals with a wheelchair or mobility scooter is easier with a driver who knows the accessible pickup points and allows the right amount of time for boarding. We provide dedicated wheelchair accessible transport to and from Sydney's domestic terminals for interstate travellers, local passengers and connecting flights.",
      "Let us know your airline, flight number and terminal when booking so we can plan your pickup or drop-off accordingly.",
    ],
    introItemsIntro: "Helpful details when booking a domestic airport trip:",
    introItems: [
      "Airline and flight number",
      "Terminal (T2 or T3)",
      "Wheelchair or mobility scooter type",
      "Luggage amount",
    ],
    features: [
      {
        title: "Domestic Terminal Access",
        description: "We are familiar with accessible drop-off and pickup zones at Sydney's domestic terminals.",
      },
      {
        title: "Connecting Flight Support",
        description: "Travelling between flights? Let us know your connection window and we will plan accordingly.",
      },
      {
        title: "Interstate Traveller Friendly",
        description: "We assist interstate visitors who need accessible transport on arrival in Sydney.",
      },
    ],
    faq: [
      {
        question: "Which domestic terminals do you service?",
        answer: "We provide transfers to and from Sydney's domestic terminals (T2 and T3), subject to current terminal operations.",
      },
      {
        question: "Can you help with a tight connection between flights?",
        answer: "Let us know your connection window and we will do our best to plan a suitable pickup time.",
      },
      {
        question: "Do you service interstate visitors arriving in Sydney?",
        answer: "Yes, we regularly assist interstate visitors who need wheelchair accessible transport from the airport.",
      },
    ],
  },
  {
    slug: "wheelchair-taxi-international-airport",
    navLabel: "Wheelchair Taxi International Airport",
    metaTitle: "Wheelchair Taxi International Airport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transfers to and from Sydney's international airport terminal, with allowance for customs and immigration processing time.",
    eyebrow: "Airport Transfers",
    h1: "Wheelchair Taxi International Airport",
    heroDescription: "Accessible transfers to and from Sydney's international terminal, allowing time for customs and arrivals processing.",
    image: { ...IMG.airport, alt: "Wheelchair accessible vehicle at Sydney international airport" },
    intro: [
      "International arrivals often involve additional time for immigration, customs and baggage collection, which we factor into pickup planning when flight details are provided. Our drivers can meet passengers at the international terminal with appropriate allowance for processing time.",
      "For international departures, we recommend allowing extra buffer time ahead of check-in, particularly when travelling with mobility equipment that may require additional handling by the airline.",
    ],
    introItemsIntro: "When booking an international airport transfer, please share:",
    introItems: [
      "Flight number and airline",
      "Arrival or departure time",
      "Wheelchair or mobility equipment details",
      "Number of passengers and luggage",
    ],
    features: [
      {
        title: "Processing Time Allowance",
        description: "We build in extra time for customs, immigration and baggage collection where flight details are shared.",
      },
      {
        title: "International Traveller Support",
        description: "We regularly assist passengers arriving in Sydney for the first time who need accessible transport.",
      },
      {
        title: "Departure Planning",
        description: "For departures, we recommend early pickup times to allow for check-in and security processing.",
      },
    ],
    faq: [
      {
        question: "How much extra time should I allow after an international flight lands?",
        answer: "This varies depending on customs and immigration processing. Share your flight details and we will plan a suitable pickup window.",
      },
      {
        question: "Can you wait if my flight is delayed?",
        answer: "Where flight details are provided in advance, we monitor for changes and adjust where possible, subject to driver availability.",
      },
      {
        question: "Do you assist with international-sized mobility equipment?",
        answer: "Please share the type and dimensions of your mobility equipment so we can confirm vehicle suitability.",
      },
    ],
  },
  {
    slug: "western-sydney-airport-wheelchair-taxi",
    navLabel: "Western Sydney Airport Wheelchair Taxi",
    metaTitle: "Western Sydney Airport Wheelchair Taxi | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transport to and from Western Sydney Airport (Bradfield) and surrounding Western Sydney suburbs.",
    eyebrow: "Airport Transfers",
    h1: "Western Sydney Airport Wheelchair Taxi",
    heroDescription: "Accessible transport connecting Western Sydney Airport with homes, hospitals and communities across Western Sydney.",
    image: { ...IMG.airport, alt: "Wheelchair accessible vehicle serving Western Sydney" },
    imageFirst: true,
    intro: [
      "As Western Sydney Airport (Bradfield) develops, Wheelchair Taxi Sydney provides accessible transport connecting the surrounding suburbs, including Penrith, Blacktown, Liverpool and the broader Western Sydney region. We can arrange transfers to and from the airport precinct as services expand.",
      "For current airport transport needs in the Western Sydney area, our team can also assist with connections to Sydney Airport and other transport hubs.",
    ],
    introItemsIntro: "We provide accessible transport across Western Sydney for:",
    introItems: [
      "Airport and transport hub connections",
      "Hospital and medical appointments",
      "Aged care and NDIS travel",
      "Local and longer-distance trips",
    ],
    features: [
      {
        title: "Local Western Sydney Knowledge",
        description: "Our drivers are familiar with Western Sydney suburbs, roads and traffic patterns.",
      },
      {
        title: "Growing Service Area",
        description: "We continue to expand our coverage as Western Sydney's transport infrastructure develops.",
      },
      {
        title: "Accessible Fleet",
        description: "Vehicles suitable for manual wheelchairs, powered wheelchairs and mobility scooters, subject to availability.",
      },
    ],
    faq: [
      {
        question: "Do you currently service Western Sydney Airport?",
        answer: "We provide accessible transport across the Western Sydney region and can discuss current airport transfer options when you book.",
      },
      {
        question: "Which Western Sydney suburbs do you cover?",
        answer: "We service Penrith, Blacktown, Liverpool and surrounding Western Sydney suburbs, among others.",
      },
      {
        question: "Can you arrange a transfer between Western Sydney and Sydney Airport?",
        answer: "Yes, we provide accessible transfers between Western Sydney suburbs and Sydney's existing airport terminals.",
      },
    ],
  },

  // Medical & health transport
  {
    slug: "hospital-transport-sydney",
    navLabel: "Hospital Transport Sydney",
    metaTitle: "Hospital Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible hospital transport across Sydney for appointments, admissions and discharges, with assistance from trained drivers.",
    eyebrow: "Medical Transport",
    h1: "Hospital Transport Sydney",
    heroDescription: "Accessible transport for hospital appointments, admissions and discharges across Sydney.",
    image: { ...IMG.nursingHome, alt: "Wheelchair accessible vehicle used for hospital transport" },
    intro: [
      "Hospital visits can already be stressful, so we aim to make the transport part of the journey as smooth as possible. Our drivers assist with safe wheelchair loading and can help passengers who feel unwell or fatigued after a procedure or appointment.",
      "We provide transport to major Sydney hospitals for outpatient appointments, day procedures, discharges and transfers between health facilities.",
    ],
    introItemsIntro: "Hospital transport we provide includes:",
    introItems: [
      "Outpatient and specialist appointments",
      "Same-day procedure pickups and drop-offs",
      "Hospital discharge transport",
      "Transfers between hospitals and rehabilitation facilities",
    ],
    features: [
      {
        title: "Understanding of Hospital Precincts",
        description: "Our drivers are familiar with major Sydney hospital entrances and accessible pickup zones.",
      },
      {
        title: "Discharge-Ready Support",
        description: "We can accommodate passengers who may be more fatigued or unsteady following treatment.",
      },
      {
        title: "Flexible Timing",
        description: "Appointment times can shift; we do our best to accommodate reasonable changes with notice.",
      },
    ],
    faq: [
      {
        question: "Can you collect a passenger from inside the hospital?",
        answer: "Our drivers can typically meet passengers at hospital entrances or accessible pickup zones; please confirm details when booking.",
      },
      {
        question: "Do you provide hospital discharge transport?",
        answer: "Yes, we assist with discharge transport. We recommend booking as early as possible once a discharge time is known.",
      },
      {
        question: "Can a family member accompany the patient?",
        answer: "Yes, subject to available seating, family members or carers can usually travel alongside the patient.",
      },
    ],
  },
  {
    slug: "medical-appointment-transport-sydney",
    navLabel: "Medical Appointment Transport Sydney",
    metaTitle: "Medical Appointment Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Reliable wheelchair accessible transport for medical, specialist and allied health appointments across Sydney.",
    eyebrow: "Medical Transport",
    h1: "Medical Appointment Transport Sydney",
    heroDescription: "Wheelchair accessible transport for GP visits, specialist consultations and allied health appointments.",
    image: { ...IMG.interior, alt: "Wheelchair accessible vehicle interior used for medical appointment transport" },
    imageFirst: true,
    intro: [
      "Regular medical appointments are easier to manage with transport you can rely on. We provide wheelchair accessible trips to GP clinics, specialist rooms, allied health providers and diagnostic centres across Sydney.",
      "For passengers with standing appointments, our team can discuss arranging consistent transport around your appointment schedule.",
    ],
    introItemsIntro: "We provide transport for appointments including:",
    introItems: [
      "GP and specialist consultations",
      "Physiotherapy and allied health visits",
      "Diagnostic scans and pathology appointments",
      "Follow-up and review appointments",
    ],
    features: [
      {
        title: "Appointment-Focused Scheduling",
        description: "We plan pickup times around your appointment to help you arrive with time to spare.",
      },
      {
        title: "Return Trip Coordination",
        description: "Let us know your expected appointment length and we can arrange a return pickup.",
      },
      {
        title: "Recurring Booking Support",
        description: "For ongoing appointments, we can help set up a consistent transport arrangement.",
      },
    ],
    faq: [
      {
        question: "Can I book a return trip in advance?",
        answer: "Yes, let us know your estimated appointment length and we will arrange a return pickup time.",
      },
      {
        question: "Do you provide transport for regular specialist visits?",
        answer: "Yes, we can help arrange consistent transport for passengers with recurring appointments.",
      },
      {
        question: "What if my appointment runs late?",
        answer: "Please contact our team as soon as possible if your appointment overruns so we can adjust your return pickup where possible.",
      },
    ],
  },
  {
    slug: "dialysis-transport-sydney",
    navLabel: "Dialysis Transport Sydney",
    metaTitle: "Dialysis Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible dialysis transport across Sydney, supporting patients with regular treatment schedules.",
    eyebrow: "Medical Transport",
    h1: "Dialysis Transport Sydney",
    heroDescription: "Dependable, accessible transport for patients attending regular dialysis treatment across Sydney.",
    image: { ...IMG.nursingHome, alt: "Wheelchair accessible vehicle used for dialysis transport" },
    intro: [
      "Dialysis treatment often follows a fixed weekly schedule, and reliable transport is an important part of managing that routine. We work with patients, families and treatment centres to arrange consistent pickup and drop-off times around dialysis sessions.",
      "Our drivers understand that patients may feel fatigued after treatment, and we aim to provide a calm, unhurried experience for the return journey.",
    ],
    introItemsIntro: "Our dialysis transport support includes:",
    introItems: [
      "Regular weekly or multi-day scheduled transport",
      "Coordination around treatment centre timing",
      "Assistance for patients who feel fatigued post-treatment",
      "Wheelchair and mobility aid transport",
    ],
    features: [
      {
        title: "Routine-Friendly Scheduling",
        description: "We aim to support consistent pickup times that fit around your treatment days.",
      },
      {
        title: "Post-Treatment Care",
        description: "Drivers allow extra time and patience for passengers who may feel unwell after dialysis.",
      },
      {
        title: "Treatment Centre Familiarity",
        description: "We are experienced with pickup and drop-off arrangements at Sydney dialysis centres.",
      },
    ],
    faq: [
      {
        question: "Can you arrange transport for multiple sessions per week?",
        answer: "Yes, we can discuss a recurring transport arrangement based on your treatment schedule.",
      },
      {
        question: "What happens if my treatment finishes earlier or later than expected?",
        answer: "Please contact our team as soon as timing changes so we can adjust your pickup where possible.",
      },
      {
        question: "Can you help if I feel unwell after treatment?",
        answer: "Our drivers are experienced in assisting patients who may feel fatigued and will take the time needed for a comfortable journey.",
      },
    ],
  },
  {
    slug: "rehabilitation-transport-sydney",
    navLabel: "Rehabilitation Transport Sydney",
    metaTitle: "Rehabilitation Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible transport for rehabilitation appointments and facility transfers across Sydney.",
    eyebrow: "Medical Transport",
    h1: "Rehabilitation Transport Sydney",
    heroDescription: "Accessible transport for patients attending rehabilitation appointments and facility transfers.",
    image: { ...IMG.vanAssistance, alt: "Driver assisting a rehabilitation patient into a wheelchair accessible vehicle" },
    imageFirst: true,
    intro: [
      "Recovery and rehabilitation programs often involve regular visits to therapy centres or hospitals, sometimes while a patient's mobility is still improving. We provide wheelchair accessible transport suited to these transitional periods, with drivers who understand the extra care that may be needed.",
      "Our team can also assist with transfers between hospital, rehabilitation facilities and home as part of a discharge or recovery plan.",
    ],
    introItemsIntro: "Rehabilitation transport support includes:",
    introItems: [
      "Transport to physiotherapy and occupational therapy sessions",
      "Transfers between hospital and rehabilitation facilities",
      "Discharge-to-home transport",
      "Ongoing appointment transport during recovery",
    ],
    features: [
      {
        title: "Recovery-Aware Assistance",
        description: "Drivers are mindful that mobility and confidence can change during a recovery journey.",
      },
      {
        title: "Facility Transfer Support",
        description: "We assist with coordinated transfers between hospitals, rehab centres and home.",
      },
      {
        title: "Consistent Scheduling",
        description: "We can help arrange regular transport for ongoing rehabilitation programs.",
      },
    ],
    faq: [
      {
        question: "Can you help transport a patient whose mobility is changing during recovery?",
        answer: "Yes, please let us know current mobility needs when booking so we can allocate a suitable vehicle and allow appropriate time.",
      },
      {
        question: "Do you assist with hospital-to-rehab transfers?",
        answer: "Yes, we can coordinate transfers between hospitals, rehabilitation facilities and home.",
      },
      {
        question: "Can transport needs change between bookings?",
        answer: "Yes, simply update our team on any change in mobility equipment or assistance needs before your next trip.",
      },
    ],
  },

  // Wheelchair & accessibility
  {
    slug: "wheelchair-taxi-for-electric-wheelchairs",
    navLabel: "Wheelchair Taxi for Electric Wheelchairs",
    metaTitle: "Wheelchair Taxi for Electric Wheelchairs Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible taxis suitable for many electric and powered wheelchairs across Sydney, subject to size and weight requirements.",
    eyebrow: "Wheelchair & Accessibility",
    h1: "Wheelchair Taxi for Electric Wheelchairs",
    heroDescription: "Accessible vehicles suited to many electric and powered wheelchairs, subject to dimensions and vehicle availability.",
    image: { src: "/images/powered-wheelchair.webp", alt: "Electric powered wheelchair suitable for wheelchair taxi transport", width: 600, height: 400 },
    intro: [
      "Electric and powered wheelchairs vary significantly in size, weight and turning requirements, which is why we ask for equipment details before confirming a booking. Our fleet includes vehicles designed to accommodate many standard and large powered wheelchairs, subject to dimensions, combined weight and securement compatibility.",
      "Providing accurate measurements when booking helps us allocate the most suitable vehicle and avoid delays on the day of travel.",
    ],
    introItemsIntro: "Please have the following details ready when booking:",
    introItems: [
      "Approximate width, length and height",
      "Estimated combined weight of wheelchair and passenger",
      "Folding or non-folding wheelchair",
      "Any additional attached equipment",
    ],
    features: [
      {
        title: "Vehicles for Larger Equipment",
        description: "Our fleet includes vehicles suited to many large powered wheelchairs, subject to dimensions and availability.",
      },
      {
        title: "Secure Restraint Systems",
        description: "Vehicles are fitted with restraint systems designed to secure powered wheelchairs safely for travel.",
      },
      {
        title: "Pre-Trip Equipment Checks",
        description: "We confirm wheelchair details in advance to reduce the chance of on-the-day surprises.",
      },
    ],
    faq: [
      {
        question: "What size electric wheelchairs can you transport?",
        answer: "Suitability depends on wheelchair dimensions, weight and vehicle availability. Please share measurements when booking so we can confirm.",
      },
      {
        question: "Do I need to fold my powered wheelchair?",
        answer: "No, our accessible vehicles are designed for non-folding wheelchairs, though please confirm details when booking.",
      },
      {
        question: "How is my electric wheelchair secured during the trip?",
        answer: "Our vehicles use restraint systems designed to secure wheelchairs safely for the duration of the journey.",
      },
    ],
  },
  {
    slug: "wheelchair-taxi-for-manual-wheelchairs",
    navLabel: "Wheelchair Taxi for Manual Wheelchairs",
    metaTitle: "Wheelchair Taxi for Manual Wheelchairs Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible taxis suitable for most standard manual wheelchairs across Sydney, with safe loading and restraint systems.",
    eyebrow: "Wheelchair & Accessibility",
    h1: "Wheelchair Taxi for Manual Wheelchairs",
    heroDescription: "Accessible vehicles suited to most standard manual wheelchairs, with safe loading and secure restraints.",
    image: { src: "/images/manual-wheelchair.webp", alt: "Manual wheelchair suitable for wheelchair taxi transport", width: 600, height: 400 },
    imageFirst: true,
    intro: [
      "Manual wheelchairs are among the most common mobility devices we transport, and our vehicles are set up to accommodate most standard sizes safely and comfortably. Our drivers are trained to load and secure manual wheelchairs correctly before every trip.",
      "If your manual wheelchair has non-standard dimensions or additional attachments, let us know when booking so we can confirm vehicle suitability.",
    ],
    introItemsIntro: "Manual wheelchair transport includes:",
    introItems: [
      "Safe ramp or lift boarding, where fitted",
      "Secure wheelchair restraint for the journey",
      "Assistance with folding wheelchairs if required",
      "Support for passengers travelling with a carer",
    ],
    features: [
      {
        title: "Widely Compatible Vehicles",
        description: "Our fleet accommodates most standard manual wheelchair dimensions.",
      },
      {
        title: "Trained Loading Assistance",
        description: "Drivers are trained to safely load, position and secure manual wheelchairs.",
      },
      {
        title: "Carer-Friendly Seating",
        description: "Most vehicles have room for a carer or family member to travel alongside the passenger.",
      },
    ],
    faq: [
      {
        question: "Do you need my wheelchair to be folded?",
        answer: "In most cases no, but please let us know your wheelchair's dimensions so we can confirm the right vehicle.",
      },
      {
        question: "Can my carer travel with me?",
        answer: "Yes, most of our vehicles have space for a carer or family member to accompany you.",
      },
      {
        question: "How is my wheelchair secured during the trip?",
        answer: "We use vehicle restraint systems designed to hold manual wheelchairs securely in place for the journey.",
      },
    ],
  },
  {
    slug: "wheelchair-taxi-for-mobility-scooters",
    navLabel: "Wheelchair Taxi for Mobility Scooters",
    metaTitle: "Wheelchair Taxi for Mobility Scooters Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible taxis suitable for many three and four-wheel mobility scooters across Sydney, subject to dimensions and weight.",
    eyebrow: "Wheelchair & Accessibility",
    h1: "Wheelchair Taxi for Mobility Scooters",
    heroDescription: "Accessible vehicles suited to many mobility scooters, subject to size, weight and vehicle availability.",
    image: { src: "/images/mobility-scooter.webp", alt: "Mobility scooter suitable for wheelchair taxi transport", width: 600, height: 400 },
    intro: [
      "Mobility scooters range widely in size and turning circle, so we assess each booking individually based on the scooter's dimensions and combined weight with the passenger. Our fleet includes vehicles suited to many three and four-wheel scooters, subject to securement compatibility.",
      "Sharing accurate scooter measurements when booking helps us confirm suitability and allocate the right vehicle for your trip.",
    ],
    introItemsIntro: "Helpful scooter details for your booking:",
    introItems: [
      "Scooter type (three or four-wheel)",
      "Approximate length, width and turning circle",
      "Combined weight of scooter and passenger",
      "Any accessories or attachments fitted to the scooter",
    ],
    features: [
      {
        title: "Scooter-Compatible Fleet",
        description: "We operate vehicles designed to accommodate many mobility scooter sizes, subject to availability.",
      },
      {
        title: "Secure Boarding",
        description: "Drivers assist with safe ramp boarding and correct scooter positioning inside the vehicle.",
      },
      {
        title: "Weight & Dimension Checks",
        description: "We confirm scooter specifications ahead of time to help avoid on-the-day issues.",
      },
    ],
    faq: [
      {
        question: "Can you transport a four-wheel mobility scooter?",
        answer: "Many four-wheel scooters can be accommodated, subject to dimensions, weight and vehicle availability. Please share details when booking.",
      },
      {
        question: "Do I need to transfer to a seat during the trip?",
        answer: "This depends on the vehicle and scooter type. Our team can advise the most suitable arrangement when you book.",
      },
      {
        question: "How is my scooter secured in the vehicle?",
        answer: "Vehicles are fitted with restraint systems designed to secure mobility scooters safely for travel.",
      },
    ],
  },

  // Wheelchair taxi services
  {
    slug: "door-to-door-wheelchair-transport",
    navLabel: "Door-to-Door Wheelchair Transport",
    metaTitle: "Door-to-Door Wheelchair Transport Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Door-to-door wheelchair accessible transport across Sydney, with drivers assisting passengers from pickup point to final destination.",
    eyebrow: "Wheelchair Taxi Services",
    h1: "Door-to-Door Wheelchair Transport",
    heroDescription: "Accessible transport with assistance from your door to your destination, not just kerb to kerb.",
    image: { ...IMG.vanAssistance, alt: "Driver providing door-to-door assistance for a wheelchair passenger" },
    imageFirst: true,
    intro: [
      "Door-to-door transport means our drivers assist passengers from their starting point, such as a home entrance or facility room, through to final drop-off, rather than just kerb-to-kerb pickup. This can make a meaningful difference for passengers who need extra support navigating driveways, ramps or building entrances.",
      "Let us know if your pickup or drop-off location has specific access requirements so your driver can plan accordingly.",
    ],
    introItemsIntro: "Door-to-door assistance can include:",
    introItems: [
      "Meeting passengers at a home, facility or building entrance",
      "Assistance navigating ramps, driveways or lobbies",
      "Support with luggage or personal items",
      "Confirming safe arrival at the final destination",
    ],
    features: [
      {
        title: "Beyond Kerbside Pickup",
        description: "Our drivers can assist from entrance to entrance, not just at the roadside.",
      },
      {
        title: "Access-Aware Planning",
        description: "Tell us about ramps, stairs or narrow driveways so your driver can plan the safest approach.",
      },
      {
        title: "Consistent Assistance Both Ways",
        description: "The same level of support applies at pickup and at your final destination.",
      },
    ],
    faq: [
      {
        question: "Will the driver come to my door?",
        answer: "Yes, where access allows, our drivers can meet you at your door or building entrance rather than only at the kerb.",
      },
      {
        question: "What if my building has stairs or a narrow driveway?",
        answer: "Please share these details when booking so your driver can plan a safe and suitable approach.",
      },
      {
        question: "Does door-to-door service cost extra?",
        answer: "Door-to-door assistance is part of our standard service approach; contact us for a fare quote based on your trip.",
      },
    ],
  },
  {
    slug: "private-wheelchair-taxi-service",
    navLabel: "Private Wheelchair Taxi Service",
    metaTitle: "Private Wheelchair Taxi Service Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Private, individually booked wheelchair accessible taxi service across Sydney for passengers who prefer a dedicated vehicle and driver.",
    eyebrow: "Wheelchair Taxi Services",
    h1: "Private Wheelchair Taxi Service",
    heroDescription: "A dedicated, individually booked wheelchair accessible vehicle for your journey, without shared trips.",
    image: { ...IMG.interior, alt: "Interior of a private wheelchair accessible taxi" },
    intro: [
      "Some passengers prefer a private, individually booked vehicle rather than a shared transport arrangement, whether for comfort, timing or personal preference. Our private wheelchair taxi service is booked exclusively for you and your travelling companions.",
      "This option suits passengers travelling to time-sensitive appointments, events, or those who simply prefer a dedicated journey from pickup to drop-off.",
    ],
    introItemsIntro: "Our private service is well suited to:",
    introItems: [
      "Time-sensitive medical or business appointments",
      "Passengers who prefer not to share a vehicle",
      "Family outings and personal events",
      "Longer trips where a dedicated vehicle offers more flexibility",
    ],
    features: [
      {
        title: "Dedicated Vehicle & Driver",
        description: "Your booking is not shared with other passengers outside your travelling party.",
      },
      {
        title: "Flexible Trip Planning",
        description: "Private bookings can accommodate multiple stops or waiting time, subject to arrangement.",
      },
      {
        title: "Consistent Comfort",
        description: "A private vehicle allows a more relaxed, unhurried journey for passengers who prefer it.",
      },
    ],
    faq: [
      {
        question: "Is the vehicle shared with other passengers?",
        answer: "No, our private wheelchair taxi service is booked exclusively for you and your travelling party.",
      },
      {
        question: "Can I book multiple stops on one trip?",
        answer: "Yes, please discuss your itinerary with our booking team so we can plan and quote accordingly.",
      },
      {
        question: "Is private service available for longer trips?",
        answer: "Yes, subject to vehicle availability. Contact us with your trip details for a quote.",
      },
    ],
  },
  {
    slug: "same-day-wheelchair-taxi",
    navLabel: "Same-Day Wheelchair Taxi",
    metaTitle: "Same-Day Wheelchair Taxi Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Same-day wheelchair accessible taxi bookings across Sydney, subject to vehicle and driver availability.",
    eyebrow: "Wheelchair Taxi Services",
    h1: "Same-Day Wheelchair Taxi",
    heroDescription: "Same-day wheelchair accessible transport bookings, subject to vehicle and driver availability.",
    image: { ...IMG.maxiVan, alt: "Wheelchair taxi van available for same-day bookings" },
    imageFirst: true,
    intro: [
      "While we generally recommend pre-booking wheelchair accessible transport, particularly for medical appointments, we understand that same-day travel needs can arise. Our team will do their best to accommodate short-notice requests, subject to vehicle and driver availability at the time.",
      "For the best chance of same-day availability, please call our booking team directly rather than relying solely on an online request.",
    ],
    introItemsIntro: "For a faster same-day booking, please have ready:",
    introItems: [
      "Pickup and destination addresses",
      "Wheelchair or mobility device type",
      "Number of passengers",
      "Preferred pickup time",
    ],
    features: [
      {
        title: "Best-Effort Availability",
        description: "We aim to accommodate same-day requests where a suitable vehicle and driver are available.",
      },
      {
        title: "Direct Phone Booking",
        description: "Calling our team directly is the fastest way to check same-day availability.",
      },
      {
        title: "Clear Communication",
        description: "If a same-day request cannot be accommodated, we will let you know as early as possible.",
      },
    ],
    faq: [
      {
        question: "Can you guarantee same-day availability?",
        answer: "Same-day bookings are subject to vehicle and driver availability at the time of your request and cannot always be guaranteed.",
      },
      {
        question: "What is the best way to request a same-day trip?",
        answer: "Calling our booking team directly is generally the fastest way to check same-day availability.",
      },
      {
        question: "Should I still pre-book if I can?",
        answer: "Yes, pre-booking is recommended where possible, particularly for medical appointments and airport transfers.",
      },
    ],
  },
  {
    slug: "advance-wheelchair-taxi-booking",
    navLabel: "Advance Wheelchair Taxi Booking",
    metaTitle: "Advance Wheelchair Taxi Booking Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Pre-book wheelchair accessible transport in advance across Sydney for appointments, travel and recurring trips.",
    eyebrow: "Wheelchair Taxi Services",
    h1: "Advance Wheelchair Taxi Booking",
    heroDescription: "Plan ahead with advance wheelchair accessible bookings for appointments, travel and recurring trips.",
    image: { ...IMG.booking, alt: "Passenger completing an advance wheelchair taxi booking" },
    intro: [
      "For appointments, airport transfers and events where timing matters, we recommend booking your wheelchair accessible transport in advance. Advance bookings give our team time to confirm the most suitable vehicle for your wheelchair or mobility device and plan around your schedule.",
      "You can arrange advance bookings for a single upcoming trip or set up a recurring arrangement for regular appointments.",
    ],
    introItemsIntro: "Advance bookings are especially useful for:",
    introItems: [
      "Hospital and specialist appointments",
      "Airport transfers with fixed flight times",
      "Weddings, events and family occasions",
      "Recurring weekly or monthly appointments",
    ],
    features: [
      {
        title: "Guaranteed Planning Time",
        description: "Booking ahead allows us to plan the most suitable vehicle and driver for your trip.",
      },
      {
        title: "Recurring Booking Options",
        description: "We can help set up standing bookings for passengers with regular appointments.",
      },
      {
        title: "Peace of Mind for Events",
        description: "For time-sensitive events, advance booking reduces the risk of availability issues on the day.",
      },
    ],
    faq: [
      {
        question: "How far in advance can I book?",
        answer: "You can generally book as far ahead as needed; contact our team to arrange your preferred date and time.",
      },
      {
        question: "Can I set up a recurring booking?",
        answer: "Yes, we can help arrange recurring transport for passengers with regular appointments.",
      },
      {
        question: "Can I change an advance booking later?",
        answer: "Yes, please contact our team as soon as possible if your plans change so we can update your booking.",
      },
    ],
  },

  // Wheelchair taxi booking / general
  {
    slug: "wheelchair-taxi-number",
    navLabel: "Wheelchair Taxi Number",
    metaTitle: "Wheelchair Taxi Number Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Contact Wheelchair Taxi Sydney by phone, email or WhatsApp to book accessible transport or ask a question.",
    eyebrow: "Contact & Booking",
    h1: "Wheelchair Taxi Number",
    heroDescription: "Call, email or message our team to book wheelchair accessible transport across Sydney.",
    image: { ...IMG.booking, alt: "Contact details for booking a wheelchair taxi in Sydney" },
    imageFirst: true,
    intro: [
      "You can reach our booking team by phone, email or WhatsApp to arrange wheelchair accessible transport or ask about our service. Having your trip details ready, such as pickup and destination, wheelchair type and preferred time, helps us confirm your booking quickly.",
      "For urgent or same-day requests, calling directly is usually the fastest way to check availability.",
    ],
    introItemsIntro: "Ways to reach us:",
    introItems: [
      "Phone for bookings and enquiries",
      "Email for non-urgent requests and information",
      "WhatsApp for quick messages",
      "Online enquiry form on our website",
    ],
    features: [
      {
        title: "Multiple Contact Options",
        description: "Reach us by phone, email or WhatsApp, whichever suits you best.",
      },
      {
        title: "Fast Response for Bookings",
        description: "Our team aims to respond promptly to booking enquiries, particularly urgent requests.",
      },
      {
        title: "Friendly Booking Support",
        description: "We are happy to answer questions about vehicle suitability, pricing or service areas.",
      },
    ],
    faq: [
      {
        question: "What is the best way to book a wheelchair taxi?",
        answer: "Calling our team directly is usually the fastest way, particularly for urgent or same-day trips.",
      },
      {
        question: "Can I book by email?",
        answer: "Yes, though for time-sensitive bookings we recommend calling to confirm availability more quickly.",
      },
      {
        question: "Is WhatsApp available for bookings?",
        answer: "Yes, you can message our team on WhatsApp for quick enquiries and booking requests.",
      },
    ],
  },
  {
    slug: "wheelchair-accessible-taxi",
    navLabel: "Wheelchair Accessible Taxi",
    metaTitle: "Wheelchair Accessible Taxi Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible taxi service across Sydney, with vehicles suited to a range of wheelchairs and mobility devices.",
    eyebrow: "Accessible Transport",
    h1: "Wheelchair Accessible Taxi",
    heroDescription: "A wheelchair accessible taxi service built around the needs of Sydney passengers with mobility equipment.",
    image: { ...IMG.interior, alt: "Interior of a wheelchair accessible taxi" },
    intro: [
      "A genuinely wheelchair accessible taxi is about more than a ramp; it requires the right vehicle, trained drivers and a booking process that accounts for each passenger's equipment and needs. We aim to provide that combination across every trip we operate.",
      "Our fleet is regularly maintained and set up to support a range of wheelchairs and mobility devices, subject to individual vehicle specifications.",
    ],
    introItemsIntro: "What makes our accessible taxi service different:",
    introItems: [
      "Vehicles fitted with ramps or lifts, depending on the model",
      "Drivers trained in safe wheelchair loading and securement",
      "A booking process that confirms your equipment before travel",
      "Support for carers and family members travelling together",
    ],
    features: [
      {
        title: "Purpose-Built Vehicles",
        description: "Our fleet is designed and maintained specifically for wheelchair accessible transport.",
      },
      {
        title: "Trained, Experienced Drivers",
        description: "Drivers understand safe boarding, positioning and securement for a range of mobility devices.",
      },
      {
        title: "Detail-Focused Booking",
        description: "We confirm wheelchair type and passenger needs ahead of every trip.",
      },
    ],
    faq: [
      {
        question: "What makes a taxi 'wheelchair accessible'?",
        answer: "It typically means the vehicle has a ramp or lift, secure wheelchair restraints, and enough interior space for safe boarding and travel.",
      },
      {
        question: "Can you accommodate different wheelchair types in one fleet?",
        answer: "Yes, our fleet includes vehicles suited to a range of manual and powered wheelchairs, subject to individual vehicle specifications.",
      },
      {
        question: "Do drivers receive specific training?",
        answer: "Yes, our drivers are trained in safe wheelchair loading, positioning and passenger assistance.",
      },
    ],
  },
  {
    slug: "wheelchair-taxi-service-near-me",
    navLabel: "Wheelchair Taxi Service Near Me",
    metaTitle: "Wheelchair Taxi Service Near Me | Wheelchair Taxi Sydney",
    metaDescription:
      "Find a local wheelchair taxi service across Sydney suburbs, including Parramatta, Liverpool, Blacktown, Penrith and Campbelltown.",
    eyebrow: "Local Service",
    h1: "Wheelchair Taxi Service Near Me",
    heroDescription: "Local wheelchair accessible transport across Sydney's suburbs, from the Eastern Suburbs to Western Sydney.",
    image: { ...IMG.organisations, alt: "Wheelchair taxi providing local transport across Sydney suburbs" },
    imageFirst: true,
    intro: [
      "Wherever you are across Sydney, our wheelchair accessible fleet can typically reach you, from the Eastern Suburbs and Sydney CBD to Western Sydney, the Inner West and Southern Sydney. Local trips, whether to the shops, a family visit or a nearby appointment, are just as important to us as longer journeys.",
      "Contact our team with your suburb and pickup details and we will confirm the most suitable vehicle for your local trip.",
    ],
    introItemsIntro: "We provide local accessible transport across areas including:",
    introItems: [
      "Sydney CBD and Inner West",
      "Eastern Suburbs and Northern Sydney",
      "Western Sydney including Parramatta, Blacktown and Penrith",
      "South West Sydney including Liverpool and Campbelltown",
    ],
    features: [
      {
        title: "Wide Sydney Coverage",
        description: "Our fleet covers suburbs across Sydney, subject to vehicle availability.",
      },
      {
        title: "Local Trip Friendly",
        description: "We are just as happy to help with a short local trip as a longer journey.",
      },
      {
        title: "Suburb-Aware Drivers",
        description: "Drivers are familiar with local roads, traffic conditions and accessible pickup points.",
      },
    ],
    faq: [
      {
        question: "Do you service my suburb?",
        answer: "We cover a wide range of Sydney suburbs; contact us with your location to confirm availability.",
      },
      {
        question: "Do you take short local trips?",
        answer: "Yes, we assist with local trips such as shopping, appointments and family visits, not just longer journeys.",
      },
      {
        question: "Is pricing different for local trips?",
        answer: "Fares are based on your specific trip details. Contact us for a quote based on your pickup and destination.",
      },
    ],
  },
  {
    slug: "wheelchair-taxi-booking",
    navLabel: "Wheelchair Taxi Booking Online",
    metaTitle: "Wheelchair Taxi Booking Online Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Book a wheelchair accessible taxi online across Sydney by sharing your pickup, destination and mobility equipment details.",
    eyebrow: "Online Booking",
    h1: "Wheelchair Taxi Booking Online",
    heroDescription: "Request a wheelchair accessible taxi online by sharing your trip and mobility equipment details.",
    image: { ...IMG.booking, alt: "Person booking a wheelchair taxi online" },
    intro: [
      "Booking online is a convenient way to arrange wheelchair accessible transport without needing to call, particularly for non-urgent trips. Our online enquiry form collects the key details our team needs to confirm a suitable vehicle for your journey.",
      "Once submitted, our team will follow up to confirm your booking and answer any questions about your trip.",
    ],
    introItemsIntro: "Information to include in an online booking:",
    introItems: [
      "Pickup and destination addresses",
      "Preferred date and time",
      "Wheelchair or mobility device type",
      "Number of passengers and any special requirements",
    ],
    features: [
      {
        title: "Convenient Online Form",
        description: "Submit your trip details online at a time that suits you.",
      },
      {
        title: "Follow-Up Confirmation",
        description: "Our team reviews and confirms online bookings, following up on any missing details.",
      },
      {
        title: "Best for Non-Urgent Trips",
        description: "For same-day or urgent trips, calling directly is generally faster than an online request.",
      },
    ],
    faq: [
      {
        question: "How quickly will my online booking be confirmed?",
        answer: "Our team aims to follow up promptly, though for urgent trips we recommend calling directly.",
      },
      {
        question: "Can I request a specific vehicle type online?",
        answer: "Yes, please include your wheelchair or mobility device details so we can allocate a suitable vehicle.",
      },
      {
        question: "Can I amend an online booking after submitting it?",
        answer: "Yes, please contact our team as soon as possible with any changes to your trip.",
      },
    ],
  },
  {
    slug: "disabled-taxi-service",
    navLabel: "Disabled Taxi Service",
    metaTitle: "Disabled Taxi Service Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Accessible disabled taxi service across Sydney, supporting passengers with a range of mobility and accessibility needs.",
    eyebrow: "Accessible Transport",
    h1: "Disabled Taxi Service",
    heroDescription: "An accessible taxi service supporting Sydney passengers with a range of mobility and accessibility needs.",
    image: { ...IMG.organisations, alt: "Accessible taxi service supporting passengers with disability" },
    imageFirst: true,
    intro: [
      "Accessibility needs vary from passenger to passenger, and our disabled taxi service is built to accommodate a range of requirements, from wheelchair and mobility scooter users to passengers who simply need additional time or assistance boarding.",
      "Our booking team will discuss your specific needs before confirming a trip, so your driver arrives prepared to assist appropriately.",
    ],
    introItemsIntro: "We support passengers with needs including:",
    introItems: [
      "Wheelchair and mobility scooter users",
      "Passengers requiring additional boarding assistance",
      "Vision or hearing impairment support on request",
      "Carers and support workers travelling alongside passengers",
    ],
    features: [
      {
        title: "Individualised Support",
        description: "We tailor assistance to each passenger's specific accessibility needs.",
      },
      {
        title: "Respectful, Patient Drivers",
        description: "Our drivers are trained to provide assistance in a respectful, unhurried manner.",
      },
      {
        title: "Accessible Vehicle Fleet",
        description: "Vehicles are equipped to support a range of mobility equipment and accessibility needs.",
      },
    ],
    faq: [
      {
        question: "Do you only transport wheelchair users?",
        answer: "No, we support passengers with a range of accessibility needs, not only wheelchair users.",
      },
      {
        question: "Can I request specific assistance when booking?",
        answer: "Yes, please share any specific assistance requirements so your driver can be prepared.",
      },
      {
        question: "Can a support worker travel with the passenger?",
        answer: "Yes, our vehicles generally have room for a support worker or carer to travel alongside the passenger.",
      },
    ],
  },
  {
    slug: "silver-service-wheelchair-taxi-sydney",
    navLabel: "Silver Service Wheelchair Taxi Sydney",
    metaTitle: "Silver Service Wheelchair Taxi Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "A premium, comfort-focused wheelchair accessible taxi option across Sydney for passengers seeking a higher standard of vehicle and service.",
    eyebrow: "Premium Accessible Transport",
    h1: "Silver Service Wheelchair Taxi Sydney",
    heroDescription: "A premium, comfort-focused option for passengers who want a higher standard of wheelchair accessible vehicle and service.",
    image: { ...IMG.silverService, alt: "Premium wheelchair accessible vehicle in Sydney" },
    intro: [
      "For passengers who want a more premium travel experience alongside full wheelchair accessibility, we can discuss higher-comfort vehicle options depending on availability. This can suit business travel, special occasions or passengers who simply prefer a higher standard of vehicle presentation.",
      "Please contact our team directly to discuss availability, as premium vehicle options depend on fleet allocation on the day.",
    ],
    introItemsIntro: "Silver service enquiries typically involve:",
    introItems: [
      "Business and corporate travel",
      "Special occasions and events",
      "Passengers seeking a higher comfort standard",
      "Advance booking to confirm vehicle availability",
    ],
    features: [
      {
        title: "Comfort-Focused Vehicles",
        description: "We discuss higher-comfort vehicle options with passengers seeking a premium experience.",
      },
      {
        title: "Professional Presentation",
        description: "Drivers maintain a professional standard suited to business and special occasion travel.",
      },
      {
        title: "Advance Booking Recommended",
        description: "Premium vehicle availability is limited, so early booking is recommended.",
      },
    ],
    faq: [
      {
        question: "Is silver service available for every booking?",
        answer: "Premium vehicle availability depends on fleet allocation. Please contact us in advance to check availability for your date.",
      },
      {
        question: "Does silver service cost more than a standard trip?",
        answer: "Pricing depends on vehicle type and trip details. Contact our team for a quote.",
      },
      {
        question: "Can I book silver service for a special event?",
        answer: "Yes, please contact us with your event date and requirements as early as possible.",
      },
    ],
  },
  {
    slug: "wheelchair-accessible-taxi-in-sydney",
    navLabel: "Wheelchair Accessible Taxi In Sydney",
    metaTitle: "Wheelchair Accessible Taxi In Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Wheelchair accessible taxi coverage across Sydney, including the CBD, airport precinct and surrounding suburbs.",
    eyebrow: "Accessible Transport",
    h1: "Wheelchair Accessible Taxi In Sydney",
    heroDescription: "Accessible taxi coverage across the Sydney CBD, airport precinct and surrounding suburbs.",
    image: { ...IMG.transitCustom, alt: "Wheelchair accessible vehicle operating in Sydney" },
    imageFirst: true,
    intro: [
      "Sydney's mix of CBD traffic, harbour crossings and spread-out suburbs means accessible transport needs to be planned carefully. Our drivers are experienced navigating the city, including access to the CBD, Sydney Airport and surrounding areas, with attention to timing around peak traffic periods.",
      "Whether your trip is a short CBD hop or a longer suburb-to-suburb journey, we plan routes with your comfort and appointment timing in mind.",
    ],
    introItemsIntro: "Sydney-wide accessible transport includes:",
    introItems: [
      "Sydney CBD pickups and drop-offs",
      "Airport and cruise terminal transfers",
      "Cross-suburb medical and personal trips",
      "Peak-hour aware route planning",
    ],
    features: [
      {
        title: "City & Suburb Experience",
        description: "Our drivers are experienced across both CBD driving and outer suburb routes.",
      },
      {
        title: "Traffic-Aware Timing",
        description: "We factor in peak traffic periods when planning appointment and airport pickups.",
      },
      {
        title: "Consistent Accessible Standard",
        description: "The same accessibility standard applies whether your trip is in the city or the suburbs.",
      },
    ],
    faq: [
      {
        question: "Do you operate throughout the Sydney CBD?",
        answer: "Yes, we provide wheelchair accessible pickups and drop-offs throughout the Sydney CBD.",
      },
      {
        question: "How do you plan around Sydney traffic?",
        answer: "We consider peak traffic periods when planning appointment and airport pickup times, particularly for time-sensitive trips.",
      },
      {
        question: "Can you handle both short and long trips?",
        answer: "Yes, we assist with everything from short local trips to longer cross-Sydney journeys.",
      },
    ],
  },
  {
    slug: "wheelchair-sydney-taxi-fare-estimator",
    navLabel: "Wheelchair Sydney Taxi Fare Estimator",
    metaTitle: "Wheelchair Taxi Fare Estimator Sydney | Wheelchair Taxi Sydney",
    metaDescription:
      "Get an idea of wheelchair taxi fares in Sydney based on distance, vehicle type and trip requirements. Contact us for an exact quote.",
    eyebrow: "Fares & Pricing",
    h1: "Wheelchair Taxi Fare Estimator",
    heroDescription: "Understand how wheelchair taxi fares are calculated and request an accurate quote for your trip.",
    image: { ...IMG.fareEstimator, alt: "Wheelchair taxi fare estimation illustration" },
    intro: [
      "Wheelchair accessible taxi fares typically reflect a combination of factors: distance travelled, vehicle type required, time of day and any additional assistance needed. Because every trip is different, we recommend contacting our team directly for an accurate quote rather than relying on a generic estimate.",
      "Sharing full trip details upfront, including pickup, destination and wheelchair type, helps us provide the most accurate fare information.",
    ],
    introItemsIntro: "Fare estimates typically depend on:",
    introItems: [
      "Distance and estimated trip duration",
      "Vehicle type required for your wheelchair or mobility device",
      "Time of day and day of the week",
      "Any additional stops or waiting time",
    ],
    features: [
      {
        title: "Personalised Quotes",
        description: "We provide fare information based on your specific trip details rather than a flat estimate.",
      },
      {
        title: "Transparent Pricing Approach",
        description: "We aim to explain how fare factors apply to your trip before you confirm a booking.",
      },
      {
        title: "No-Obligation Enquiries",
        description: "You can request a quote before deciding whether to proceed with a booking.",
      },
    ],
    faq: [
      {
        question: "How do I get an accurate fare quote?",
        answer: "Contact our team with your pickup, destination and wheelchair type for an accurate, trip-specific quote.",
      },
      {
        question: "Do fares vary by vehicle type?",
        answer: "Yes, fares can vary depending on the vehicle required for your wheelchair or mobility device.",
      },
      {
        question: "Are there additional charges for waiting time?",
        answer: "Waiting time may affect your fare depending on your trip. Please discuss this with our team when booking.",
      },
    ],
  },
];

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
