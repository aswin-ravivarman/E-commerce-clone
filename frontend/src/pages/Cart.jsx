import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import CartItem from "../components/CartItem";
import { fetchUserCart, clearCart } from "../features/cartSlice";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loadCart = useCallback(() => {
    if (user?.id) {
      dispatch(fetchUserCart(user.id)).catch(err => {
        console.error("Failed to load cart from database:", err);
      });
    } else {
      dispatch(clearCart());
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    // Load cart from database when user is logged in
    loadCart();
  }, [loadCart]);

  // Refresh cart when component becomes visible or pathname changes
  useEffect(() => {
    if (user?.id && location.pathname === "/cart") {
      loadCart();
    }
  }, [location.pathname, user?.id, loadCart]);

  if (items.length === 0) {
    return <p style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem" }}>🛒 Your cart is empty</p>;
  }

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart ({items.length} items)</h2>

      {items.map((item, index) => (
        <CartItem key={item.id ? `cart-${item.id}-${index}` : `cart-item-${index}`} item={item} />
      ))}

      <div className="cart-total">
        Total: ₹{total}
      </div>

      <div style={{ textAlign: "right", marginTop: "16px" }}>
        <button
          className="btn-primary"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
