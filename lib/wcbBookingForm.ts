import { WCBDateTime, parseValue } from "@/lib/wcbDateTime";
import { trackBookingConversion } from "@/lib/googleAds";
import { trackEvent } from "@/lib/ga4";
import { getAttribution, getCurrentPage } from "@/booking-widget/utils/attribution";

/**
 * Port of the wheelchair-booking plugin's wcb-booking-form.js (the live
 * site's booking widget logic): step navigation, per-step validation, and
 * the Google Places autocomplete + service-area gating. The submit step
 * posts straight to the TipTop Ride dispatch backend's quote endpoint
 * (see wcbConfig.ts) instead of the WordPress REST API the plugin used.
 */

type WCBPlaces = {
  country?: string;
  center?: { lat: number; lng: number };
  pickupRadiusKm?: number;
  dropoffRadiusKm?: number;
  strict?: boolean;
  requireSelection?: boolean;
};

type WCBMessages = {
  sending: string;
  success: string;
  error: string;
  address: string;
  required: string;
  email: string;
  phone: string;
};

export type WCBConfig = {
  apiUrl: string;
  googleApiKey: string;
  vehicleId: string;
  vehicleName: string;
  bookingTransferType: string;
  paymentMethod: string;
  countryCode: string;
  places: WCBPlaces;
  messages: WCBMessages;
};

const REQUIRED_STEPS: string[][] = [
  ["tripType", "pickupAddress", "dropoffAddress", "onewayDateTime", "returnDateTime"],
  ["wheelchairs", "mobilityDevice", "passengers"],
  ["customerName", "customerEmail", "customerPhone"],
];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Deliberately loose: AU numbers get written with spaces, brackets, a leading
// 0 or a +61, and turning away a real number is worse than taking an odd one.
const PHONE_PATTERN = /^\+?[\d\s()\-.]{6,}$/;

type GoogleLatLng = { lat: () => number; lng: () => number };
type GooglePlace = { formatted_address?: string; name?: string; geometry?: { location?: GoogleLatLng } };
type GoogleAutocomplete = {
  getPlace: () => GooglePlace;
  addListener: (event: "place_changed", handler: () => void) => void;
};
type GoogleMapsNamespace = {
  maps: {
    LatLng: new (lat: number, lng: number) => unknown;
    LatLngBounds: new (sw: unknown, ne: unknown) => unknown;
    places: {
      Autocomplete: new (
        input: HTMLInputElement,
        options: {
          bounds: unknown;
          strictBounds: boolean;
          componentRestrictions: { country: string };
          fields: string[];
          types: string[];
        }
      ) => GoogleAutocomplete;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleMapsNamespace;
    gm_authFailure?: () => void;
    wcbGoogleMapsReady?: () => void;
  }
}

export function attachBookingForm(form: HTMLFormElement, config: WCBConfig): () => void {
  const feedback = form.querySelector<HTMLElement>(".wcb-form-feedback");
  const tripTypeInputs = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="tripType"]'));
  const returnRow = form.querySelector<HTMLElement>(".wcb-return-row");
  const ndisBookingSelect = form.querySelector<HTMLSelectElement>('select[name="ndisBooking"]');
  const ndisRow = form.querySelector<HTMLElement>(".wcb-ndis-row");
  const recurringTripSelect = form.querySelector<HTMLSelectElement>('select[name="recurringTrip"]');
  const recurringRow = form.querySelector<HTMLElement>(".wcb-recurring-row");
  const mobilityDeviceSelect = form.querySelector<HTMLSelectElement>('select[name="mobilityDevice"]');
  const pickupInput = form.querySelector<HTMLInputElement>("#pickupAddress");
  const dropoffInput = form.querySelector<HTMLInputElement>("#dropoffAddress");
  const steps = Array.from(form.querySelectorAll<HTMLElement>(".wcb-step"));
  const progressSteps = Array.from(form.querySelectorAll<HTMLElement>(".wcb-progress-step"));
  const navButtons = Array.from(form.querySelectorAll<HTMLButtonElement>(".wcb-nav-button"));
  const submitButton = form.querySelector<HTMLButtonElement>(".wcb-submit");
  const summaryBox = form.querySelector<HTMLElement>(".wcb-step-summary");
  const backButton = form.querySelector<HTMLElement>(".wcb-nav-back");
  const nextButton = form.querySelector<HTMLElement>(".wcb-nav-next");
  let currentStep = 0;

  function syncTripType() {
    tripTypeInputs.forEach((input) => {
      const label = input.closest("label");
      if (label) label.classList.toggle("is-active", input.checked);
    });
  }

  function clearReturn() {
    if (!returnRow) return;
    const field = form.querySelector<HTMLInputElement>('[name="returnDateTime"]');
    const display = returnRow.querySelector<HTMLInputElement>(".wcb-datetime-input");
    const picker = returnRow.querySelector<HTMLElement>(".wcb-datetime");
    returnRow.classList.remove("wcb-invalid");
    if (display) display.value = "";
    if (picker) picker.classList.remove("is-open");
    if (field && field.value) {
      field.value = "";
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function toggleReturn() {
    syncTripType();
    const checked = form.querySelector<HTMLInputElement>('input[name="tripType"]:checked');
    const isReturn = checked?.value === "Return";
    syncRequiredFlags();
    if (!returnRow) return;
    returnRow.hidden = !isReturn;
    if (!isReturn) clearReturn();
  }

  // ndis/recurring mirror the return-trip show/hide pattern above: the detail row only
  // appears once the parent Yes/No answers "Yes", and firing the *_enquiry event here
  // (not just on final submit) captures interest even if the guest abandons the form.
  function toggleNdis() {
    if (!ndisRow || !ndisBookingSelect) return;
    const isYes = ndisBookingSelect.value === "Yes";
    ndisRow.hidden = !isYes;
    if (isYes) trackEvent("ndis_enquiry", { source_page: window.location.pathname });
  }

  function toggleRecurring() {
    if (!recurringRow || !recurringTripSelect) return;
    const isYes = recurringTripSelect.value === "Yes";
    recurringRow.hidden = !isYes;
    if (isYes) trackEvent("recurring_transport_enquiry", { source_page: window.location.pathname });
  }

  function trackMobilityDevice() {
    const value = mobilityDeviceSelect?.value || "";
    if (value.includes("Powered Wheelchair")) trackEvent("powered_wheelchair_selected", { mobility_device: value });
    else if (value.includes("Mobility Scooter")) trackEvent("mobility_scooter_selected", { mobility_device: value });
  }

  function updateSummary() {
    if (!summaryBox) return;
    const formData = new FormData(form);
    const tripType = (formData.get("tripType") as string) || "One Way";
    const pickup = (formData.get("pickupAddress") as string) || "Not provided";
    const dropoff = (formData.get("dropoffAddress") as string) || "Not provided";
    const onewayRaw = formData.get("onewayDateTime") as string;
    const returnRaw = formData.get("returnDateTime") as string;
    const pickupTime = onewayRaw ? WCBDateTime.display(onewayRaw) : "Not provided";
    const returnTime = returnRaw ? WCBDateTime.display(returnRaw) : "—";
    const customerName = (formData.get("customerName") as string) || "Not provided";
    const customerEmail = (formData.get("customerEmail") as string) || "Not provided";
    summaryBox.innerHTML =
      "<strong>Review:</strong> " + tripType + " trip from " + pickup + " to " + dropoff + ". Pickup time: " + pickupTime +
      ". Return: " + returnTime + ". Contact: " + customerName + " (" + customerEmail + ").";
  }

  function showStep(index: number) {
    currentStep = index;
    form.setAttribute("data-current-step", String(index + 1));
    steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === index));
    progressSteps.forEach((step, stepIndex) => {
      step.classList.toggle("active", stepIndex === index);
      step.classList.toggle("is-done", stepIndex < index);
    });
    const showBack = index > 0;
    const showNext = index < steps.length - 1;
    if (backButton) backButton.style.display = showBack ? "inline-block" : "none";
    if (nextButton) nextButton.style.display = showNext ? "inline-block" : "none";
    if (submitButton) submitButton.style.display = showNext ? "none" : "inline-block";
    updateSummary();
  }

  function warn(message: string) {
    if (window.console?.warn) window.console.warn("[Wheelchair Booking] " + message);
  }

  // Feedback sits directly above the buttons. The state class drives its
  // colour and icon; clearing every class first keeps a stale state from
  // sticking.
  function setFeedback(message: string, state?: "sending" | "success" | "error" | "") {
    if (!feedback) return;
    feedback.className = "wcb-form-feedback" + (state ? " is-" + state : "");
    feedback.textContent = message || "";
    if (message && feedback.scrollIntoView) feedback.scrollIntoView({ block: "nearest" });
  }

  function fieldOf(name: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
    if (name === "tripType") {
      return (
        form.querySelector<HTMLInputElement>('input[name="tripType"]:checked') ||
        form.querySelector<HTMLInputElement>('input[name="tripType"]')
      );
    }
    return form.querySelector(`[name="${name}"]`);
  }

  function fieldRow(field: Element | null): HTMLElement | null {
    return field ? field.closest<HTMLElement>(".wcb-form-row") : null;
  }

  // The picker turns each date field into a hidden input plus a visible text
  // box, so the highlight and the focus have to land on the visible one.
  function fieldControl(field: HTMLElement | null): HTMLElement | null {
    const row = fieldRow(field);
    const display = row ? row.querySelector<HTMLElement>(".wcb-datetime-input") : null;
    return display || field;
  }

  function markField(field: HTMLElement | null, invalid: boolean) {
    const row = fieldRow(field);
    if (row) row.classList.toggle("wcb-invalid", invalid);
  }

  function messageFor(key: keyof WCBMessages): string {
    return config.messages?.[key] || "Please complete the highlighted fields before continuing.";
  }

  /** Returns the reason this field is not acceptable, or '' when it is fine. */
  function fieldProblem(name: string, field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
    const row = fieldRow(field);
    if (row?.hidden) return "";
    const value = String(field.value || "").trim();
    if (value === "") return messageFor("required");
    if (name === "customerEmail" && !EMAIL_PATTERN.test(value)) return messageFor("email");
    if (name === "customerPhone" && !PHONE_PATTERN.test(value)) return messageFor("phone");
    return "";
  }

  function validateStep(index: number): boolean {
    const names = REQUIRED_STEPS[index] || [];
    let firstBad: HTMLElement | null = null;
    let firstMessage = "";
    names.forEach((name) => {
      const field = fieldOf(name);
      if (!field) return;
      const problem = fieldProblem(name, field);
      markField(field, problem !== "");
      if (problem && !firstBad) {
        firstBad = field;
        firstMessage = problem;
      }
    });
    if (!firstBad) return true;
    if (currentStep !== index) showStep(index);
    setFeedback(firstMessage, "error");
    const control = fieldControl(firstBad);
    if (control && "focus" in control) (control as HTMLElement).focus();
    return false;
  }

  /** Guards a step change; the submit runs every step so nothing can be skipped. */
  function stepGateOpen(index: number): boolean {
    if (!validateStep(index)) return false;
    return index !== 0 || addressGateOpen();
  }

  function formGateOpen(): boolean {
    for (let i = 0; i < REQUIRED_STEPS.length; i++) {
      if (!validateStep(i)) return false;
    }
    return addressGateOpen();
  }

  // Mirrors the required state onto the live controls: the return field only
  // counts on a return trip, and a date field's visible box is not the
  // element the markup put `required` on.
  function syncRequiredFlags() {
    const checked = form.querySelector<HTMLInputElement>('input[name="tripType"]:checked');
    const isReturn = !!checked && checked.value === "Return";
    REQUIRED_STEPS.forEach((names) => {
      names.forEach((name) => {
        if (name === "tripType") return;
        const field = fieldOf(name);
        if (!field) return;
        const needed = name !== "returnDateTime" || isReturn;
        if (needed) field.setAttribute("required", "required");
        else field.removeAttribute("required");
        const control = fieldControl(field);
        if (control && control !== field) control.setAttribute("aria-required", needed ? "true" : "false");
      });
    });
  }

  // Fixing a highlighted field drops its highlight, and the error banner
  // goes once nothing is left highlighted.
  function clearFieldError(event: Event) {
    const row = fieldRow(event.target as Element);
    if (!row || !row.classList.contains("wcb-invalid")) return;
    row.classList.remove("wcb-invalid");
    if (feedback?.classList.contains("is-error") && !form.querySelector(".wcb-invalid")) setFeedback("");
  }

  const placesConfig = config.places || {};
  let placesReady = false;

  // Service-area box around the base, as a bounding box because that is all
  // the Places Autocomplete API accepts. 111.32 km is one degree of
  // latitude; a degree of longitude shrinks by cos(latitude), so the
  // east/west span is widened to keep the box roughly square on the ground.
  function serviceBounds(radiusKm: number) {
    const center = placesConfig.center || { lat: -33.8688, lng: 151.2093 };
    const latSpan = radiusKm / 111.32;
    const lngSpan = latSpan / Math.cos(center.lat * (Math.PI / 180));
    // Only called once initAutocomplete has confirmed window.google is loaded.
    const maps = window.google!.maps;
    return new maps.LatLngBounds(
      new maps.LatLng(center.lat - latSpan, center.lng - lngSpan),
      new maps.LatLng(center.lat + latSpan, center.lng + lngSpan)
    );
  }

  // Google sometimes prefixes formatted_address with a plus code
  // ("R2C4+7X, Sydney NSW"), which is noise on a booking sheet.
  function cleanAddress(value: string): string {
    return String(value || "")
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part !== "" && part.indexOf("+") === -1)
      .join(", ");
  }

  // Coordinates ride along in hidden inputs so FormData picks them up and
  // form.reset() clears them, exactly like every other field.
  function coordField(input: HTMLInputElement, axis: "Lat" | "Lng"): HTMLInputElement | null {
    const prefix = input.getAttribute("data-wcb-coords");
    return prefix ? form.querySelector<HTMLInputElement>("#" + prefix + axis) : null;
  }

  function setCoords(input: HTMLInputElement, lat: number | string, lng: number | string) {
    const latField = coordField(input, "Lat");
    const lngField = coordField(input, "Lng");
    if (latField) latField.value = String(lat);
    if (lngField) lngField.value = String(lng);
  }

  function clearPlace(input: HTMLInputElement) {
    input.removeAttribute("data-wcb-place");
    input.removeAttribute("data-wcb-lat");
    input.removeAttribute("data-wcb-lng");
    setCoords(input, "", "");
  }

  // An address counts as confirmed only while the text still matches what
  // was picked from the list — editing it afterwards invalidates the
  // selection.
  function isConfirmed(input: HTMLInputElement | null): boolean {
    return !!input && input.value.trim() !== "" && input.getAttribute("data-wcb-place") === input.value;
  }

  function firstUnconfirmedAddress(): HTMLInputElement | null {
    if (!placesReady || placesConfig.requireSelection === false) return null;
    const fields = [pickupInput, dropoffInput];
    for (const field of fields) {
      if (field && !isConfirmed(field)) return field;
    }
    return null;
  }

  function addressGateOpen(): boolean {
    const input = firstUnconfirmedAddress();
    if (!input) return true;
    setFeedback(config.messages.address, "error");
    if (currentStep !== 0) showStep(0);
    input.focus();
    return false;
  }

  function addAutocomplete(input: HTMLInputElement | null, radiusKm: number) {
    if (!input || input.getAttribute("data-wcb-autocomplete")) return;
    input.setAttribute("data-wcb-autocomplete", "1");
    // Only called once initAutocomplete has confirmed window.google is loaded.
    const autocomplete = new window.google!.maps.places.Autocomplete(input, {
      bounds: serviceBounds(radiusKm),
      strictBounds: placesConfig.strict !== false,
      componentRestrictions: { country: placesConfig.country || "au" },
      fields: ["formatted_address", "geometry", "name"],
      types: ["address"],
    });
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      // No geometry means the text was submitted without picking a
      // suggestion, so nothing has been confirmed as inside the service area.
      if (!place || !place.geometry || !place.geometry.location) {
        clearPlace(input);
        updateSummary();
        return;
      }
      const address = cleanAddress(place.formatted_address || place.name || input.value);
      input.value = address;
      input.setAttribute("data-wcb-place", address);
      input.setAttribute("data-wcb-lat", String(place.geometry.location.lat()));
      input.setAttribute("data-wcb-lng", String(place.geometry.location.lng()));
      setCoords(input, place.geometry.location.lat(), place.geometry.location.lng());
      if (feedback?.classList.contains("is-error")) setFeedback("");
      updateSummary();
    });
    input.addEventListener("input", () => {
      if (input.value !== input.getAttribute("data-wcb-place")) clearPlace(input);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") event.preventDefault();
    });
  }

  function initAutocomplete() {
    if (!window.google?.maps?.places?.Autocomplete) {
      warn("Google Places library did not load, so address autocomplete is unavailable.");
      return;
    }
    addAutocomplete(pickupInput, placesConfig.pickupRadiusKm || 50);
    addAutocomplete(dropoffInput, placesConfig.dropoffRadiusKm || 165);
    placesReady = true;
  }

  function loadGooglePlaces() {
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }
    const apiKey = config.googleApiKey || "";
    if (!apiKey) {
      warn("Address autocomplete is off because no Google Places API key is configured.");
      return;
    }
    // Shared with booking-widget/utils/CommonFunctions.ts's loadGoogleMapScript —
    // both this widget and the Tiptop booking widget can be mounted on the same
    // page (see Hero.tsx), and the Maps JS API breaks if it's loaded twice via
    // separate <script> tags. Matching on the same id lets whichever loader runs
    // first "win" and the other just waits for its load event.
    const existing = document.getElementById("wt-google-maps-script");
    if (existing) {
      existing.addEventListener("load", initAutocomplete);
      return;
    }
    if (!window.gm_authFailure) {
      window.gm_authFailure = () => {
        warn(
          'Google rejected the Maps API key. Check that billing is enabled, that "Maps JavaScript API" and "Places API" are both turned on for the key, and that this domain is allowed by the key referrer restrictions.'
        );
      };
    }
    window.wcbGoogleMapsReady = initAutocomplete;
    const script = document.createElement("script");
    script.id = "wt-google-maps-script";
    script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(apiKey) + "&libraries=places&loading=async&callback=wcbGoogleMapsReady";
    script.async = true;
    script.defer = true;
    script.onerror = () => warn("Could not download the Google Maps JavaScript API. A network block, ad blocker or content-security-policy rule is the usual cause.");
    document.head.appendChild(script);
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!feedback) return;
    if (!formGateOpen()) return;
    setFeedback(config.messages.sending, "sending");
    if (submitButton) submitButton.disabled = true;

    const data = new FormData(form);
    const isReturn = (data.get("tripType") as string) === "Return";

    // The API stamps dates as epoch ms. bookingTransferType is deliberately
    // never "airport_transfer" (see wcbConfig.ts), so the backend always
    // prices off scheduled_date/return_scheduled_date rather than arrival_date.
    const toEpochMs = (value: FormDataEntryValue | null): number | null => {
      const parsed = parseValue(typeof value === "string" ? value : "");
      return parsed ? parsed.getTime() : null;
    };

    const pickupAddress = (data.get("pickupAddress") as string) || "";
    const dropoffAddress = (data.get("dropoffAddress") as string) || "";
    const pickupLat = (data.get("pickupLat") as string) || "";
    const pickupLng = (data.get("pickupLng") as string) || "";
    const dropoffLat = (data.get("dropoffLat") as string) || "";
    const dropoffLng = (data.get("dropoffLng") as string) || "";

    // The API has no fields for mobility device type, booking-for/carer/NDIS/recurring
    // context, or a separate passenger name, so they're folded into notes rather than
    // dropped. A real recurring-transport workflow needs an actual backend field/lead
    // category in Nexus, not just a notes string - out of scope for this frontend.
    const mobilityDevice = (data.get("mobilityDevice") as string) || "";
    const passengerName = (data.get("passengerName") as string) || "";
    const driverInstructions = (data.get("driverInstructions") as string) || "";
    const bookingFor = (data.get("bookingFor") as string) || "";
    const carerTravelling = (data.get("carerTravelling") as string) || "";
    const ndisBooking = (data.get("ndisBooking") as string) || "";
    const ndisManagement = (data.get("ndisManagement") as string) || "";
    const recurringTrip = (data.get("recurringTrip") as string) || "";
    const recurringFrequency = (data.get("recurringFrequency") as string) || "";
    const notes = [
      mobilityDevice && `Mobility device: ${mobilityDevice}`,
      passengerName && `Passenger: ${passengerName}`,
      bookingFor && bookingFor !== "Myself" && `Booking for: ${bookingFor}`,
      carerTravelling === "Yes" && "Carer/support worker travelling: Yes",
      ndisBooking === "Yes" && `NDIS booking: Yes (${ndisManagement || "Not sure"})`,
      recurringTrip === "Yes" && `Recurring trip: Yes${recurringFrequency ? ` (${recurringFrequency})` : ""}`,
      driverInstructions,
    ]
      .filter(Boolean)
      .join(" | ");

    const attribution = getAttribution();
    const payload = {
      brand: attribution.brand,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_term: attribution.utm_term,
      utm_content: attribution.utm_content,
      gclid: attribution.gclid,
      fbclid: attribution.fbclid,
      landing_page: attribution.landing_page,
      ...getCurrentPage(),
      pickup_address: pickupAddress,
      pick_up_lat: pickupLat,
      pick_up_long: pickupLng,
      drop_address: dropoffAddress,
      drop_lat: dropoffLat,
      drop_long: dropoffLng,
      stops: [] as unknown[],
      scheduled_date: toEpochMs(data.get("onewayDateTime")),
      booking_type: "schedule",
      vehicle_id: config.vehicleId,
      vehicle_name: config.vehicleName,
      payment_method: config.paymentMethod,
      notes,
      flight_number: "",
      luggage: 1,
      handbags: 1,
      passenger: parseInt((data.get("passengers") as string) || "1", 10),
      no_of_wheelchair: parseInt((data.get("wheelchairs") as string) || "1", 10),
      no_of_childseat: 0,
      no_of_childcapsule: 0,
      include_airport_toll: false,
      filter: [] as unknown[],
      coupon_id: null as string | null,
      name: (data.get("customerName") as string) || "",
      email: (data.get("customerEmail") as string) || "",
      country_code: config.countryCode,
      phone: (data.get("customerPhone") as string) || "",
      booking_transfer_type: config.bookingTransferType,
      // Not an airport transfer, so these two are irrelevant to pricing but
      // harmless to include.
      transfer_point: "pickup",
      airport_pickup_type: null as string | null,
      is_return_trip: isReturn,
      // A return leg goes back from the dropoff to the original pickup.
      ...(isReturn
        ? {
            return_pickup_address: dropoffAddress,
            return_pickup_lat: dropoffLat,
            return_pickup_long: dropoffLng,
            return_drop_address: pickupAddress,
            return_drop_lat: pickupLat,
            return_drop_long: pickupLng,
            return_scheduled_date: toEpochMs(data.get("returnDateTime")),
            return_stops: [] as unknown[],
          }
        : {}),
    };

    fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) =>
        response.json().then((body) => {
          if (!response.ok) throw new Error(body.message || config.messages.error);
          return body;
        })
      )
      .then((body: { data?: { booking_id?: string } }) => {
        form.reset();
        Array.prototype.forEach.call(form.querySelectorAll(".wcb-invalid"), (row: Element) => row.classList.remove("wcb-invalid"));
        if (pickupInput) clearPlace(pickupInput);
        if (dropoffInput) clearPlace(dropoffInput);
        toggleReturn();
        showStep(0);
        const reference = body?.data?.booking_id;
        const suffix = reference ? ` Reference: ${reference}.` : "";
        setFeedback(config.messages.success + suffix, "success");
        trackBookingConversion(reference);
        trackEvent("wheelchair_booking_completed", { booking_id: reference || "" });
        trackEvent("quote_completed", { booking_id: reference || "" });
      })
      .catch((error: Error) => {
        setFeedback(error.message || config.messages.error, "error");
      })
      .then(() => {
        if (submitButton) submitButton.disabled = false;
      });
  }

  function handleNavClick(button: HTMLButtonElement) {
    return () => {
      const action = button.getAttribute("data-action");
      if (action === "next") {
        if (!stepGateOpen(currentStep)) return;
        if (currentStep === 0) trackEvent("wheelchair_booking_started", { source_page: window.location.pathname });
        showStep(Math.min(currentStep + 1, steps.length - 1));
      } else if (action === "prev") {
        showStep(Math.max(currentStep - 1, 0));
      }
    };
  }

  if (!form) return () => {};

  tripTypeInputs.forEach((input) => input.addEventListener("change", toggleReturn));
  toggleReturn();
  ndisBookingSelect?.addEventListener("change", toggleNdis);
  toggleNdis();
  recurringTripSelect?.addEventListener("change", toggleRecurring);
  toggleRecurring();
  mobilityDeviceSelect?.addEventListener("change", trackMobilityDevice);

  const navHandlers = navButtons.map((button) => {
    const handler = handleNavClick(button);
    button.addEventListener("click", handler);
    return { button, handler };
  });

  form.addEventListener("input", updateSummary);
  form.addEventListener("change", updateSummary);
  form.addEventListener("input", clearFieldError);
  form.addEventListener("change", clearFieldError);
  form.addEventListener("submit", handleSubmit);

  loadGooglePlaces();
  showStep(0);
  syncRequiredFlags();

  return () => {
    tripTypeInputs.forEach((input) => input.removeEventListener("change", toggleReturn));
    ndisBookingSelect?.removeEventListener("change", toggleNdis);
    recurringTripSelect?.removeEventListener("change", toggleRecurring);
    mobilityDeviceSelect?.removeEventListener("change", trackMobilityDevice);
    navHandlers.forEach(({ button, handler }) => button.removeEventListener("click", handler));
    form.removeEventListener("input", updateSummary);
    form.removeEventListener("change", updateSummary);
    form.removeEventListener("input", clearFieldError);
    form.removeEventListener("change", clearFieldError);
    form.removeEventListener("submit", handleSubmit);
  };
}
