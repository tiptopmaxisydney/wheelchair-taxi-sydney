// Trimmed port of tiptopnextjs's src/utils/api.ts — same endpoints, same request
// plumbing (superagent + timezone header), same airport/Stripe/map constants. Only the
// `createBooking` namespace is kept: everything else in the source file (Auth, FILES,
// contentPages, homepage, Payment, Common, verify, token/setToken) is unused by the
// booking wizard, which is a guest checkout with no login.
import _superagent from "superagent";
const SuperagentPromise = require("superagent-promise");
const superagent = SuperagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT;

export const center = { lat: -33.947346, lng: 151.179428 }; // Sydney airport
export const country: "au" | "in" = "au";
export const STRIPE_ACCESS_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export const InternationalAirportAddress = {
  lat: -33.94973416240362,
  lng: 151.18162039220857,
  formattedAddress: "Rideshare Area (Near P7 Buildings) Sydney International Airport",
};

export const DomesticAirportAddress = {
  lat: -33.9399,
  lng: 151.1753,
  formattedAddress: "Green Priority Pickup Area (T2, T3), Sydney Domestic Airport",
};

// Kept only for structural parity with the source file — country is always "au" here,
// so this branch is never reached, but Step1JourneyDetails.tsx references it directly.
export const MohaliAirportAddress = {
  lat: 30.667767,
  lng: 76.786232,
  formattedAddress: "Mohali International Airport",
};

const responseBody = (res: any) => res.body;

const tokenPlugin = (req: any) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timeZone) {
    req.set("timezone", timeZone);
  }
};

const requests = {
  get: (url: string) => superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  post: (url: string, body: any) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  patch: (url: string, body: any) =>
    superagent.patch(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
};

const createBooking = {
  getVehiclesTypesListing: () => requests.get("vehicle/active/vehicles"),
  getVehiclesPricing: (data: Object = {}) => requests.post("booking/web/vehicle/pricing", data),
  book: (data: Object = {}) => requests.post("booking/web/app", data),
  getAirlines: () => requests.get("booking/web/airlines"),
  getAirports: () => requests.get("booking/web/airports"),
};

// Local-first address cache — same public/guest routes as tiptopnextjs's SavedAddress
// namespace, no auth needed since this is a guest checkout with no login.
export const SavedAddress = {
  search: (q: string) => requests.get(`saved-address/search/web?q=${encodeURIComponent(q)}`),
  resolve: (info: any) => requests.post(`saved-address/resolve/web`, info),
  markUsed: (id: string) => requests.patch(`saved-address/${id}/use`, {}),
};

const henceforthApi = {
  createBooking,
  SavedAddress,
};

export default henceforthApi;
