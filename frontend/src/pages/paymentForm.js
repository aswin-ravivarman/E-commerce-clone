import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(
      elements.getElement(CardElement)
    );

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment Successful 🎉");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          background: "green",
          color: "white",
        }}
      >
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm;
