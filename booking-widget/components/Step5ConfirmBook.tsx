"use client";

import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";
import { Checkbox, Divider, Form, FormInstance } from "antd";

interface Step5ConfirmBookProps {
  form: FormInstance;
  form2: FormInstance;
  vehicleInfo?: IVehicleDetails;
  isReturnTrip: boolean;
  isAirportTransfer: boolean;
  isAirportPickupBooking: boolean;
  childSeatCount: number;
  childCapsuleCount: number;
  wheelchairCount: number;
  airlineOptions: { label: string; options: { value: string; label: string }[] }[];
  isAgreed: boolean;
  setIsAgreed: (agreed: boolean) => void;
  onOpenTerms: () => void;
  onOpenRefund: () => void;
}

const SummaryRow: React.FC<{ label: string; value?: React.ReactNode; full?: boolean }> = ({ label, value, full }) =>
  value === undefined || value === null || value === "" ? null : (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-slate-500">{label}</div>
      <div className="font-medium text-[#0d1b2e] break-words">{value}</div>
    </div>
  );

const SummaryDivider = () => <Divider className="sm:col-span-2 !my-1" />;

const formatDateTime = (value: any, format: string) => {
  if (!value) return undefined;
  return typeof value.format === "function" ? value.format(format) : String(value);
};

// Mirrors the backend's wheelchair-taxi fare model (see tipopride-backend's
// computeWheelchairFare in booking.service.ts / pricing.service.ts): 1-3 wheelchairs
// share one van (bracketFare + $perExtra per chair beyond the first); 4+ requires
// multiple vans of up to 2 chairs each, each billed at bracketFare + perExtra. Returns
// just the surcharge on top of the bracket fare, since the bracket fare itself is
// already counted once in the trip amount.
const computeWheelchairSurcharge = (bracketFare: number, count: number, perExtra: number): number => {
  if (!count || count <= 0) return 0;
  if (count <= 3) return perExtra * (count - 1);
  const vans = Math.ceil(count / 2);
  return vans * (bracketFare + perExtra) - bracketFare;
};

const Step5ConfirmBook: React.FC<Step5ConfirmBookProps> = ({
  form,
  form2,
  vehicleInfo,
  isReturnTrip,
  isAirportTransfer,
  isAirportPickupBooking,
  childSeatCount,
  childCapsuleCount,
  wheelchairCount,
  airlineOptions,
  isAgreed,
  setIsAgreed,
  onOpenTerms,
  onOpenRefund,
}) => {
  // Equipment (child seat/baby capsule/wheelchair) is fitted per leg, so a
  // return trip bills it twice — shown explicitly below rather than silently
  // doubling the number so the customer can see why.
  const equipmentLegs = isReturnTrip ? 2 : 1;

  const childSeatAmount = childSeatCount * (vehicleInfo?.child_seat_charges || 0) * equipmentLegs;
  const childCapsuleAmount = childCapsuleCount * (vehicleInfo?.child_capsule_charges || 0) * equipmentLegs;
  const wheelchairAmount = vehicleInfo?.is_wheelchair_vehicle
    ? computeWheelchairSurcharge(vehicleInfo?.distance_fare || 0, wheelchairCount, vehicleInfo?.wheel_chair_charges || 0) * equipmentLegs
    : wheelchairCount * (vehicleInfo?.wheel_chair_charges || 0) * equipmentLegs;
  const equipmentAmount = childSeatAmount + childCapsuleAmount + wheelchairAmount;
  // Wheelchair-taxi fares are all-inclusive: no GST is charged (matches the backend's
  // is_wheelchair_vehicle handling in pricing.service.ts / booking.service.ts).
  const gstAmount = vehicleInfo?.is_wheelchair_vehicle
    ? 0
    : ((vehicleInfo?.base_fee || 0) + equipmentAmount + (vehicleInfo?.airport_toll || 0)) * (Number(vehicleInfo?.tax_percentage) / 100);
  const tripAmount = (vehicleInfo?.base_fee || 0) - (vehicleInfo?.toll_charges || 0);
  // Wheelchair-taxi fares also carry no government levy on top (all-inclusive table fare).
  const govLevyAmount = vehicleInfo?.is_wheelchair_vehicle ? 0 : (vehicleInfo?.gov_levy || 0);
  const totalAmount = tripAmount + govLevyAmount + (vehicleInfo?.toll_charges || 0) + (vehicleInfo?.airport_toll || 0) + (vehicleInfo?.surcharge_amount || 0) + gstAmount + equipmentAmount;

  const trip = Form.useWatch([], form) as any;
  const passenger = Form.useWatch([], form2) as any;

  const airlineLabel = airlineOptions
    .flatMap((group) => group.options)
    .find((option) => option.value === trip?.airline)?.label;

  return (
    <div>
      <h3 className="fw-semibold mb-3">Confirm & book</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mb-4">
        <div className="w-full flex flex-col rounded-xl border border-slate-200 p-4">
          <h4 className="fw-semibold mb-2 text-[#0d1b2e]">Trip details</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <SummaryRow label="Journey type" value={isReturnTrip ? "Return" : "One Way"} />
          <SummaryRow
            label="Booking type"
            value={isAirportTransfer ? "Airport Transfer" : "General Transfer"}
          />
          {isAirportTransfer && (
            <SummaryRow
              label="Transfer point"
              value={trip?.transfer_point === "drop" ? "Airport Drop-off" : "Airport Pickup"}
            />
          )}
          <SummaryRow label="Pickup date & time"
            value={
              trip?.date || trip?.time
                ? `${formatDateTime(trip?.date, "DD MMM YYYY") || ""} ${formatDateTime(trip?.time, "hh:mm A") || ""}`.trim()
                : undefined
            }
          />
          <SummaryRow label="Pickup location" value={trip?.pickup_address} full />
          <SummaryRow label="Drop-off location" value={trip?.drop_address} full />

          {isReturnTrip && (
            <>
              <SummaryDivider />
              <SummaryRow
                label="Return date & time"
                value={
                  trip?.return_date || trip?.return_time
                    ? `${formatDateTime(trip?.return_date, "DD MMM YYYY") || ""} ${formatDateTime(trip?.return_time, "hh:mm A") || ""}`.trim()
                    : undefined
                }
              />
              <SummaryRow label="Return pickup location" value={trip?.return_pickup_address} full />
              <SummaryRow label="Return drop-off location" value={trip?.return_drop_address} full />
            </>
          )}

          <SummaryDivider />
          <SummaryRow label="Vehicle" value={vehicleInfo?.vehicle_name} />
          <SummaryRow label="Passengers" value={passenger?.passenger} />
          <SummaryRow label="Large suitcases" value={passenger?.luggage} />
          <SummaryRow label="Hand luggage" value={passenger?.handbags} />
          {childSeatCount > 0 && <SummaryRow label="Child seats" value={childSeatCount} />}
          {childCapsuleCount > 0 && <SummaryRow label="Baby capsules" value={childCapsuleCount} />}
          {wheelchairCount > 0 && <SummaryRow label="Wheelchairs" value={wheelchairCount} />}

          {isAirportPickupBooking && (
            <>
              <SummaryDivider />
              <SummaryRow label="Airline" value={airlineLabel} />
              <SummaryRow label="Flight number" value={trip?.flight_number} />
              <SummaryRow
                label="Flight arrival time"
                value={formatDateTime(trip?.flight_arrival_time, "DD MMM YYYY hh:mm A")}
                full
              />
            </>
          )}

          {passenger?.notes && (
            <>
              <SummaryDivider />
              <SummaryRow label="Notes" value={passenger.notes} full />
            </>
          )}

          <SummaryDivider />
          <SummaryRow label="Passenger name" value={passenger?.name} />
          <SummaryRow
            label="Phone"
            value={passenger?.phone ? `${passenger?.country_code || ""} ${passenger.phone}` : undefined}
          />
          <SummaryRow label="Email" value={passenger?.email} full />
        </div>
      </div>

      <div className="w-full flex flex-col rounded-xl border border-slate-200 p-4">
        <h4 className="fw-semibold mb-2 text-[#0d1b2e]">Amount details</h4>
        <div className="w-full flex flex-row justify-between items-center">
          <span>Distance</span>
          <span>{vehicleInfo?.distance}km</span>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <span>Trip amount{isReturnTrip ? " (one way + return)" : ""}</span>
          <span>AUD ${tripAmount?.toFixed(2)}</span>
        </div>
        {govLevyAmount > 0 && <div className="w-full flex flex-row justify-between items-center">
          <span>Gov Levy</span>
          <span>AUD ${govLevyAmount?.toFixed(2)}</span>
        </div>}
        {vehicleInfo?.toll_charges > 0 && <div className="w-full flex flex-row justify-between items-center">
          <span>Toll Charges</span>
          <span>AUD ${(vehicleInfo?.toll_charges || 0)?.toFixed(2)}</span>
        </div>}
        {vehicleInfo?.airport_toll > 0 && <div className="w-full flex flex-row justify-between items-center">
          <span>Airport Toll</span>
          <span>AUD ${(vehicleInfo?.airport_toll || 0)?.toFixed(2)}</span>
        </div>}
        {vehicleInfo?.surcharge_amount > 0 && <div className="w-full flex flex-row justify-between items-center">
          <span>Surcharge  {vehicleInfo?.surcharge_type
            ? `(${vehicleInfo.surcharge_type
              .replace(/_/g, " ")
              .replace(/\b\w/g, char => char.toUpperCase())})`
            : ""}</span>
          <span>AUD ${(vehicleInfo?.surcharge_amount || 0)?.toFixed(2)}</span>
        </div>}
        {gstAmount > 0 && <div className="w-full flex flex-row justify-between items-center">
          <span>GST</span>
          <span>AUD ${gstAmount?.toFixed(2)}</span>
        </div>}
        {childSeatCount > 0 &&
          <div className="w-full flex flex-row justify-between items-center text-green-600">
            <span>
              Child Seats x {childSeatCount}
              {isReturnTrip ? " (fitted each way, ×2)" : ""}
            </span>
            <span>AUD ${childSeatAmount?.toFixed(2)}</span>
          </div>
        }
        {childCapsuleCount > 0 &&
          <div className="w-full flex flex-row justify-between items-center text-green-600">
            <span>
              Baby Capsule x {childCapsuleCount}
              {isReturnTrip ? " (fitted each way, ×2)" : ""}
            </span>
            <span>AUD ${childCapsuleAmount?.toFixed(2)}</span>
          </div>
        }
        {wheelchairCount > 0 &&
          <div className="w-full flex flex-row justify-between items-center text-green-600">
            <span>
              Wheel chair x {wheelchairCount}
              {isReturnTrip ? " (fitted each way, ×2)" : ""}
            </span>
            <span>AUD ${wheelchairAmount?.toFixed(2)}</span>
          </div>
        }
        <Divider />
        <div className="w-full flex flex-row justify-between items-center font-bold">
          <span>Total</span>
          <span>AUD ${totalAmount?.toFixed(2)}</span>
        </div>
      </div>
      </div>
      <Form.Item className="mb-0 mt-4">
        <Checkbox
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
        >
          I agree to the{" "}
          <span
            className="text-blue-500 underline cursor-pointer"
            onClick={onOpenTerms}
          >
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-blue-500 underline cursor-pointer"
            onClick={onOpenRefund}>
            Refund Policy
          </span>, I understand the cancellation and no show policy, and I authorise Tiptop ride to charge my card for this booking.
        </Checkbox>
      </Form.Item>
    </div>
  );
};

export default Step5ConfirmBook;
