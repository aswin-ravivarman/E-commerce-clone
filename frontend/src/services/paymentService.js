import api from "./api";
import "./Auth.css";

/**
 * Create a payment intent for Stripe
 * @param {number} amount - Amount in INR (rupees)
 * @returns {Promise<{clientSecret: string}>}
 */
export const createPaymentIntent = async (amount) => {
  const response = await api.post("/payment/create-intent", { amount });
  const data = response?.data;
  // Backend returns { clientSecret } or { error }
  if (data && typeof data === "object" && data.error) {
    return { error: data.error };
  }
  return data || {};
};