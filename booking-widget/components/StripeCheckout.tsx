"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/booking-widget/components/StripeCheckOutForm";
import { STRIPE_ACCESS_KEY } from "@/booking-widget/utils/api";

const stripePromise = loadStripe(STRIPE_ACCESS_KEY as string);

const StripeElement = (props: any) => {
  const clientSecret = props.clientSecret;
  const amount = props.amount;

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm {...props} amount={amount} />
        </Elements>
      )}
    </>
  );
};

export default StripeElement;
