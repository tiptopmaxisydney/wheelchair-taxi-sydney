"use client";

import { loadStripe } from "@stripe/stripe-js/pure";
import type { Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/booking-widget/components/StripeCheckOutForm";
import { STRIPE_ACCESS_KEY } from "@/booking-widget/utils/api";

// Load Stripe.js only when a payment form is actually shown (the "pure" import
// does not inject the script on page load). A blocked/failed load resolves to
// null instead of an unhandled rejection, and the next attempt retries.
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_ACCESS_KEY as string).catch((err) => {
      console.warn("Stripe.js failed to load", err);
      stripePromise = null;
      return null;
    });
  }
  return stripePromise;
};

const StripeElement = (props: any) => {
  const clientSecret = props.clientSecret;
  const amount = props.amount;

  return (
    <>
      {clientSecret && (
        <Elements key={clientSecret} stripe={getStripe()} options={{ clientSecret }}>
          <CheckoutForm {...props} amount={amount} />
        </Elements>
      )}
    </>
  );
};

export default StripeElement;
