import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

// Async thunks for API calls
export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async ({ userId, productId, quantity = 1 }) => {
    const res = await api.post("/cart/add", { userId, productId, quantity });
    return res.data;
  }
);

export const updateCartQuantityAPI = createAsyncThunk(
  "cart/updateCartQuantityAPI",
  async ({ userId, productId, quantity }) => {
    const res = await api.put("/cart/update", { userId, productId, quantity });
    return res.data;
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCartAPI",
  async ({ userId, productId }) => {
    await api.delete(`/cart/remove/${userId}/${productId}`);
    return productId;
  }
);

export const fetchUserCart = createAsyncThunk(
  "cart/fetchUserCart",
  async (userId) => {
    const res = await api.get(`/cart/${userId}`);
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addToCart(state, action) {
      const item = state.items.find(i => i.id === action.payload.id);

      if (item) {
        item.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.total = state.items.reduce(
        (sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity,
        0
      );
    },

    updateQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) return;

      item.quantity = action.payload.quantity;

      if (item.quantity <= 0) {
        state.items = state.items.filter(i => i.id !== item.id);
      }

      state.total = state.items.reduce(
        (sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity,
        0
      );
    },

    setCartItems(state, action) {
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, i) => sum + (i.price || i.product?.price || 0) * (i.quantity || 1),
        0
      );
    },

    clearCart(state) {
      state.items = [];
      state.total = 0;
    },

    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce(
        (sum, i) => sum + (i.price || i.product?.price || 0) * i.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh cart from server
      })
      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend cart items to frontend format
        if (!action.payload || action.payload.length === 0) {
          state.items = [];
          state.total = 0;
        } else {
          state.items = action.payload.map(cartItem => {
            // Handle both Java entity (with getters) and plain objects
            const product = cartItem.product || (cartItem.getProduct ? {
              id: cartItem.getProduct().getId(),
              title: cartItem.getProduct().getTitle(),
              price: cartItem.getProduct().getPrice(),
              imageUrl: cartItem.getProduct().getImageUrl(),
            } : null);

            const quantity = cartItem.quantity || (cartItem.getQuantity ? cartItem.getQuantity() : 1);

            return {
              id: product?.id,
              title: product?.title,
              price: product?.price,
              imageUrl: product?.imageUrl,
              quantity: quantity,
              product: product,
              user: cartItem.user || (cartItem.getUser ? {
                id: cartItem.getUser().getId(),
                username: cartItem.getUser().getUsername(),
              } : null),
            };
          });
          state.total = state.items.reduce(
            (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
            0
          );
        }
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

/* ✅ REQUIRED EXPORTS */
export const { addToCart, updateQuantity, setCartItems, clearCart, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
