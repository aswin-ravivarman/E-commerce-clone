import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

/**
 * Axios instance for backend API
 * Base URL → Spring Boot backend
 */
const api = axios.create({
  baseURL: API_BASE_URL, // http://localhost:8080/api
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach simple user identity (email) to every request.
 * Backend uses this header to link carts/orders to the logged-in user.
 */
api.interceptors.request.use(
  (config) => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      const email = u?.email;
      if (email) config.headers["X-User-Email"] = email;
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Global response error handling (optional but recommended)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
