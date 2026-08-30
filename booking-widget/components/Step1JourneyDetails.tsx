"use client";

import CalenderIcon from "@/booking-widget/components/icons/CalenderIcon";
import ClockIcon from "@/booking-widget/components/icons/ClockIcon";
import PinIcon from "@/booking-widget/components/icons/PinIcon";
import RadioIcon from "@/booking-widget/components/icons/RadioIcon";
import SwapIcon from "@/booking-widget/components/icons/SwapIcon";
import { DatePicker, Form, Select, TimePicker, Input, Modal, Radio } from "antd";
import { useState, useEffect, useCallback, useContext } from "react";
import { IVehicleTypeOptions } from "@/booking-widget/interfaces/createBooking";
import { disabledPreviousDate, loadGoogleMapScript } from "@/booking-widget/utils/CommonFunctions";
import PlusIconWithBorder from "@/booking-widget/components/icons/PlusIconWithBorder";
import CrossIconWithBorder from "@/booking-widget/components/icons/CrossIconWithBorder";
import DestinationSquareIcon from "@/booking-widget/components/icons/DestinationSquareIcon";
import FormFieldError from "@/booking-widget/components/FormFieldError";
import AddressAutocomplete, { AddressSelection } from "@/booking-widget/components/AddressAutocomplete";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { GlobalContext } from "@/booking-widget/context/Provider";
import henceforthApi, { center, country, DomesticAirportAddress, InternationalAirportAddress, MohaliAirportAddress } from "@/booking-widget/utils/api";

const { Option } = Select;
const RadioGroup = Radio.Group;

export interface Step1JourneyDetailsProps {
  vehicleOptions: IVehicleTypeOptions[];
  setBookingFormData: any;
  form: any;
  onAirportPickupChange?: (showFlightFields: boolean) => void;
  onReturnTripChange?: (isReturnTrip: boolean) => void;
}

export interface Stop {
  name: string;
  lat: string;
  long: string;
}

const Step1JourneyDetails: React.FC<Step1JourneyDetailsProps> = ({
  form,
  vehicleOptions,
  setBookingFormData,
  onAirportPickupChange,
  onReturnTripChange,
}) => {
  const searchParams = useSearchParams();
  const [stops, setStops] = useState<Stop[]>([]);
  const [updatedStops, setUpdatedStops] = useState<Stop[]>([]);
  const { Toast } = useContext(GlobalContext)
  const [showFields, setShowFields] = useState(false)
  const [pickupLatLng, setPickupLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dropLatLng, setDropLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dropAddress, setDropAddress] = useState("");

  // ── Return trip (same feature as the dispatcher's create-booking form) ──
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [isReturnAutoFilled, setIsReturnAutoFilled] = useState(false);
  const [returnStops, setReturnStops] = useState<Stop[]>([]);
  const [updatedReturnStops, setUpdatedReturnStops] = useState<Stop[]>([]);
  const [returnPickupAddress, setReturnPickupAddress] = useState("");
  const [returnDropAddress, setReturnDropAddress] = useState("");
  const [returnPickupLatLng, setReturnPickupLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [returnDropLatLng, setReturnDropLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const handleAddReturnStop = useCallback(() => {
    setReturnStops([...returnStops, { name: "", lat: "", long: "" }]);
  }, [returnStops]);

  const handleRemoveReturnStop = useCallback((index: number) => {
    const updated = returnStops.filter((_, i) => i !== index);
    setReturnStops(updated);
    setUpdatedReturnStops(updated);
  }, [returnStops]);

  const handleAddStop = useCallback(() => {
    setStops([...stops, { name: "", lat: "", long: "" }]);
  }, [stops]);

  const handleRemoveStop = useCallback((index: number) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    setStops(updatedStops);
    setUpdatedStops(updatedStops);
  }, [stops]);

  const [isAirport, setIsAirport] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<any>("Sydney_international_airport")

  // ── Booking type (Transfer / Airport Transfer) — same flow as the dispatcher's create-booking form ──
  const bookingTransferType = Form.useWatch("booking_transfer_type", form);
  const transferPointValue = Form.useWatch("transfer_point", form);
  const isAirportTransfer = bookingTransferType === "airport_transfer";
  const isAirportPickup = isAirportTransfer && transferPointValue === "pickup";
  const isAirportDropoff = isAirportTransfer && transferPointValue === "drop";
  const [airportOptions, setAirportOptions] = useState<{ value: string; label: string; address: string; lat: number; lng: number }[]>([]);
  const [airportOptionsLoading, setAirportOptionsLoading] = useState(false);

  useEffect(() => {
    if (!isAirportPickup || airportOptions.length) return;
    (async () => {
      try {
        setAirportOptionsLoading(true);
        const res: any = await henceforthApi.createBooking.getAirports();
        setAirportOptions(res?.data ?? []);
      } catch (error) {
        Toast?.error(error);
      } finally {
        setAirportOptionsLoading(false);
      }
    })();
  }, [isAirportPickup]);

  const onSelectAirport = (value: string) => {
    const selected = airportOptions.find((a) => a.value === value);
    if (!selected) return;
    setPickupLatLng({ lat: selected.lat, lng: selected.lng });
    form.setFieldValue("pickup_address", selected.address);
    form.setFieldValue("time", null);
  };

  // Clear the airport sub-fields whenever the user backs out of Airport Transfer,
  // or switches to Airport Drop-off (flight details only apply to pickups).
  useEffect(() => {
    if (!isAirportTransfer) {
      form.setFieldsValue({
        transfer_point: null,
        airport_pickup_type: null,
        airline: null,
        flight_number: null,
        flight_arrival_time: null,
      });
    }
  }, [isAirportTransfer]);

  useEffect(() => {
    if (isAirportDropoff) {
      form.setFieldsValue({
        airport_pickup_type: null,
        airline: null,
        flight_number: null,
        flight_arrival_time: null,
      });
    }
  }, [isAirportDropoff]);

  // If the pickup address is detected as an airport (typed address match below),
  // default the booking type to Airport Transfer / Pickup so the flight-details
  // fields surface automatically instead of leaving the user to find the toggle.
  useEffect(() => {
    if (showFields && form.getFieldValue("booking_transfer_type") !== "airport_transfer") {
      form.setFieldsValue({ booking_transfer_type: "airport_transfer", transfer_point: "pickup" });
    }
  }, [showFields]);

  // scheduled_date drives pricing/availability for every booking, but airport
  // transfers are keyed off arrival_date on the backend — keep both in sync.
  const setPrimaryDate = (value: any) => {
    form.setFieldValue("scheduled_date", value);
    if (form.getFieldValue("booking_transfer_type") === "airport_transfer") {
      form.setFieldValue("arrival_date", value);
    } else {
      form.setFieldValue("arrival_date", null);
    }
  };

  useEffect(() => {
    if (isAirportTransfer) {
      const scheduledDate = form.getFieldValue("scheduled_date");
      if (scheduledDate != null) {
        form.setFieldValue("arrival_date", scheduledDate);
      }
    } else {
      form.setFieldValue("arrival_date", null);
    }
  }, [isAirportTransfer]);

  useEffect(() => {
    onAirportPickupChange?.(showFields || isAirportTransfer);
  }, [showFields, isAirportTransfer, onAirportPickupChange]);

  useEffect(() => {
    onReturnTripChange?.(isReturnTrip);
  }, [isReturnTrip, onReturnTripChange]);

  // Autofill pickup/dropoff/date/time from URL query params, e.g. a link shared
  // from a marketing page: ?pickup=...&dropoff=...&date=YYYY-MM-DD&time=HH:mm
  // &pickup_lat=...&pickup_lng=...&dropoff_lat=...&dropoff_lng=...
  useEffect(() => {
    const pickup = searchParams.get("pickup");
    const dropoff = searchParams.get("dropoff");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const pickup_lat = searchParams.get("pickup_lat");
    const pickup_lng = searchParams.get("pickup_lng");
    const dropoff_lat = searchParams.get("dropoff_lat");
    const dropoff_lng = searchParams.get("dropoff_lng");

    if (pickup && pickup_lat && pickup_lng) {
      const pickupAddress = String(pickup);
      setPickupLatLng({ lat: Number(pickup_lat), lng: Number(pickup_lng) });
      form.setFieldValue("pickup_address", pickupAddress);
      setShowFields(/airport/i.test(pickupAddress));
    }

    if (dropoff && dropoff_lat && dropoff_lng) {
      const dropoffAddress = String(dropoff);
      setDropLatLng({ lat: Number(dropoff_lat), lng: Number(dropoff_lng) });
      setDropAddress(dropoffAddress);
      form.setFieldValue("drop_address", dropoffAddress);
    }

    // dayjs() has no format-string parser here (customParseFormat plugin isn't
    // registered anywhere in this app), so "YYYY-MM-DD" is parsed via the
    // native ISO date parse and "HH:mm" is split by hand rather than relying
    // on dayjs(str, "HH:mm") — which would silently no-op without the plugin.
    const parsedDate = date ? dayjs(String(date)) : null;
    const timeMatch = time ? String(time).match(/^(\d{1,2}):(\d{2})$/) : null;
    const parsedTime = timeMatch
      ? dayjs().hour(Number(timeMatch[1])).minute(Number(timeMatch[2])).second(0).millisecond(0)
      : null;

    if (parsedDate?.isValid()) {
      form.setFieldValue("date", parsedDate);
    }
    if (parsedTime) {
      form.setFieldValue("time", parsedTime);
    }
    if (parsedDate?.isValid() && parsedTime) {
      const combinedDate = parsedDate.set("hour", parsedTime.hour()).set("minute", parsedTime.minute());
      setPrimaryDate(combinedDate.valueOf());
    }
  }, [searchParams]);

  const onSelectmodalAddress = () => {
    if (selectedAddress == 'mohali_international_airport') {
      setPickupLatLng({
        lat: MohaliAirportAddress.lat,
        lng: MohaliAirportAddress.lng,
      });
      form.setFieldValue("pickup_address", MohaliAirportAddress.formattedAddress);
    } else {
      if (selectedAddress == "Sydney_international_airport") {
        setPickupLatLng({
          lat: InternationalAirportAddress.lat,
          lng: InternationalAirportAddress.lng,
        });
        form.setFieldValue("pickup_address", InternationalAirportAddress.formattedAddress);

      } else {
        setPickupLatLng({
          lat: DomesticAirportAddress.lat,
          lng: DomesticAirportAddress.lng,
        });
        form.setFieldValue("pickup_address", DomesticAirportAddress.formattedAddress);
      }
    }

    setIsAirport(false)
    form.setFieldValue("time", null);
  }


  const isAirportName = (name?: string) => {
    const lname = name?.toLowerCase() || "";
    return (
      lname.includes("shaheed bhagat singh international airport, chandigarh") ||
      lname.includes("sydney airport")
    );
  };

  const handleAddressResolve = (field: string, result: AddressSelection, index?: number) => {
    const { address, lat, lng, name } = result;

    if (field === "pickup") {
      if (isAirportName(name)) {
        setIsAirport(true);
        setShowFields(true);
      } else {
        setPickupLatLng({ lat: Number(lat), lng: Number(lng) });
        form.setFieldValue("pickup_address", address);
        form.setFieldValue("time", null);
      }
    }

    if (field === "destination") {
      setDropLatLng({ lat: Number(lat), lng: Number(lng) });
      form.setFieldValue("drop_address", address);
      setDropAddress(address);
    }

    if (field === "stop" && index !== undefined) {
      const updatedStops = [...stops];
      updatedStops[index] = { name: address, lat, long: lng };
      setStops(updatedStops);
      setUpdatedStops(updatedStops);
    }

    if (field === "return_pickup") {
      setReturnPickupLatLng({ lat: Number(lat), lng: Number(lng) });
      setReturnPickupAddress(address);
      form.setFieldValue("return_pickup_address", address);
    }

    if (field === "return_destination") {
      setReturnDropLatLng({ lat: Number(lat), lng: Number(lng) });
      setReturnDropAddress(address);
      form.setFieldValue("return_drop_address", address);
    }

    if (field === "return_stop" && index !== undefined) {
      const updated = [...returnStops];
      updated[index] = { name: address, lat, long: lng };
      setReturnStops(updated);
      setUpdatedReturnStops(updated);
    }
  };


  const handleDateChange = (date: any) => {
    if (date && form.getFieldValue("time")) {
      form.setFieldValue("time", undefined);
    }

    // The return leg can't start before the outbound leg — if the outbound
    // date moved past the already-selected return date, clear it so the
    // user has to re-pick a valid one.
    const returnDate = form.getFieldValue("return_date");
    if (date && returnDate && dayjs(returnDate).isBefore(dayjs(date), "day")) {
      form.setFieldsValue({ return_date: null, return_time: null, return_scheduled_date: null });
      Toast.warning("Return date has been reset because it was before the new pickup date.");
    }
  };

  const [distance, setDistance] = useState<any>()
  const calculateTotalDistance = async (center: { lat: number; lng: number }, pickup: { lat: number; lng: number } | null) => {
    if (!pickup) return 0;
    if (typeof google === "undefined" || !google.maps) return 0;

    const service = new google.maps.DistanceMatrixService();
    try {
      const origin = new google.maps.LatLng(center.lat, center.lng);
      const destination = new google.maps.LatLng(pickup.lat, pickup.lng);

      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (response.rows[0]?.elements[0]?.distance) {
        const dist = response.rows[0].elements[0].distance.value / 1000;
        setDistance(dist)
      }

      return 0;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  };


  useEffect(() => {
    if (center && pickupLatLng) {
      loadGoogleMapScript(() => calculateTotalDistance(center, pickupLatLng));
    }
  }, [center, pickupLatLng])


  const handleTimeChange = (time: any) => {
    if (time && form.getFieldValue("date")) {

      const date = form.getFieldValue("date");

      const combinedDate = dayjs(date).set("hour", dayjs(time)?.hour()).set("minute", dayjs(time)?.minute());

      const currentTime = dayjs();

      if (dayjs(date).isSame(currentTime, 'day')) {
        const diffInMinutes = currentTime.diff(time, 'minute');
        if (combinedDate.isBefore(currentTime)) {
          form.setFieldValue("time", null);
          return Toast.warning("Selected time cannot be in the past for the current date.");
        }

        let bookingTime: any

        if (distance == null) {
          bookingTime = 30
        }
        if (distance < 10) {
          bookingTime = 0
        }
        if (distance < 20 && distance > 10) {
          bookingTime = 30
        }
        if (distance < 40 && distance > 20) {
          bookingTime = 60

        }
        if (distance < 60 && distance > 40) {
          bookingTime = 120
        }
        if (distance > 60) {
          bookingTime = 120
        }

        if (Math.abs(diffInMinutes) < bookingTime) {
          form.setFieldValue("time", null);
          return Toast.warning(`Please select a time at least ${bookingTime} minutes from the current time.`);
        }
      }

      setPrimaryDate(combinedDate.valueOf());

      // If a return time is already set for the same calendar day as the
      // outbound trip, and it's no longer after the (possibly changed)
      // outbound time, clear it so the return leg can't end up before pickup.
      const returnDate = form.getFieldValue("return_date");
      const returnTime = form.getFieldValue("return_time");
      if (returnDate && returnTime && dayjs(returnDate).isSame(date, "day")) {
        if (!dayjs(returnTime).isAfter(time)) {
          form.setFieldsValue({ return_time: null, return_scheduled_date: null });
          Toast.warning("Return time has been reset because it was no longer after the pickup time.");
        }
      }
    }
  };

  const disabledReturnDate = (current: any) => {
    if (disabledPreviousDate(current)) return true;
    const date = form.getFieldValue("date");
    return !!(date && current && current.isBefore(dayjs(date), "day"));
  };

  const getDisabledReturnTime = () => {
    const date = form.getFieldValue("date");
    const time = form.getFieldValue("time");
    const returnDate = form.getFieldValue("return_date");
    if (!date || !time || !returnDate || !dayjs(returnDate).isSame(date, "day")) {
      return {};
    }
    const outboundHour = dayjs(time).hour();
    const outboundMinute = dayjs(time).minute();
    return {
      disabledHours: () => Array.from({ length: outboundHour }, (_, i) => i),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === outboundHour
          ? Array.from({ length: outboundMinute + 1 }, (_, i) => i)
          : [],
    };
  };

  const handleReturnDateChange = (date: any) => {
    if (date && form.getFieldValue("return_time")) {
      form.setFieldValue("return_time", undefined);
    }
  };

  const handleReturnTimeChange = (time: any) => {
    const date = form.getFieldValue("return_date");
    if (time && date) {
      const outboundDate = form.getFieldValue("date");
      const outboundTime = form.getFieldValue("time");

      if (outboundDate && outboundTime && dayjs(date).isSame(outboundDate, "day") && !dayjs(time).isAfter(outboundTime)) {
        form.setFieldValue("return_time", null);
        return Toast.warning("Return time must be after the pickup time on the same day.");
      }

      const combinedDate = dayjs(date).set("hour", dayjs(time)?.hour()).set("minute", dayjs(time)?.minute());
      form.setFieldValue("return_scheduled_date", combinedDate.valueOf());
    }
  };



  useEffect(() => {
    const validStops = stops.every(
      (stop) => stop.name && stop.lat && stop.long
    );

    setBookingFormData({
      pickupLatLng,
      dropLatLng,
      ...(validStops ? { stops: updatedStops } : {}),
      is_return_trip: isReturnTrip,
      return_pickup_lat: returnPickupLatLng?.lat,
      return_pickup_long: returnPickupLatLng?.lng,
      return_drop_lat: returnDropLatLng?.lat,
      return_drop_long: returnDropLatLng?.lng,
      return_stops: updatedReturnStops,
    });
  }, [pickupLatLng, dropLatLng, updatedStops, isReturnTrip, returnPickupLatLng, returnDropLatLng, updatedReturnStops]);

  // First time Return Trip is checked, default the return leg to the reverse
  // of the main trip (drop → pickup) so the user isn't starting from blank.
  useEffect(() => {
    if (isReturnTrip && pickupLatLng && dropLatLng && !isReturnAutoFilled) {
      setReturnPickupAddress(dropAddress);
      setReturnDropAddress(form.getFieldValue("pickup_address"));
      setReturnPickupLatLng(dropLatLng);
      setReturnDropLatLng(pickupLatLng);
      form.setFieldsValue({
        return_pickup_address: dropAddress,
        return_drop_address: form.getFieldValue("pickup_address"),
      });
      setIsReturnAutoFilled(true);
    }
  }, [isReturnTrip]);

  // Swap pickup <-> drop-off, including lat/lng state and airport detection —
  // a swap can turn the drop-off into the airport leg, which the (pickup-only)
  // airport-detection above wouldn't otherwise catch.
  const handleSwapLocations = () => {
    const currentPickupAddress = form.getFieldValue("pickup_address");
    const currentDropAddress = form.getFieldValue("drop_address");

    form.setFieldsValue({
      pickup_address: currentDropAddress,
      drop_address: currentPickupAddress,
    });

    const newPickupLatLng = dropLatLng;
    const newDropLatLng = pickupLatLng;
    setPickupLatLng(newPickupLatLng);
    setDropLatLng(newDropLatLng);
    setDropAddress(currentPickupAddress || "");

    const airportNow = /airport/i.test(currentDropAddress || "");
    setShowFields(airportNow);
    if (!airportNow) setIsAirport(false);
    form.setFieldValue("time", null);
  };

  return (
    <>
      <div className="mb-3 address-section">
        <div className="flex flex-wrap items-start gap-6 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Journey Type</label>
            <Radio.Group
              value={isReturnTrip ? "return_trip" : "one_way"}
              onChange={(e) => setIsReturnTrip(e.target.value === "return_trip")}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="one_way">One Way</Radio.Button>
              <Radio.Button value="return_trip">Return</Radio.Button>
            </Radio.Group>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Booking Type</label>
            <Form.Item name="booking_transfer_type" initialValue="general_transfer" className="mb-0">
              <Radio.Group optionType="button" buttonStyle="solid">
                <Radio.Button value="general_transfer">General Transfer</Radio.Button>
                <Radio.Button value="airport_transfer">Airport Transfer</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>

        {isAirportTransfer && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">Transfer Point</label>
            <Form.Item
              name="transfer_point"
              className="mb-0"
              rules={[{ required: true, message: "Please select a transfer point" }]}
            >
              <Radio.Group>
                <Radio value="pickup">Airport Pickup</Radio>
                <Radio value="drop">Airport Drop-off</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        )}

        {isAirportPickup && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">Select Airport</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                <PinIcon />
              </span>
              <Form.Item
                name="airport_pickup_type"
                className="w-100 mb-0 flex-1"
                noStyle
                rules={[{ required: true, message: "Please select an airport" }]}
              >
                <Select
                  size="large"
                  variant="borderless"
                  className="w-100 !h-[42px] !p-0 [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!items-center [&_.ant-select-selection-item]:!h-[42px] [&_.ant-select-selection-item]:!leading-[42px] [&_.ant-select-selection-placeholder]:!h-[42px] [&_.ant-select-selection-placeholder]:!leading-[42px] [&_.ant-select-selection-search-input]:!h-[42px] [&_.ant-select-selection-search-input]:!leading-[42px]"
                  placeholder={airportOptionsLoading ? "Loading airports..." : "Select Airport"}
                  allowClear
                  loading={airportOptionsLoading}
                  disabled={airportOptionsLoading}
                  onChange={onSelectAirport}
                  options={airportOptions.map(({ value, label }) => ({ value, label }))}
                />
              </Form.Item>
            </div>
            <FormFieldError form={form} name="airport_pickup_type" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Pickup Location</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                <RadioIcon />
              </span>
              <Form.Item
                name="pickup_address"
                className="w-100 mb-0 flex-1"
                noStyle
                rules={[
                  { required: true, message: "Please enter pickup location" },
                ]}
              >
                <AddressAutocomplete
                  bordered={false}
                  className="!p-0"
                  biasField="pickup"
                  placeholder="Enter pickup location"
                  onResolve={(result) => handleAddressResolve("pickup", result)}
                />
              </Form.Item>
            </div>
            <FormFieldError form={form} name="pickup_address" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Drop-off Location</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                {stops.length === 0 ? <PinIcon /> : <DestinationSquareIcon />}
              </span>

              <Form.Item
                name="drop_address"
                className="w-100 mb-0 flex-1"
                noStyle
                rules={[{ required: true, message: "Please enter destination" }]}
              >
                <AddressAutocomplete
                  bordered={false}
                  className="!p-0"
                  value={dropAddress}
                  placeholder="Enter your destination"
                  onChange={(text) => setDropAddress(text)}
                  onResolve={(result) => handleAddressResolve("destination", result)}
                />
              </Form.Item>
            </div>
            <FormFieldError form={form} name="drop_address" />
          </div>

          <button
            type="button"
            aria-label="Swap pickup and drop-off"
            onClick={handleSwapLocations}
            className="hidden md:flex absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow items-center justify-center z-10 hover:bg-slate-50"
          >
            <SwapIcon />
          </button>
        </div>

        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] flex-1 transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                <RadioIcon />
              </span>
              <Form.Item
                className="flex-1 mb-0"
                required
                rules={[
                  { required: true, message: "Please enter a stop location" },
                ]}
              >
                <AddressAutocomplete
                  bordered={false}
                  className="!p-0"
                  value={stop.name}
                  placeholder="Enter stop location"
                  onChange={(text) => {
                    const updatedStops = [...stops];
                    updatedStops[index].name = text;
                    setStops(updatedStops);
                  }}
                  onResolve={(result) => handleAddressResolve("stop", result, index)}
                />
              </Form.Item>
            </div>
            <span
              className="cursor-pointer p-0 flex-shrink-0"
              onClick={() => handleRemoveStop(index)}
            >
              <CrossIconWithBorder />
            </span>
          </div>
        ))}

        <button
          type="button"
          className="mt-3 flex items-center gap-2 text-sm text-[#0d1b2e] font-medium hover:opacity-80"
          onClick={() => handleAddStop()}
        >
          <PlusIconWithBorder /> {stops.length === 0 ? "Add a stop" : "Add another stop"}
        </button>
      </div>

      {/* Booking is always "Exact Time" now — no user-facing choice, just a fixed value */}
      <Form.Item name="booking_type" initialValue="schedule" hidden>
        <Input type="hidden" />
      </Form.Item>

      <div className="mb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                <CalenderIcon />
              </span>

              <Form.Item
                name="scheduled_date"
                className="w-100 hidden"
              >
                <Input type="hidden" />
              </Form.Item>

              <Form.Item name="arrival_date" hidden>
                <Input type="hidden" />
              </Form.Item>

              <Form.Item
                name="date"
                className="w-100 mb-0 flex-1"
                noStyle
                rules={[{ required: true, message: "Enter date" }]}
              >
                <DatePicker
                  size="large"
                  inputReadOnly
                  allowClear={false}
                  variant="borderless"
                  format="DD MMM YYYY"
                  className="w-100 !p-0"
                  onChange={handleDateChange}
                  placeholder="Select date"
                  suffixIcon=""
                  disabledDate={disabledPreviousDate}
                />
              </Form.Item>
            </div>
            <FormFieldError form={form} name="date" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
              <span className="flex-shrink-0 flex items-center">
                <ClockIcon />
              </span>
              <Form.Item
                name="time"
                className="w-100 mb-0 flex-1"
                noStyle
                rules={[{ required: true, message: "Enter time" }]}
              >
                <TimePicker
                  size="large"
                  format="hh:mm A"
                  use12Hours={true}
                  inputReadOnly
                  variant="borderless"
                  className="w-100 !p-0"
                  onChange={handleTimeChange}
                  placeholder="Select time"
                  suffixIcon=""
                />
              </Form.Item>
            </div>
            <FormFieldError form={form} name="time" />
          </div>
        </div>
      </div>

      {isReturnTrip && (
        <div className="mb-3 border rounded-xl bg-slate-50 p-4 mt-3">
          <h3 className="fw-semibold mb-3 text-[#0d1b2e]">Return Trip Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Pickup Location</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] bg-white transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <span className="flex-shrink-0 flex items-center">
                  <RadioIcon />
                </span>
                <Form.Item
                  name="return_pickup_address"
                  className="w-100 mb-0 flex-1"
                  noStyle
                  rules={[{ required: true, message: "Please enter return pickup location" }]}
                >
                  <AddressAutocomplete
                    bordered={false}
                    className="!p-0"
                    value={returnPickupAddress}
                    placeholder="Enter pickup location"
                    onChange={(text) => setReturnPickupAddress(text)}
                    onResolve={(result) => handleAddressResolve("return_pickup", result)}
                  />
                </Form.Item>
              </div>
              <FormFieldError form={form} name="return_pickup_address" />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Drop-off Location</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] bg-white transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <span className="flex-shrink-0 flex items-center">
                  {returnStops.length === 0 ? <PinIcon /> : <DestinationSquareIcon />}
                </span>

                <Form.Item
                  name="return_drop_address"
                  className="w-100 mb-0 flex-1"
                  noStyle
                  rules={[{ required: true, message: "Please enter return destination" }]}
                >
                  <AddressAutocomplete
                    bordered={false}
                    className="!p-0"
                    value={returnDropAddress}
                    placeholder="Enter your destination"
                    onChange={(text) => setReturnDropAddress(text)}
                    onResolve={(result) => handleAddressResolve("return_destination", result)}
                  />
                </Form.Item>
              </div>
              <FormFieldError form={form} name="return_drop_address" />
            </div>
          </div>

          {returnStops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] bg-white flex-1 transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <span className="flex-shrink-0 flex items-center">
                  <RadioIcon />
                </span>
                <Form.Item
                  className="flex-1 mb-0"
                  required
                  rules={[{ required: true, message: "Please enter a stop location" }]}
                >
                  <AddressAutocomplete
                    bordered={false}
                    className="!p-0"
                    value={stop.name}
                    placeholder="Enter stop location"
                    onChange={(text) => {
                      const updated = [...returnStops];
                      updated[index].name = text;
                      setReturnStops(updated);
                    }}
                    onResolve={(result) => handleAddressResolve("return_stop", result, index)}
                  />
                </Form.Item>
              </div>
              <span
                className="cursor-pointer p-0 flex-shrink-0"
                onClick={() => handleRemoveReturnStop(index)}
              >
                <CrossIconWithBorder />
              </span>
            </div>
          ))}

          <button
            type="button"
            className="mt-3 flex items-center gap-2 text-sm text-[#0d1b2e] font-medium hover:opacity-80"
            onClick={() => handleAddReturnStop()}
          >
            <PlusIconWithBorder /> {returnStops.length === 0 ? "Add a stop" : "Add another stop"}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] bg-white transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <span className="flex-shrink-0 flex items-center">
                  <CalenderIcon />
                </span>

                <Form.Item name="return_scheduled_date" className="w-100 hidden">
                  <Input type="hidden" />
                </Form.Item>

                <Form.Item
                  name="return_date"
                  className="w-100 mb-0 flex-1"
                  noStyle
                  rules={[{ required: true, message: "Enter return date" }]}
                >
                  <DatePicker
                    size="large"
                    inputReadOnly
                    allowClear={false}
                    variant="borderless"
                    format="DD MMM YYYY"
                    className="w-100 !p-0"
                    onChange={handleReturnDateChange}
                    placeholder="Select date"
                    suffixIcon=""
                    disabledDate={disabledReturnDate}
                  />
                </Form.Item>
              </div>
              <FormFieldError form={form} name="return_date" />
            </div>

            <div>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 h-[44px] bg-white transition-colors focus-within:border-[#0d1b2e] focus-within:ring-2 focus-within:ring-[#0d1b2e]/10">
                <span className="flex-shrink-0 flex items-center">
                  <ClockIcon />
                </span>
                <Form.Item
                  name="return_time"
                  className="w-100 mb-0 flex-1"
                  noStyle
                  rules={[{ required: true, message: "Enter return time" }]}
                >
                  <TimePicker
                    size="large"
                    format="hh:mm A"
                    use12Hours={true}
                    inputReadOnly
                    variant="borderless"
                    className="w-100 !p-0"
                    onChange={handleReturnTimeChange}
                    disabledTime={getDisabledReturnTime}
                    placeholder="Select time"
                    suffixIcon=""
                  />
                </Form.Item>
              </div>
              <FormFieldError form={form} name="return_time" />
            </div>
          </div>
        </div>
      )}

      <Modal onOk={onSelectmodalAddress} onCancel={() => setIsAirport(false)} title={<h2 className="fw-medium  mb-3 text-center">Pickup Points</h2>} centered open={isAirport}>
        <div className="mb-4 "
        >
          <RadioGroup onChange={(value) => setSelectedAddress(value.target.value)} className="">
            {
              country == "in" ? <>
                <Radio className="mb-3 text-black" value="mohali_international_airport"><span>Mohali International Airport - Pickup from Rideshare Area</span></Radio>
              </> : <>
                <Radio className="mb-3 text-black" value="Sydney_international_airport"><span>Rideshare Area (Near P7 Buildings) Sydney International Airport</span></Radio>
                <Radio className="text-black" value="sydney_domestic_airport"><span>Green Priority Pickup Area (T2, T3), Sydney Domestic Airport.</span></Radio>
              </>
            }
          </RadioGroup>
        </div>
      </Modal>

      <div className="mb-0">
        <Form.Item
          hidden
          name="vehicle_id"
          rules={[
            { required: true, message: "Please select vehicle category" },
          ]}
        >
          <Select size="large" placeholder="Vehicle Category">
            {vehicleOptions.map((vehicle) => (
              <Option key={vehicle.vehicle_type} value={vehicle._id}>
                {vehicle.vehicle_type}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </>
  );
};

export default Step1JourneyDetails;
