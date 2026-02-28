import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "../pages/checkout.css";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/axiosConfig";
import { clearCart } from "../features/cartSlice";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51SuQ6m1xI4EbtGhh6IfMP0LttyBhTELwTLfWVtda8Psr7tSKETgJUMkQyaWXCgKbooNmfArepp4oJiJxgab5bCx5000QJrFXeo"
);

function CheckoutForm({ items, total, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // 1️⃣ Create payment intent first (get client secret)
      const paymentIntentRes = await api.post(
        "/payment/create-payment-intent",
        {
          amount: total * 100, // paise
        }
      );

      const clientSecret = paymentIntentRes.data.clientSecret;

      // 2️⃣ Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.username || "Customer",
            email: user.email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        setSucceeded(true);

        // 3️⃣ Payment success! Now create order in backend
        const orderItems = items.map((item) => ({
          productId: item.id || item.product?.id,
          quantity: item.quantity || 1,
          price: item.price || item.product?.price || 0,
        }));

        await api.post("/orders/create", {
          userId: user.id,
          totalPrice: total,
          items: orderItems,
        });

        // 4️⃣ Clear cart (DB + Redux)
        await api.delete(`/cart/clear/${user.id}`);
        dispatch(clearCart());

        // Slight delay to show success message
        setTimeout(() => {
          navigate("/my-orders", { replace: true });
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
      setSucceeded(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-form">
      <CardElement options={{
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      }} />
      {error && <div className="error-message" style={{ color: "red", marginTop: "10px" }}>⚠️ {error}</div>}
      {succeeded && <div className="success-message" style={{ color: "green", marginTop: "10px" }}>✅ Payment Successful! Redirecting...</div>}

      <button
        onClick={handlePayment}
        disabled={processing || !stripe || succeeded}
        className="btn-pay"
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
          background: succeeded ? "#198754" : "#0d6efd",
          color: "white",
          fontWeight: "bold",
          borderRadius: "6px",
          cursor: processing || succeeded ? "default" : "pointer",
          opacity: processing ? 0.7 : 1
        }}
      >
        {processing ? "⏳ Processing..." : succeeded ? "✅ Paid" : `Pay ₹${total}`}
      </button>
    </div>
  );
}

export default function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const { user } = useSelector((state) => state.auth);

  if (!items.length) return <p>No items to checkout</p>;
  if (!user) return <p>Please login to checkout</p>;

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      {items.map((item, i) => (
        <div key={i}>
          {item.title || item.product?.title} × {item.quantity} = ₹
          {(item.price || item.product?.price) * item.quantity}
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <Elements stripe={stripePromise}>
        <CheckoutForm items={items} total={total} user={user} />
      </Elements>
    </div>
  );
}
