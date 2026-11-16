import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";

// Fare breakdown for the selected vehicle — shared by the Confirm step's "Amount details"
// and the "Your transfer" summary panel, so both always show the same total. The numbers
// come from the backend's pricing response (booking/web/vehicle/pricing); this only adds
// the extras the guest chose in step 2 on top, the same way the source (tiptopnextjs) does.

export interface FareExtras {
  isReturnTrip: boolean;
  childSeatCount: number;
  childCapsuleCount: number;
  wheelchairCount: number;
}

export interface FareBreakdown {
  equipmentLegs: number;
  childSeatAmount: number;
  childCapsuleAmount: number;
  wheelchairAmount: number;
  equipmentAmount: number;
  gstAmount: number;
  tripAmount: number;
  govLevyAmount: number;
  totalAmount: number;
}

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

export function computeFare(vehicleInfo: IVehicleDetails | undefined, extras: FareExtras): FareBreakdown {
  // Equipment (child seat/baby capsule/wheelchair) is fitted per leg, so a
  // return trip bills it twice.
  const equipmentLegs = extras.isReturnTrip ? 2 : 1;

  const childSeatAmount = extras.childSeatCount * (vehicleInfo?.child_seat_charges || 0) * equipmentLegs;
  const childCapsuleAmount = extras.childCapsuleCount * (vehicleInfo?.child_capsule_charges || 0) * equipmentLegs;
  const wheelchairAmount = vehicleInfo?.is_wheelchair_vehicle
    ? computeWheelchairSurcharge(vehicleInfo?.distance_fare || 0, extras.wheelchairCount, vehicleInfo?.wheel_chair_charges || 0) * equipmentLegs
    : extras.wheelchairCount * (vehicleInfo?.wheel_chair_charges || 0) * equipmentLegs;
  const equipmentAmount = childSeatAmount + childCapsuleAmount + wheelchairAmount;
  // Wheelchair-taxi fares are all-inclusive: no GST is charged (matches the backend's
  // is_wheelchair_vehicle handling in pricing.service.ts / booking.service.ts).
  const gstAmount = vehicleInfo?.is_wheelchair_vehicle
    ? 0
    : ((vehicleInfo?.base_fee || 0) + equipmentAmount + (vehicleInfo?.airport_toll || 0)) * (Number(vehicleInfo?.tax_percentage) / 100 || 0);
  const tripAmount = (vehicleInfo?.base_fee || 0) - (vehicleInfo?.toll_charges || 0);
  // Wheelchair-taxi fares also carry no government levy on top (all-inclusive table fare).
  const govLevyAmount = vehicleInfo?.is_wheelchair_vehicle ? 0 : (vehicleInfo?.gov_levy || 0);
  const totalAmount =
    tripAmount +
    govLevyAmount +
    (vehicleInfo?.toll_charges || 0) +
    (vehicleInfo?.airport_toll || 0) +
    (vehicleInfo?.surcharge_amount || 0) +
    gstAmount +
    equipmentAmount;

  return {
    equipmentLegs,
    childSeatAmount,
    childCapsuleAmount,
    wheelchairAmount,
    equipmentAmount,
    gstAmount,
    tripAmount,
    govLevyAmount,
    totalAmount,
  };
}
