import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data; // can be { token, user } or plain user
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Login failed" }
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/signup", payload);
      return res.data; // can be { token, user } or plain user
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Signup failed" }
      );
    }
  }
);

const persistedToken = localStorage.getItem("token");
const persistedUser = safeJsonParse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: persistedUser,
    token: persistedToken,
    isAuthenticated: Boolean(persistedToken || persistedUser),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const token = payload?.token ?? null;
        const user = payload?.user ?? payload;

        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(token || user);

        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action?.payload?.message || 
                            action?.error?.message || 
                            (action?.error?.response?.data?.message) ||
                            "Login failed. Please check credentials.";
        state.error = errorMessage;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const token = payload?.token ?? null;
        const user = payload?.user ?? payload;

        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(token || user);

        if (token) localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action?.payload?.message || 
                            action?.error?.message || 
                            (action?.error?.response?.data?.message) ||
                            "Signup failed. Please try again.";
        state.error = errorMessage;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
