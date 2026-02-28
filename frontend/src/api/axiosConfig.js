import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  // When using CRA `proxy`, relative URLs are forwarded to backend
  "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u?.email) config.headers["X-User-Email"] = u.email;
  } catch (_) {}
  return config;
});

export default api;
