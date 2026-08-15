export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

export const servicesMenu: NavGroup[] = [
  {
    label: "Airport Transfers",
    links: [
      { label: "Wheelchair Taxi Sydney Airport", href: "/wheelchair-taxi-airport-sydney/" },
      { label: "Sydney Domestic Airport Wheelchair Taxi", href: "/sydney-domestic-airport-wheelchair-taxi/" },
      { label: "Wheelchair Taxi International Airport", href: "/wheelchair-taxi-international-airport/" },
      { label: "Western Sydney Airport Wheelchair Taxi", href: "/western-sydney-airport-wheelchair-taxi/" },
    ],
  },
  {
    label: "Medical & Health Transport",
    links: [
      { label: "Hospital Transport Sydney", href: "/hospital-transport-sydney/" },
      { label: "Medical Appointment Transport Sydney", href: "/medical-appointment-transport-sydney/" },
      { label: "Dialysis Transport Sydney", href: "/dialysis-transport-sydney/" },
      { label: "Rehabilitation Transport Sydney", href: "/rehabilitation-transport-sydney/" },
    ],
  },
  {
    label: "Wheelchair & Accessibility",
    links: [
      { label: "Wheelchair Taxi for Electric Wheelchairs", href: "/wheelchair-taxi-for-electric-wheelchairs/" },
      { label: "Wheelchair Taxi for Manual Wheelchairs", href: "/wheelchair-taxi-for-manual-wheelchairs/" },
      { label: "Wheelchair Taxi for Mobility Scooters", href: "/wheelchair-taxi-for-mobility-scooters/" },
    ],
  },
  {
    label: "Disability & Community Transport",
    links: [
      { label: "NDIS Wheelchair Transport Sydney", href: "/ndis-transport-sydney/" },
      { label: "TTSS Taxi Sydney", href: "/ttss-taxi-sydney/" },
      { label: "Aged Care Transport Sydney", href: "/aged-care-transport-sydney/" },
    ],
  },
  {
    label: "Wheelchair Taxi Services",
    links: [
      { label: "Door-to-Door Wheelchair Transport", href: "/door-to-door-wheelchair-transport/" },
      { label: "Private Wheelchair Taxi Service", href: "/private-wheelchair-taxi-service/" },
      { label: "Same-Day Wheelchair Taxi", href: "/same-day-wheelchair-taxi/" },
      { label: "Advance Wheelchair Taxi Booking", href: "/advance-wheelchair-taxi-booking/" },
    ],
  },
  {
    label: "Wheelchair Taxi Booking",
    links: [
      { label: "Wheelchair Taxi Number", href: "/wheelchair-taxi-number/" },
      { label: "Wheelchair Accessible Taxi", href: "/wheelchair-accessible-taxi/" },
      { label: "Wheelchair Taxi Service Near Me", href: "/wheelchair-taxi-service-near-me/" },
      { label: "Wheelchair Taxi Booking Online", href: "/wheelchair-taxi-booking/" },
      { label: "Disabled Taxi Service", href: "/disabled-taxi-service/" },
    ],
  },
];

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/aboutus/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact Us", href: "/contact-us/" },
];
