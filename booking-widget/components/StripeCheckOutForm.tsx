"use client";

import { useBookingContext } from "@/booking-widget/context/Provider";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button, Modal } from "antd";
import { useEffect, useState } from "react";

const CheckoutForm = ({ amount, onPaymentSuccess, isModalOpen, onClose, onCancel }: any) => {
  const { Toast } = useBookingContext();
  const stripe = useStripe();
  const elements = useElements();
  const [, setMessage] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setStripeLoading(true);

      if (!stripe || !elements) {
        return;
      }

      const { error, paymentIntent }: any = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Payment methods that require an off-page step (3D Secure, etc.)
          // bounce the browser back here after confirmation — send them to the
          // thank-you page instead of back to the booking widget's own URL,
          // which just left the raw payment_intent query params sitting unused.
          return_url: `${window.location.origin}/thank-you`,
        },
      });

      if (error) {
        Toast.error(error?.message);
      } else if (paymentIntent?.status === "succeeded") {
        onPaymentSuccess();
      }
    } catch (error1: any) {
      setStripeLoading(false);
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  return (
    <Modal
      title="Payment"
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      closable={false}
      closeIcon={<></>}
      centered
    >
      <form onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <Button
          style={{
            marginTop: 15,
            color: "black",
            fontWeight: 500,
            height: 55,
          }}
          loading={stripeLoading}
          type="primary"
          htmlType="submit"
          block
          disabled={!stripe || !elements}
        >
          Pay ${Number(amount || 0)?.toFixed(2)}
        </Button>
        <Button
          onClick={() => onCancel()}
          style={{
            marginTop: 15,
            color: "black",
            fontWeight: 500,
            height: 55,
          }}
          type="default"
          block
        >
          Cancel
        </Button>
      </form>
    </Modal>
  );
};

export default CheckoutForm;
