"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Form, FormInstance } from "antd";
import { IVehicleDetails, IVehicleTypeOptions } from "@/booking-widget/interfaces/createBooking";
import { GlobalContext } from "@/booking-widget/context/Provider";
import henceforthApi from "@/booking-widget/utils/api";
import StepIndicator from "./StepIndicator";
import Step1JourneyDetails from "./Step1JourneyDetails";
import Step2PassengerVehicle from "./Step2PassengerVehicle";
import Step4YourDetails from "./Step4YourDetails";
import Step5ConfirmBook from "./Step5ConfirmBook";
import PolicyDrawers from "./PolicyDrawers";

interface BookingWizardProps {
  form: FormInstance;
  form2: FormInstance;
  vehicleOptions: IVehicleTypeOptions[];
  vehicleDetails: IVehicleDetails[];
  setBookingFormData: any;
  loadingPrices: boolean;
  showPricing: boolean;
  loadingSubmit: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSetDetailsData: (value: any) => void;
  onSubmit: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({
  form,
  form2,
  vehicleOptions,
  vehicleDetails,
  setBookingFormData,
  loadingPrices,
  showPricing,
  loadingSubmit,
  currentStep,
  setCurrentStep,
  onSetDetailsData,
  onSubmit,
}) => {
  const selectedVehicleId = Form.useWatch("vehicle_id", form);
  const vehicleInfo = vehicleDetails.find(
    (v) => v.vehicle_id?._id === selectedVehicleId
  );

  // Step 2 only offers the wheelchair-accessible vehicle, so default it to
  // selected as soon as pricing loads instead of making the user click it.
  useEffect(() => {
    const wheelchairVehicle = vehicleDetails.find((v) => v.is_wheelchair_vehicle);
    if (wheelchairVehicle && form.getFieldValue("vehicle_id") !== wheelchairVehicle.vehicle_id?._id) {
      form.setFieldValue("vehicle_id", wheelchairVehicle.vehicle_id?._id);
    }
  }, [vehicleDetails]);

  const bookingTransferType = Form.useWatch("booking_transfer_type", form);
  const transferPointValue = Form.useWatch("transfer_point", form);
  const isAirportTransfer = bookingTransferType === "airport_transfer";
  const isAirportPickupBooking = isAirportTransfer && transferPointValue === "pickup";

  const { Toast } = useContext(GlobalContext);
  const [airlineOptions, setAirlineOptions] = useState<{ label: string; options: { value: string; label: string }[] }[]>([]);
  const [airlineOptionsLoading, setAirlineOptionsLoading] = useState(false);

  useEffect(() => {
    if (!isAirportPickupBooking || airlineOptions.length) return;
    (async () => {
      try {
        setAirlineOptionsLoading(true);
        const res: any = await henceforthApi.createBooking.getAirlines();
        const data = res?.data ?? [];
        const domestic = data.filter((item: any) => item.type === "domestic");
        const international = data.filter((item: any) => item.type === "international");
        setAirlineOptions([
          { label: "Domestic Airlines", options: domestic },
          { label: "International Airlines", options: international },
        ]);
      } catch (error) {
        Toast?.error(error);
      } finally {
        setAirlineOptionsLoading(false);
      }
    })();
  }, [isAirportPickupBooking]);

  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [showFlightFields, setShowFlightFields] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  const watch2 = Form.useWatch([], form2);
  const childSeatCount = watch2?.no_of_childseat || 0;
  const childCapsuleCount = watch2?.no_of_childcapsule || 0;
  const wheelchairCount = watch2?.no_of_wheelchair || 0;

  // Dynamic caps driven by wheelchair count
  const maxPassenger =
    wheelchairCount === 1 ? 5 :
    wheelchairCount >= 2 ? 3 :
    Number(vehicleInfo?.passenger) || 0;

  const maxLuggage =
    wheelchairCount >= 1 ? 7 :
    Number(vehicleInfo?.luggage) || 0;

  const handleChildSeatChange = useCallback((newSeatValue: number) => {
    form2.setFieldValue("no_of_childseat", newSeatValue);
  }, [form2]);

  const handleChildCapsuleChange = useCallback((newCapsuleValue: number) => {
    form2.setFieldValue("no_of_childcapsule", newCapsuleValue);
  }, [form2]);

  useEffect(() => {
    const newFilters = new Set(selectedFilters);
    if (watch2?.no_of_childseat) {
      newFilters.add("child_seat");
    } else {
      newFilters.delete("child_seat");
    }

    if (watch2?.no_of_wheelchair) {
      newFilters.add("wheel_chair");
    } else {
      newFilters.delete("wheel_chair");
    }
    if (watch2?.no_of_childcapsule) {
      newFilters.add("child_capsule");
    } else {
      newFilters.delete("child_capsule");
    }

    setSelectedFilters(Array.from(newFilters));
  }, [watch2?.no_of_childseat, watch2?.no_of_wheelchair, watch2?.no_of_childcapsule]);

  // Clamp passenger and luggage whenever wheelchair count changes
  useEffect(() => {
    const currentPassenger = Number(form2.getFieldValue("passenger")) || 1;
    const currentLuggage = Number(form2.getFieldValue("luggage")) || 0;
    if (currentPassenger > maxPassenger) {
      form2.setFieldValue("passenger", maxPassenger);
    }
    if (currentLuggage > maxLuggage) {
      form2.setFieldValue("luggage", maxLuggage);
    }
  }, [wheelchairCount]);

  const handleSelectVehicle = (vehicle: IVehicleDetails) => {
    form.setFieldValue("vehicle_id", vehicle?.vehicle_id?._id);
  };

  const handleNext = async () => {
    try {
      if (currentStep === 1) {
        const fields = [
          "pickup_address",
          "drop_address",
          "date",
          "time",
          ...(isAirportTransfer ? ["transfer_point"] : []),
          ...(isAirportPickupBooking ? ["airport_pickup_type"] : []),
          ...(isReturnTrip
            ? ["return_pickup_address", "return_drop_address", "return_date", "return_time"]
            : []),
        ];
        await form.validateFields(fields);
      } else if (currentStep === 2) {
        await form.validateFields(["vehicle_id"]);
      } else if (currentStep === 3) {
        await form2.validateFields(["name", "phone", "email", "country_code"]);
      }
      setCurrentStep(Math.min(currentStep + 1, 4));
    } catch (err) {
      console.error("Validate Failed:", err);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleBookNow = () => {
    form2
      .validateFields()
      .then((values) => {
        onSetDetailsData({
          ...values,
          filter: selectedFilters,
        });
      })
      .then(() => onSubmit())
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const isBookDisabled = !isAgreed;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
      <StepIndicator currentStep={currentStep} />

      <div className={currentStep === 1 ? "" : "hidden"}>
        <Step1JourneyDetails
          form={form}
          vehicleOptions={vehicleOptions}
          setBookingFormData={setBookingFormData}
          onAirportPickupChange={setShowFlightFields}
          onReturnTripChange={setIsReturnTrip}
        />
      </div>

      <Form form={form2} component={false}>
        <div className={currentStep === 2 ? "" : "hidden"}>
          <Step2PassengerVehicle
            vehicleDetails={vehicleDetails}
            loadingPrices={loadingPrices}
            showPricing={showPricing}
            selectedVehicleId={selectedVehicleId}
            vehicleInfo={vehicleInfo}
            onSelectVehicle={handleSelectVehicle}
            form={form}
            form2={form2}
            maxPassenger={maxPassenger}
            maxLuggage={maxLuggage}
            showFlightFields={showFlightFields}
            childSeatCount={childSeatCount}
            childCapsuleCount={childCapsuleCount}
            onChildSeatChange={handleChildSeatChange}
            onChildCapsuleChange={handleChildCapsuleChange}
            airlineOptions={airlineOptions}
            airlineOptionsLoading={airlineOptionsLoading}
          />
        </div>

        <div className={currentStep === 3 ? "" : "hidden"}>
          <Step4YourDetails form={form2} />
        </div>
      </Form>

      <div className={currentStep === 4 ? "" : "hidden"}>
        <Step5ConfirmBook
          form={form}
          form2={form2}
          vehicleInfo={vehicleInfo}
          isReturnTrip={isReturnTrip}
          isAirportTransfer={isAirportTransfer}
          isAirportPickupBooking={isAirportPickupBooking}
          childSeatCount={childSeatCount}
          childCapsuleCount={childCapsuleCount}
          wheelchairCount={wheelchairCount}
          airlineOptions={airlineOptions}
          isAgreed={isAgreed}
          setIsAgreed={setIsAgreed}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenRefund={() => setIsRefundOpen(true)}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="rounded-full px-5 py-2 text-sm font-semibold border transition-colors border-[#0d1b2e] text-[#0d1b2e] hover:bg-[#0d1b2e]/5 disabled:border-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Back
        </button>
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 2 && !vehicleInfo}
            className="rounded-full px-6 py-2 text-sm font-semibold bg-[#1d69b4] text-white transition-colors hover:bg-[#ff3802] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1d69b4]"
          >
            Next Step
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBookNow}
            disabled={isBookDisabled || loadingSubmit}
            className="rounded-full px-6 py-2 text-sm font-semibold bg-[#1d69b4] text-white transition-colors hover:bg-[#ff3802] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1d69b4]"
          >
            {loadingSubmit ? "Booking..." : "Book Now"}
          </button>
        )}
      </div>

      <PolicyDrawers
        isTermsOpen={isTermsOpen}
        setIsTermsOpen={setIsTermsOpen}
        isRefundOpen={isRefundOpen}
        setIsRefundOpen={setIsRefundOpen}
      />
    </div>
  );
};

export default BookingWizard;
