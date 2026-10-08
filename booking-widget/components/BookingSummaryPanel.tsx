"use client";

import { Form, FormInstance } from "antd";
import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";
import { Stop } from "./Step1JourneyDetails";

interface BookingSummaryPanelProps {
  currentStep: number;
  form: FormInstance;
  form2: FormInstance;
  vehicleInfo?: IVehicleDetails;
  isReturnTrip: boolean;
  isAirportTransfer: boolean;
  isAirportPickupBooking: boolean;
  stops?: Stop[];
  distanceKm?: number;
  durationMins?: number;
  childSeatCount: number;
  childCapsuleCount: number;
  wheelchairCount: number;
  pramCount: number;
  babySeatItems?: { seat_type: string }[];
  airlineOptions: { label: string; options: { value: string; label: string }[] }[];
  onEditStep: (step: number) => void;
}

const formatDateTime = (value: any, format: string) => {
  if (!value) return undefined;
  return typeof value.format === "function" ? value.format(format) : String(value);
};

const formatDuration = (mins: number) => {
  if (!mins) return undefined;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} hr${m ? ` ${m} min` : ""}` : `${m} mins`;
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// ── Small icons (inline so the panel has no extra dependencies) ──────────────
const Icon: React.FC<{ d: string; className?: string; size?: number }> = ({ d, className = "", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d={d} />
  </svg>
);
const CALENDAR = "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";
const CLOCK = "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2";
const ROUTE = "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 15V9a4 4 0 0 1 4-4h4M18 9v6a4 4 0 0 1-4 4h-4";
const CHECK = "M20 6 9 17l-5-5";

const EditLink: React.FC<{ step: number; onEdit: (step: number) => void; light?: boolean }> = ({ step, onEdit, light }) => (
  <button
    type="button"
    onClick={() => onEdit(step)}
    className={`cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold underline-offset-2 hover:underline ${light ? "text-white/80 hover:text-white" : "text-blue-600"}`}
  >
    Edit
  </button>
);

// Pickup → stops → drop-off as a vertical route line.
const Route: React.FC<{ points: { label: string; address?: string; kind: "start" | "stop" | "end" }[] }> = ({ points }) => (
  <ol className="m-0 list-none p-0">
    {points.filter((p) => p.address).map((p, i, arr) => (
      <li key={i} className="relative flex gap-3 pb-3 last:pb-0">
        {i < arr.length - 1 && <span className="absolute bottom-0 left-[5px] top-4 border-l-2 border-dashed border-slate-300" />}
        <svg width={12} height={12} viewBox="0 0 12 12" className="relative z-10 mt-1 flex-shrink-0" aria-hidden>
          {p.kind === "start" ? (
            <circle cx="6" cy="6" r="4.5" fill="#fff" stroke="#1d69b4" strokeWidth="3" />
          ) : (
            <circle cx="6" cy="6" r="5" fill={p.kind === "end" ? "#0d1b2e" : "#94a3b8"} />
          )}
        </svg>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{p.label}</div>
          <div className="text-sm leading-snug text-slate-800 break-words">{p.address}</div>
        </div>
      </li>
    ))}
  </ol>
);

const When: React.FC<{ date?: string; time?: string }> = ({ date, time }) =>
  !date && !time ? null : (
    <div className="flex items-center gap-4 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
      {date && (
        <span className="flex items-center gap-1.5">
          <Icon d={CALENDAR} size={14} className="text-slate-400" />
          {date}
        </span>
      )}
      {time && (
        <span className="flex items-center gap-1.5">
          <Icon d={CLOCK} size={14} className="text-slate-400" />
          {time}
        </span>
      )}
    </div>
  );

const BENEFITS = [
  "Instant booking email confirmation",
  "Fixed prices — no surprises",
  "Secure payment by credit or debit card",
];

// Right-hand "Your transfer" summary on the wizard steps after Locations: what the customer
// has chosen so far (route, time, distance, vehicle), so they keep track while filling the next step.
const BookingSummaryPanel: React.FC<BookingSummaryPanelProps> = ({
  currentStep,
  form,
  form2,
  vehicleInfo,
  isReturnTrip,
  isAirportTransfer,
  isAirportPickupBooking,
  stops,
  distanceKm,
  durationMins,
  childSeatCount,
  childCapsuleCount,
  wheelchairCount,
  pramCount,
  babySeatItems,
  airlineOptions,
  onEditStep,
}) => {
  const trip = Form.useWatch([], form) as any;
  const passenger = Form.useWatch([], form2) as any;

  const airlineLabel = airlineOptions
    .flatMap((group) => group.options)
    .find((option) => option.value === trip?.airline)?.label;

  const stopNames = (stops || []).map((s) => s?.name).filter(Boolean) as string[];
  const journeyType = isAirportTransfer
    ? trip?.transfer_point === "drop" ? "Airport Drop-off" : "Airport Pickup"
    : "General Transfer";

  const vehicleImage = vehicleInfo
    ? vehicleInfo.vehicle_id?.image ? process.env.NEXT_PUBLIC_DEV_BUCKET_ROOT + vehicleInfo.vehicle_id.image : null
    : null;

  const extras = babySeatItems
    ? babySeatItems.map((item) => item.seat_type).filter(Boolean).join(", ")
    : [
        childSeatCount > 0 ? plural(childSeatCount, "child seat") : null,
        childCapsuleCount > 0 ? plural(childCapsuleCount, "baby capsule") : null,
        wheelchairCount > 0 ? plural(wheelchairCount, "wheelchair") : null,
        pramCount > 0 ? plural(pramCount, "pram") : null,
      ].filter(Boolean).join(", ");

  const chosen = [
    passenger?.passenger ? plural(Number(passenger.passenger), "passenger") : null,
    passenger?.luggage ? plural(Number(passenger.luggage), "suitcase") : null,
    passenger?.handbags ? plural(Number(passenger.handbags), "hand bag") : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-4 md:sticky md:top-4">
      <aside className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 bg-[#0d1b2e] px-4 py-3">
          <div className="min-w-0">
            <h4 className="m-0 text-base font-semibold leading-tight text-white">Your transfer</h4>
            <span className="mt-0.5 block text-xs leading-snug text-white/70">
              {isReturnTrip ? "Return journey" : "One way journey"} · {journeyType}
            </span>
          </div>
          <EditLink step={1} onEdit={onEditStep} light />
        </div>
        <div className="h-1 bg-[#1d69b4]" />

        <div className="flex flex-col gap-4 p-4">
          {/* Outbound */}
          <div className="flex flex-col gap-3">
            <Route
              points={[
                { label: "Pickup", address: trip?.pickup_address, kind: "start" },
                ...stopNames.map((name, i) => ({ label: stopNames.length > 1 ? `Stop ${i + 1}` : "Stop", address: name, kind: "stop" as const })),
                { label: "Drop-off", address: trip?.drop_address, kind: "end" },
              ]}
            />
            <When date={formatDateTime(trip?.date, "DD MMM YYYY")} time={formatDateTime(trip?.time, "hh:mm A")} />
          </div>

          {/* Return */}
          {isReturnTrip && (trip?.return_pickup_address || trip?.return_drop_address) && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0d1b2e]">Return</span>
              <Route
                points={[
                  { label: "Pickup", address: trip?.return_pickup_address, kind: "start" },
                  { label: "Drop-off", address: trip?.return_drop_address, kind: "end" },
                ]}
              />
              <When date={formatDateTime(trip?.return_date, "DD MMM YYYY")} time={formatDateTime(trip?.return_time, "hh:mm A")} />
            </div>
          )}

          {/* Distance / time */}
          {(distanceKm || durationMins) ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <Icon d={ROUTE} size={12} /> Distance
                </div>
                <div className="text-base font-bold text-[#0d1b2e]">{distanceKm ? `${distanceKm.toFixed(1)} km` : "—"}</div>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <Icon d={CLOCK} size={12} /> Time
                </div>
                <div className="text-base font-bold text-[#0d1b2e]">{formatDuration(durationMins || 0) || "—"}</div>
              </div>
            </div>
          ) : null}

          {/* Vehicle — as soon as one is picked */}
          {vehicleInfo && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0d1b2e]">Your vehicle</span>
                {currentStep >= 3 && <EditLink step={2} onEdit={onEditStep} />}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 p-1">
                  {vehicleImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={vehicleImage} alt={vehicleInfo.vehicle_name} className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-[#0d1b2e]">{vehicleInfo.vehicle_name}</div>
                  <div className="text-xs leading-relaxed text-slate-500">
                    Up to {vehicleInfo.passenger} passengers
                    <br />
                    {vehicleInfo.luggage} large · {vehicleInfo.handbags} small bags
                  </div>
                </div>
              </div>

              {currentStep >= 3 && (chosen || extras || isAirportPickupBooking || passenger?.notes) && (
                <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {chosen && <span><span className="font-semibold text-slate-700">Booked for:</span> {chosen}</span>}
                  {extras && <span><span className="font-semibold text-slate-700">Extras:</span> {extras}</span>}
                  {isAirportPickupBooking && (airlineLabel || trip?.flight_number) && (
                    <span>
                      <span className="font-semibold text-slate-700">Flight:</span>{" "}
                      {[airlineLabel, trip?.flight_number].filter(Boolean).join(" ")}
                      {trip?.flight_arrival_time ? `, lands ${formatDateTime(trip.flight_arrival_time, "hh:mm A")}` : ""}
                    </span>
                  )}
                  {passenger?.notes && <span className="break-words"><span className="font-semibold text-slate-700">Notes:</span> {passenger.notes}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Why book with us */}
      <aside className="rounded-2xl bg-[#1d69b4]/10 p-4 ring-1 ring-[#1d69b4]/30">
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1d69b4] text-white">
                <Icon d={CHECK} size={12} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default BookingSummaryPanel;
