import api from "./api";

// LOGIN
export const login = (loginData) => {
  return api.post("/auth/login", loginData);
};

// SIGN UP
export const signup = (signupData) => {
  return api.post("/auth/signup", signupData);
};
