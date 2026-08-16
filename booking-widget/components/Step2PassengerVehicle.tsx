"use client";

import { SuitCaseIcon } from "@/booking-widget/components/icons/SuitCaseIcon";
import { LuggageIcon } from "@/booking-widget/components/icons/LuggageIcon";
import { PeoplesIcon } from "@/booking-widget/components/icons/PeoplesIcon";
import ChildSeatIcon from "@/booking-widget/components/icons/ChildSeatIcon";
import WheelChairIcon from "@/booking-widget/components/icons/WheelChairIcon";
import BabyCapsule from "@/booking-widget/components/icons/BabyCapsule";
import FlightIcon from "@/booking-widget/components/icons/FlightIcon";
import ClockIcon from "@/booking-widget/components/icons/ClockIcon";
import Counter from "@/booking-widget/components/Counter";
import { IVehicleDetails } from "@/booking-widget/interfaces/createBooking";
import { DatePicker, Form, FormInstance, Input, Select } from "antd";
import VehicleCard from "./VehicleCard";

const TextArea = Input.TextArea;

interface Step2PassengerVehicleProps {
  vehicleDetails: IVehicleDetails[];
  loadingPrices: boolean;
  showPricing: boolean;
  selectedVehicleId?: string;
  vehicleInfo?: IVehicleDetails;
  onSelectVehicle: (vehicle: IVehicleDetails) => void;
  form: FormInstance;
  form2: FormInstance;
  maxPassenger: number;
  maxLuggage: number;
  showFlightFields: boolean;
  childSeatCount: number;
  childCapsuleCount: number;
  onChildSeatChange: (value: number) => void;
  onChildCapsuleChange: (value: number) => void;
  airlineOptions: { label: string; options: { value: string; label: string }[] }[];
  airlineOptionsLoading: boolean;
}

const Step2PassengerVehicle: React.FC<Step2PassengerVehicleProps> = ({
  vehicleDetails,
  loadingPrices,
  showPricing,
  selectedVehicleId,
  vehicleInfo,
  onSelectVehicle,
  form,
  form2,
  maxPassenger,
  maxLuggage,
  showFlightFields,
  childSeatCount,
  childCapsuleCount,
  onChildSeatChange,
  onChildCapsuleChange,
  airlineOptions,
  airlineOptionsLoading,
}) => {
  const effectiveMaxHandbags = Number(vehicleInfo?.handbags);
  const effectiveMaxBabyseat = Number(vehicleInfo?.max_babyseat ?? 2);
  const effectiveMaxBabycapsule = Number(vehicleInfo?.max_babycapsule ?? 2);
  const effectiveMaxWheelchairs = Number(vehicleInfo?.max_wheelchair ?? 2);

  const showBabyseat = vehicleInfo?.child_seat_charges != null && effectiveMaxBabyseat > 0;
  const showBabycapsule = vehicleInfo?.child_capsule_charges != null && effectiveMaxBabycapsule > 0;
  const showWheelchair = vehicleInfo?.wheel_chair_charges != null && effectiveMaxWheelchairs > 0;
  const hasEquipmentOptions = showBabyseat || showBabycapsule || showWheelchair;

  // ── Flight Details (Airport Pickup only) — fields live on `form` (Step 1's
  // instance), not `form2`, since booking_transfer_type/transfer_point/arrival
  // date all live there too and the backend expects them together.
  const bookingTransferType = Form.useWatch("booking_transfer_type", form);
  const transferPointValue = Form.useWatch("transfer_point", form);
  const isAirportPickup = bookingTransferType === "airport_transfer" && transferPointValue === "pickup";

  // Only the wheelchair-accessible vehicle is offered here — this widget exists
  // specifically for wheelchair taxi bookings, so the other vehicle categories the
  // pricing API returns aren't relevant choices for this flow.
  const wheelchairVehicles = vehicleDetails?.filter((vehicle) => vehicle.is_wheelchair_vehicle) ?? [];

  return (
    <div>
      <h3 className="fw-semibold mb-2">Choose your vehicle</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {wheelchairVehicles.length > 0 ? (
          <>
            {wheelchairVehicles.map((vehicle, index) => (
              <VehicleCard
                key={index}
                {...vehicle}
                onButtonClick={() => {
                  onSelectVehicle(vehicle);
                }}
                showPricing={showPricing}
                loading={loadingPrices}
                showPricingState={showPricing}
                showBabyseatOption={true}
                selected={selectedVehicleId === vehicle.vehicle_id?._id}
              />
            ))}
          </>
        ) : (
          <p className="text-gray-500 sm:col-span-2">
            Enter your journey details to see available vehicles and pricing.
          </p>
        )}
      </div>

      {vehicleInfo && (
        <div>
          <h3 className="fw-semibold mb-2">Passengers &amp; luggage</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
            <Counter
              key={`passenger-${maxPassenger}`}
              name="passenger"
              label="No. of passengers"
              description={`Maximum ${maxPassenger}`}
              icon={<PeoplesIcon />}
              initialValue={Math.min(Number(form2.getFieldValue("passenger")) || 1, maxPassenger)}
              min={1}
              max={maxPassenger}
              onChange={(value) => {
                form2.setFieldValue("passenger", value);
              }}
            />
            <Counter
              key={`luggage-${maxLuggage}`}
              name="luggage"
              label="No. of large suitcases"
              description={`Maximum ${maxLuggage}`}
              icon={<SuitCaseIcon />}
              initialValue={Math.min(Number(form2.getFieldValue("luggage")) || 0, maxLuggage)}
              min={0}
              max={maxLuggage}
              onChange={(value) => {
                form2.setFieldValue("luggage", value);
              }}
            />
            <Counter
              key={`handbags-${effectiveMaxHandbags}`}
              name="handbags"
              label="No. of hand luggages"
              description={`Maximum ${effectiveMaxHandbags}`}
              icon={<LuggageIcon />}
              initialValue={0}
              min={0}
              max={effectiveMaxHandbags}
              onChange={(value) => {
                form2.setFieldValue("handbags", value);
              }}
            />
          </div>

          <h3 className="fw-semibold mb-2 text-[#0d1b2e]">Special requirements</h3>

          {hasEquipmentOptions ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {showBabyseat && (
                <Counter
                  key={`childseat-${childSeatCount}`}
                  name="no_of_childseat"
                  label="No. of Child Seats"
                  description={`Price per seat $${(Number(vehicleInfo?.child_seat_charges) || 0).toFixed(2)} \n1 to 3 years`}
                  icon={<ChildSeatIcon />}
                  initialValue={childSeatCount || 0}
                  min={0}
                  max={effectiveMaxBabyseat}
                  onChange={onChildSeatChange}
                />
              )}

              {showBabycapsule && (
                <Counter
                  key={`childcapsule-${childCapsuleCount}`}
                  name="no_of_childcapsule"
                  label="No. of Baby Capsules"
                  description={`Price per capsule $${(Number(vehicleInfo?.child_capsule_charges) || 0).toFixed(2)} \n0 to 12 months`}
                  icon={<BabyCapsule />}
                  initialValue={childCapsuleCount || 0}
                  min={0}
                  max={effectiveMaxBabycapsule}
                  onChange={onChildCapsuleChange}
                />
              )}

              {showWheelchair && (
                <Counter
                  key={`wheelchair-${effectiveMaxWheelchairs}`}
                  name="no_of_wheelchair"
                  label="No. of wheel chairs"
                  description={
                    vehicleInfo?.is_wheelchair_vehicle
                      ? `First chair included in fare; +$${Number(vehicleInfo?.wheel_chair_charges).toFixed(2)} per additional chair (4 chairs requires two vans)`
                      : `Price per chair $${Number(vehicleInfo?.wheel_chair_charges).toFixed(2)}`
                  }
                  icon={<WheelChairIcon />}
                  initialValue={0}
                  min={0}
                  max={effectiveMaxWheelchairs}
                  onChange={(value) => {
                    form2.setFieldValue("no_of_wheelchair", value);
                  }}
                />
              )}

            </div>
          ) : (
            <p className="text-gray-500 mb-5">
              No child seat, baby capsule, or wheelchair options for the selected vehicle.
            </p>
          )}

          {isAirportPickup && (
            <div className="mb-4">
              <h3 className="fw-semibold mb-2 text-[#0d1b2e]">Flight Details</h3>
              <Form form={form} component={false}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                    <span className="flex-shrink-0 flex items-center">
                      <FlightIcon />
                    </span>
                    <Form.Item name="airline" className="w-100 mb-0 flex-1" noStyle>
                      <Select
                        size="large"
                        variant="borderless"
                        className="w-100 !h-[42px] !p-0 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!h-[42px] [&_.ant-select-selection-item]:!leading-[42px] [&_.ant-select-selection-placeholder]:!h-[42px] [&_.ant-select-selection-placeholder]:!leading-[42px] [&_.ant-select-selection-search-input]:!h-[42px] [&_.ant-select-selection-search-input]:!leading-[42px]"
                        placeholder="Select Airline"
                        allowClear
                        showSearch
                        options={airlineOptions}
                        loading={airlineOptionsLoading}
                        disabled={airlineOptionsLoading}
                        filterOption={(input, option: any) =>
                          !!option?.label && option.label.toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                    <span className="flex-shrink-0 flex items-center">
                      <FlightIcon />
                    </span>
                    <Form.Item name="flight_number" className="w-100 mb-0 flex-1" noStyle>
                      <Input type="text" size="large" variant="borderless" className="!p-0" placeholder="Enter Flight Number" />
                    </Form.Item>
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                    <span className="flex-shrink-0 flex items-center">
                      <ClockIcon />
                    </span>
                    <Form.Item name="flight_arrival_time" className="w-100 mb-0 flex-1" noStyle>
                      <DatePicker
                        size="large"
                        variant="borderless"
                        inputReadOnly
                        className="w-100 !p-0"
                        showTime={{ format: "hh:mm A", use12Hours: true }}
                        format="DD MMM YYYY hh:mm A"
                        placeholder="Flight Arrival Time"
                        suffixIcon=""
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          )}

          {showFlightFields && (
            <div className="w-100 space-y-3">
              <div className="border border-slate-200 rounded-xl px-3 py-2 transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <Form.Item className="mb-0" name={'notes'} noStyle>
                  <TextArea
                    size="large"
                    variant="borderless"
                    className="!p-0"
                    placeholder="Any Notes"
                    rows={3}
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2PassengerVehicle;
