export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

// Visible labels use "transport" terminology; hrefs keep the existing indexed
// wheelchair-taxi URLs so no redirects are needed.
export const servicesMenu: NavGroup[] = [
  {
    label: "Airport Transfers",
    links: [
      { label: "Sydney Airport Wheelchair Transport", href: "/wheelchair-taxi-airport-sydney/" },
      { label: "Domestic Airport Accessible Transport", href: "/sydney-domestic-airport-wheelchair-taxi/" },
      { label: "International Airport Accessible Transport", href: "/wheelchair-taxi-international-airport/" },
      { label: "Western Sydney Airport Accessible Transport", href: "/western-sydney-airport-wheelchair-taxi/" },
    ],
  },
  {
    label: "Medical & Health Transport",
    links: [
      { label: "Hospital Transport Sydney", href: "/hospital-transport-sydney/" },
      { label: "Medical Appointment Transport", href: "/medical-appointment-transport-sydney/" },
      { label: "Dialysis Transport", href: "/dialysis-transport-sydney/" },
      { label: "Rehabilitation Transport", href: "/rehabilitation-transport-sydney/" },
    ],
  },
  {
    label: "Wheelchair & Mobility",
    links: [
      { label: "Electric Wheelchair Transport", href: "/wheelchair-taxi-for-electric-wheelchairs/" },
      { label: "Manual Wheelchair Transport", href: "/wheelchair-taxi-for-manual-wheelchairs/" },
      { label: "Mobility Scooter Transport", href: "/wheelchair-taxi-for-mobility-scooters/" },
      { label: "Safety & Accessibility", href: "/safety-accessibility/" },
    ],
  },
  {
    label: "Disability & Community",
    links: [
      { label: "NDIS Wheelchair Transport", href: "/ndis-transport-sydney/" },
      { label: "Aged Care Transport", href: "/aged-care-transport-sydney/" },
      { label: "Accessible Transport for People with Disability", href: "/disabled-taxi-service/" },
      { label: "TTSS Information", href: "/ttss-taxi-sydney/" },
    ],
  },
  {
    label: "Wheelchair Transport Services",
    links: [
      { label: "Door-to-Door Wheelchair Transport", href: "/door-to-door-wheelchair-transport/" },
      { label: "Private Wheelchair Transport", href: "/private-wheelchair-taxi-service/" },
      { label: "Same-Day Accessible Transport", href: "/same-day-wheelchair-taxi/" },
      { label: "Advance Transport Booking", href: "/advance-wheelchair-taxi-booking/" },
      { label: "Recurring Wheelchair Transport", href: "/recurring-wheelchair-transport-sydney/" },
    ],
  },
  {
    label: "For Organisations",
    links: [
      { label: "Organisations Overview", href: "/organisations/" },
      { label: "For Support Coordinators", href: "/support-coordinator-transport-sydney/" },
      { label: "For Plan Managers", href: "/plan-manager-transport-sydney/" },
      { label: "For Aged Care Providers", href: "/aged-care-provider-transport-sydney/" },
      { label: "For Hospitals & Clinics", href: "/hospital-referral-transport-sydney/" },
      { label: "For Disability Organisations", href: "/disability-organisation-transport-sydney/" },
    ],
  },
  {
    label: "Bookings & Enquiries",
    links: [
      { label: "Book Accessible Transport Online", href: "/wheelchair-taxi-booking/" },
      { label: "Contact Our Booking Team", href: "/wheelchair-taxi-number/" },
      { label: "Wheelchair Accessible Transport", href: "/wheelchair-accessible-taxi/" },
      { label: "Accessible Transport Near Me", href: "/wheelchair-taxi-service-near-me/" },
    ],
  },
  {
    label: "Sydney Locations",
    links: [
      { label: "Parramatta", href: "/wheelchair-taxi-parramatta/" },
      { label: "Westmead", href: "/wheelchair-taxi-westmead/" },
      { label: "Liverpool", href: "/wheelchair-taxi-liverpool/" },
      { label: "Blacktown", href: "/wheelchair-taxi-blacktown/" },
      { label: "Penrith", href: "/wheelchair-taxi-penrith/" },
      { label: "Campbelltown", href: "/wheelchair-taxi-campbelltown/" },
      { label: "Bankstown", href: "/wheelchair-taxi-bankstown/" },
      { label: "Randwick", href: "/wheelchair-taxi-randwick/" },
      { label: "Chatswood", href: "/wheelchair-taxi-chatswood/" },
      { label: "Sydney CBD", href: "/wheelchair-taxi-sydney-cbd/" },
    ],
  },
];

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/aboutus/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact Us", href: "/contact-us/" },
];
