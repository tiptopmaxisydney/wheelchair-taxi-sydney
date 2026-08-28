"use client";

// Port of tiptopnextjs's src/components/booking-form.tsx — same wizard, same fields,
// same live-pricing calls, same Stripe payment flow. See booking-widget's other files
// for the rest of the port; deviations from the source are documented per-file.
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import BookingWizard from "@/booking-widget/components/BookingWizard";
import { Form, message, Spin, Modal } from "antd";
import henceforthApi, { country, DomesticAirportAddress, InternationalAirportAddress, MohaliAirportAddress } from "@/booking-widget/utils/api";
import {
  IVehicleDetails,
  IVehicleTypeOptions,
} from "@/booking-widget/interfaces/createBooking";
import { Stop } from "@/booking-widget/components/Step1JourneyDetails";
import StripeElement from "@/booking-widget/components/StripeCheckout";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { getAttribution, getCurrentPage } from "@/booking-widget/utils/attribution";

interface BookingFormProps {
  pickupLatLng: {
    lat: number;
    lng: number;
  };
  dropLatLng: {
    lat: number;
    lng: number;
  };
  stops?: Stop[];
  is_return_trip?: boolean;
  return_pickup_lat?: number;
  return_pickup_long?: number;
  return_drop_lat?: number;
  return_drop_long?: number;
  return_stops?: Stop[];
}

interface MoreDetailsProps {
  name: string;
  phone: string;
  email: string;
  country_code: string;
  passenger: number;
  luggage: number;
  handbags: number;
  filter?: string[];
  child_seat?: number;
  wheel_chair?: number
}

export default function TiptopBookingForm() {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const watchForm = Form.useWatch([], form);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [vehicleTypes, setVehiclesTypes] = useState<IVehicleTypeOptions[]>([]);
  const [vehicleDetails, setVehicleDetails] = useState<IVehicleDetails[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0)
  const [moreDetailsData, setMoreDetailsData] = useState<
    MoreDetailsProps | undefined
  >();
  const [bookingFormData, setBookingFormData] = useState<
    BookingFormProps | undefined
  >();
  const [loadingPrices, setLoadingPrices] = useState<boolean>(false);
  const [isScheduledOpen, setIsScheduledOpen] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  // Autofill phone + passenger from URL query params into MoreDetailsDrawer
  useEffect(() => {
    const phone = searchParams.get("phone");
    const passengers = searchParams.get("passengers");
    if (!phone && !passengers) return;
    const passengerNum = passengers ? parseInt(String(passengers)) || 1 : undefined;
    setMoreDetailsData((prev: any) => ({
      ...prev,
      ...(phone ? { phone: String(phone).replace(/\s+/g, "") } : {}),
      ...(passengerNum ? { passenger: passengerNum } : {}),
    }));
  }, [searchParams]);

  const handleSubmit = async (values: any) => {
    const isBookingFormValid =
      bookingFormData?.pickupLatLng?.lat &&
      bookingFormData?.pickupLatLng?.lng &&
      bookingFormData?.dropLatLng?.lat &&
      bookingFormData?.dropLatLng?.lng;

    const isMoreDetailsDataValid =
      moreDetailsData &&
      Object.values(moreDetailsData).every(
        (value) => value !== null && value !== undefined
      );

    if (!isBookingFormValid || !isMoreDetailsDataValid) {
      message.error("Please fill in all required fields before submitting.");
      return;
    }

    // Captured before the deletes below strip the raw date/time fields off
    // `values` — this is what gets shown on the /thank-you page, since that
    // page is reached after a full-page Stripe redirect and can't rely on
    // this component's in-memory state anymore.
    const selectedVehicle = vehicleDetails.find(
      (vehicle) => vehicle.vehicle_id === values.vehicle_id
    );
    const bookingSummary = {
      pickup_address: values?.pickup_address,
      drop_address: values?.drop_address,
      date: values?.date ? dayjs(values.date).format("DD MMM YYYY") : undefined,
      time: values?.time ? dayjs(values.time).format("hh:mm A") : undefined,
      is_return_trip: !!bookingFormData?.is_return_trip,
      return_pickup_address: values?.return_pickup_address,
      return_drop_address: values?.return_drop_address,
      return_date: values?.return_date ? dayjs(values.return_date).format("DD MMM YYYY") : undefined,
      return_time: values?.return_time ? dayjs(values.return_time).format("hh:mm A") : undefined,
      vehicle_name: selectedVehicle?.vehicle_name || "",
      passenger: moreDetailsData?.passenger,
      name: moreDetailsData?.name,
      email: moreDetailsData?.email,
    };

    delete values.date;
    delete values.time;
    delete values.return_date;
    delete values.return_time;

    try {
      setLoadingSubmit(true);

      // Same stops the quote request sends to `booking/web/vehicle/pricing` —
      // omitting these here made the actual Stripe charge (computed without
      // the stop detour's extra distance/toll) come out lower than the total
      // shown to the customer.
      const stopsList = bookingFormData?.stops ?? [];
      const validStops =
        stopsList.length > 0 &&
        stopsList.every((stop: any) => stop.name && stop.lat && stop.long);

      const attribution = getAttribution();
      const payload = {
        ...values,
        ...moreDetailsData,
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
        child_seat: moreDetailsData?.child_seat,
        wheel_chair: moreDetailsData?.wheel_chair,
        passenger: moreDetailsData?.passenger || 1,
        pick_up_lat: String(bookingFormData?.pickupLatLng?.lat),
        pick_up_long: String(bookingFormData?.pickupLatLng?.lng),
        drop_lat: bookingFormData?.dropLatLng?.lat,
        drop_long: bookingFormData?.dropLatLng?.lng,
        booking_type: values?.booking_type,
        flight_number: values?.flight_number,
        flight_arrival_time: values?.flight_arrival_time
          ? dayjs(values.flight_arrival_time).valueOf()
          : undefined,
        payment_method: "card",
        vehicle_name:
          vehicleDetails.find(
            (vehicle) => vehicle.vehicle_id === values.vehicle_id
          )?.vehicle_name || "",
        ...(validStops
          ? {
              stops: stopsList.map((stop: any) => ({
                name: stop.name,
                lat: stop.lat,
                long: stop.long,
              })),
            }
          : {}),
        ...(bookingFormData?.is_return_trip
          ? {
              is_return_trip: true,
              return_pickup_lat: String(bookingFormData?.return_pickup_lat),
              return_pickup_long: String(bookingFormData?.return_pickup_long),
              return_drop_lat: String(bookingFormData?.return_drop_lat),
              return_drop_long: String(bookingFormData?.return_drop_long),
              return_stops: bookingFormData?.return_stops,
            }
          : {}),
      };

      if (country == "in") {
        if (((bookingFormData?.pickupLatLng?.lat === MohaliAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === MohaliAirportAddress.lng))) {
          payload.include_airport_toll = true
        }
      } else {
        if (((bookingFormData?.pickupLatLng?.lat === InternationalAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === InternationalAirportAddress.lng)) || ((bookingFormData?.pickupLatLng?.lat === DomesticAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === DomesticAirportAddress.lng))) {
          payload.include_airport_toll = true
        }
      }
      const result = await henceforthApi.createBooking.book(payload);
      const clientSecret = result?.client_secret;
      const amount = result?.amount;

      if (clientSecret) {
        // Stored (rather than passed via component state) because redirect-based
        // payment methods (e.g. 3D Secure) bounce the browser through a full page
        // navigation back to /thank-you — this component unmounts, so sessionStorage
        // is what lets the thank-you page still show the booking details.
        try {
          sessionStorage.setItem(
            "tiptop_last_booking",
            JSON.stringify({
              ...bookingSummary,
              booking_id: result?.booking_id,
              amount,
            })
          );
        } catch {
          // ignore — sessionStorage unavailable (private mode, etc.); thank-you
          // page just falls back to its generic message
        }

        setClientSecret(clientSecret);
        setAmount(amount);
        setIsPaymentModalOpen(true);
      }

      setLoadingSubmit(false);
    } catch (error) {
      console.error(error);
      setLoadingSubmit(false);
      message.error("Error while creating the booking.");
    }
  };

  const fetchVehicleCategories = async () => {
    try {
      const response =
        await henceforthApi.createBooking.getVehiclesTypesListing();
      setVehiclesTypes(response.data);
    } catch (error) {
      console.error(error);
      message.error("Error fetching vehicle categories");
    }
  };

  const fetchVehiclesPricing = useCallback(
    async (payload?: any) => {
      try {
        const response = await henceforthApi.createBooking.getVehiclesPricing(
          payload
        );
        setVehicleDetails(response.data);
        setLoadingPrices(false);
      } catch (error) {
        console.error(error);
        message.error("Error fetching vehicle pricing");
        setLoadingPrices(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchVehicleCategories();
    fetchVehiclesPricing();
  }, []);

  useEffect(() => {
    if (bookingFormData?.pickupLatLng && bookingFormData?.dropLatLng) {
      let payload: any = {
        pick_up_lat: bookingFormData.pickupLatLng.lat,
        pick_up_long: bookingFormData.pickupLatLng.lng,
        drop_lat: bookingFormData.dropLatLng.lat,
        drop_long: bookingFormData.dropLatLng.lng,
      };

      if (bookingFormData.stops && Array.isArray(bookingFormData.stops)) {
        const validStops = bookingFormData.stops.every(
          (stop: any) => stop.name && stop.lat && stop.long
        );

        if (validStops) {
          payload.stops = bookingFormData.stops.map((stop) => ({
            name: stop.name,
            lat: stop.lat,
            long: stop.long,
          }));
        }
      }
      if (moreDetailsData?.filter && moreDetailsData?.filter.length !== 0) {
        payload.filter = moreDetailsData?.filter;
      }
      if (bookingFormData?.is_return_trip && bookingFormData?.return_pickup_lat && bookingFormData?.return_drop_lat) {
        payload.is_return_trip = true;
        payload.return_pickup_lat = bookingFormData.return_pickup_lat;
        payload.return_pickup_long = bookingFormData.return_pickup_long;
        payload.return_drop_lat = bookingFormData.return_drop_lat;
        payload.return_drop_long = bookingFormData.return_drop_long;
        if (bookingFormData.return_stops && Array.isArray(bookingFormData.return_stops)) {
          const validReturnStops = bookingFormData.return_stops.every(
            (stop: any) => stop.name && stop.lat && stop.long
          );
          if (validReturnStops) {
            payload.return_stops = bookingFormData.return_stops.map((stop) => ({
              name: stop.name,
              lat: stop.lat,
              long: stop.long,
            }));
          }
        }
      }
      if (bookingFormData?.pickupLatLng?.lat &&
        bookingFormData?.pickupLatLng?.lng &&
        bookingFormData?.dropLatLng?.lat &&
        bookingFormData?.dropLatLng?.lng && watchForm?.date && watchForm?.time) {
        setLoadingPrices(true);
      }
      if (watchForm?.date && watchForm?.time) {
        const combinedDate = dayjs(watchForm?.date).set("hour", dayjs(watchForm?.time)?.hour()).set("minute", dayjs(watchForm?.time)?.minute());
        payload.date_time = combinedDate?.valueOf()

      }
      if (country == "in") {
        if (((bookingFormData?.pickupLatLng?.lat === MohaliAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === MohaliAirportAddress.lng))) {
          payload.include_airport_toll = true
        }
      } else {
        if (((bookingFormData?.pickupLatLng?.lat === InternationalAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === InternationalAirportAddress.lng)) || ((bookingFormData?.pickupLatLng?.lat === DomesticAirportAddress.lat) && (bookingFormData?.pickupLatLng?.lng === DomesticAirportAddress.lng))) {
          payload.include_airport_toll = true
        }
      }
      fetchVehiclesPricing(payload);
    }
  }, [
    bookingFormData?.pickupLatLng?.lat,
    bookingFormData?.pickupLatLng?.lng,
    bookingFormData?.dropLatLng?.lat,
    bookingFormData?.dropLatLng?.lng,
    bookingFormData?.stops,
    bookingFormData?.is_return_trip,
    bookingFormData?.return_pickup_lat,
    bookingFormData?.return_pickup_long,
    bookingFormData?.return_drop_lat,
    bookingFormData?.return_drop_long,
    bookingFormData?.return_stops,
    moreDetailsData?.filter,
    watchForm?.date, watchForm?.time
  ]);

  const handleSetDetailsData = (v: any) => {
    setMoreDetailsData(v);
  };


  const handleOk = () => {
    setIsScheduledOpen(false);
    router.push("/");
  };

  const handleCancel = () => {
    setIsScheduledOpen(false);
  };

  const isPricingEnabled = useMemo(() => {
    return bookingFormData?.pickupLatLng && bookingFormData?.dropLatLng && watchForm?.date && watchForm?.time;
  }, [bookingFormData?.pickupLatLng, bookingFormData?.dropLatLng, watchForm?.date, watchForm?.time]);

  useEffect(() => {
    if (isPricingEnabled) {
      const timeout = setTimeout(() => {
        setShowPricing(true);
        setLoadingPrices(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isPricingEnabled]);

  const calculateTotalDistance = async (pickup: { lat: number; lng: number }, dropoff: { lat: number; lng: number }) => {
    const service = new google.maps.DistanceMatrixService();

    try {
      const origin = new google.maps.LatLng(pickup.lat, pickup.lng);
      const destination = new google.maps.LatLng(dropoff.lat, dropoff.lng);

      const response = await service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (response.rows[0]?.elements[0]?.distance) {
        return response.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
      }
      return 0;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  };

  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const calculateDistance = async () => {
      if (bookingFormData?.pickupLatLng && bookingFormData?.dropLatLng) {
        const dist = await calculateTotalDistance(bookingFormData.pickupLatLng, bookingFormData.dropLatLng);
        setDistance(dist);
      }
    };
    calculateDistance();
  }, [bookingFormData?.pickupLatLng, bookingFormData?.dropLatLng]);

  return (
    <Fragment>
      <Spin spinning={loadingSubmit}>
        <div id="top-booking-form">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="create-booking"
            initialValues={{ date: dayjs() }}
          >
            <BookingWizard
              form={form}
              form2={form2}
              vehicleOptions={vehicleTypes}
              vehicleDetails={vehicleDetails}
              setBookingFormData={setBookingFormData}
              loadingPrices={loadingPrices}
              showPricing={showPricing}
              loadingSubmit={loadingSubmit}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onSetDetailsData={handleSetDetailsData}
              onSubmit={() => form.submit()}
            />
            {distance ? <p className="mt-3 text-sm text-gray-500">The total distance is {distance?.toFixed(2)} km</p> : null}
          </Form>
        </div>
      </Spin>

      <Modal
        centered
        open={isScheduledOpen}
        footer={false}
        onCancel={handleCancel}
      >
        <h3 className="text-xl fw-semibold text-center mb-2">
          Your ride is scheduled
        </h3>
        <p className="text-gray-500 text-center">
          {" "}
          A driver will be assigned to you shortly. Stay tuned for updates.
        </p>
        <div className="flex justify-center">
          <Image
            style={{ width: 300, height: "auto" }}
            width={300}
            height={301}
            src="/images/booking/scheduleConfirm.gif"
            alt="done"
            unoptimized
          />
        </div>
      </Modal>

      {clientSecret && (
        <StripeElement
          clientSecret={clientSecret}
          amount={amount}
          isModalOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onCancel={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={() => router?.push("/thank-you/")}
        />

      )}

    </Fragment>
  );
}
