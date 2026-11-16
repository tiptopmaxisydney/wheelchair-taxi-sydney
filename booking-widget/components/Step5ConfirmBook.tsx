"use client";

import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";
import { computeFare } from "@/booking-widget/utils/fare";
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
  pramCount: number;
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
  pramCount,
  airlineOptions,
  isAgreed,
  setIsAgreed,
  onOpenTerms,
  onOpenRefund,
}) => {
  // Equipment is fitted per leg, so a return trip bills it twice — shown explicitly
  // below rather than silently doubling the number so the customer can see why.
  // Same calculation as the "Your transfer" panel (see utils/fare.ts).
  const {
    childSeatAmount,
    childCapsuleAmount,
    wheelchairAmount,
    gstAmount,
    tripAmount,
    govLevyAmount,
    totalAmount,
  } = computeFare(vehicleInfo, { isReturnTrip, childSeatCount, childCapsuleCount, wheelchairCount });

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
          {pramCount > 0 && <SummaryRow label="Prams/Strollers" value={pramCount} />}

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
