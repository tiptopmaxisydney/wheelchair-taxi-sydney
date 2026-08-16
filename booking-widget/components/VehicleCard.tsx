import { LuggageIcon } from "@/booking-widget/components/icons/LuggageIcon";
import { PeoplesIcon } from "@/booking-widget/components/icons/PeoplesIcon";
import { SuitCaseIcon } from "@/booking-widget/components/icons/SuitCaseIcon";
import ChildSeatIcon from "@/booking-widget/components/icons/ChildSeatIcon";
import WheelChairIcon from "@/booking-widget/components/icons/WheelChairIcon";
import BabyCapsule from "@/booking-widget/components/icons/BabyCapsule";
import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";
import { Card, Image } from "antd";

interface VehicleCardProps extends IVehicleDetails {
  showPricing: boolean;
  onButtonClick: any
  loading?: any,
  showPricingState?: any
  showBabyseatOption?: boolean
  selected?: boolean
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle_name,
  vehicle_id,
  passenger,
  luggage,
  handbags,
  child_seat_charges,
  child_capsule_charges,
  wheel_chair_charges,
  max_babyseat,
  max_babycapsule,
  max_wheelchair,
  showPricing,
  base_fee,
  surcharge_amount,
  tax,
  gov_levy,
  airport_toll,
  one_way_amount,
  return_trip_amount,
  onButtonClick,
  loading,
  showBabyseatOption = false,
  selected = false,
}) => {
  return (
  <Card
    className={[
      "vehicle_card w-full !rounded-2xl transition-colors",
      selected ? "!border-2 !border-[#0d1b2e]" : "!border !border-slate-200 hover:!border-[#0d1b2e]/40",
    ].join(" ")}
    styles={{ body: { padding: 16 } }}
  >
    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4 vehicle_card_inner">
      <div className="flex flex-col items-center gap-2 flex-shrink-0 w-full sm:w-28">
        <Image
          src={process.env.NEXT_PUBLIC_DEV_BUCKET_ROOT + vehicle_id.image}
          alt={process.env.NEXT_PUBLIC_DEV_BUCKET_ROOT + vehicle_id.image}
          width="100%"
          height={90}
          className="rounded-xl object-contain"
          preview={false}
        />
        <h3 className="text-sm font-semibold text-[#0d1b2e] text-center">{vehicle_name}</h3>
      </div>

      <div className="hidden sm:block w-px bg-slate-100 self-stretch" />

      <div className="flex-1 flex flex-col justify-center gap-1.5 text-sm text-slate-600 w-full [&_svg]:w-4 [&_svg]:h-4 [&_svg]:flex-shrink-0">
        <div className="flex items-center gap-2">
          <PeoplesIcon />
          <span>{passenger} passengers</span>
        </div>
        <div className="flex items-center gap-2">
          <SuitCaseIcon />
          <span>{luggage} large suitcases</span>
        </div>
        <div className="flex items-center gap-2">
          <LuggageIcon />
          <span>{handbags} hand luggage</span>
        </div>
        {showBabyseatOption &&
          <>
            {child_seat_charges != null && Number(max_babyseat ?? 2) > 0 &&
              <div className="flex items-center gap-2">
                <ChildSeatIcon />
                <span>{max_babyseat ?? 2} Babyseat</span>
              </div>
            }
            {child_capsule_charges != null && Number(max_babycapsule ?? 2) > 0 &&
              <div className="flex items-center gap-2">
                <BabyCapsule />
                <span>{max_babycapsule ?? 2} Babycapsule</span>
              </div>
            }
            {wheel_chair_charges != null && Number(max_wheelchair ?? 2) > 0 &&
              <div className="flex items-center gap-2">
                <WheelChairIcon />
                <span>{max_wheelchair ?? 2} WheelChair</span>
              </div>
            }
          </>
        }
      </div>

      {(loading || showPricing) && (
        <div className="hidden sm:block w-px bg-slate-100 self-stretch" />
      )}

      {loading ? (
        <div className="flex items-center justify-center flex-shrink-0 w-full sm:w-auto">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        showPricing && (
          <div className="flex flex-col items-center sm:items-end justify-center gap-1 flex-shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 text-center sm:text-right">
            <div className="text-xs font-medium text-slate-400 tracking-wide">AUD</div>
            {return_trip_amount != null ? (
              <>
                <div className="text-2xl font-bold text-[#0d1b2e]">
                  ${(base_fee + surcharge_amount + tax + gov_levy + airport_toll).toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  <div>One Way: ${Number(one_way_amount ?? 0).toFixed(2)}</div>
                  <div>Return Trip: ${Number(return_trip_amount).toFixed(2)}</div>
                </div>
              </>
            ) : (
              <div className="text-2xl font-bold text-[#0d1b2e]">
                ${(base_fee + surcharge_amount + tax + gov_levy + airport_toll).toFixed(2)}
              </div>
            )}
            <button
              type="button"
              onClick={onButtonClick}
              className="mt-1 rounded-full px-6 py-2 text-sm font-semibold bg-[#1d69b4] text-white transition-colors hover:bg-[#ff3802] w-full sm:w-auto"
            >
              Select
            </button>
          </div>
        )
      )}
    </div>
  </Card>
  );
};

export default VehicleCard;
