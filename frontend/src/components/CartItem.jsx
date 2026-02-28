import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeItem, updateCartQuantityAPI, removeFromCartAPI } from "../features/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const productName = item.title || item.product?.title || "Product";
  const price = item.price || item.product?.price || 0;
  const imageUrl = item.imageUrl || item.product?.imageUrl;
  const productId = item.product?.id || item.id;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item
      dispatch(removeItem(item.id));
      if (user?.id && productId) {
        try {
          await dispatch(removeFromCartAPI({ userId: user.id, productId })).unwrap();
        } catch (error) {
          console.error("Failed to remove item from database:", error);
        }
      }
      return;
    }

    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));

    // Sync with backend using PUT (set quantity, not add)
    if (user?.id && productId) {
      try {
        await dispatch(updateCartQuantityAPI({
          userId: user.id,
          productId,
          quantity: newQuantity,
        })).unwrap();
      } catch (error) {
        console.error("Failed to update cart in database:", error);
      }
    }
  };

  const handleRemove = async () => {
    dispatch(removeItem(item.id));
    if (user?.id && productId) {
      try {
        await dispatch(removeFromCartAPI({ userId: user.id, productId })).unwrap();
      } catch (error) {
        console.error("Failed to remove item from database:", error);
      }
    }
  };

  return (
    <div className="cart-item">
      <img src={imageUrl || "https://via.placeholder.com/300"} alt={productName} />

      <div style={{ flex: 1 }}>
        <h4 style={{ marginBottom: "4px" }}>🛍️ {productName}</h4>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>₹{price} each</p>

        <div className="cart-controls">
          <button onClick={() => handleQuantityChange(item.quantity - 1)}>−</button>
          <span style={{ fontWeight: "bold", minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(item.quantity + 1)}>+</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        <strong style={{ fontSize: "16px", color: "#0d6efd" }}>₹{(price * item.quantity).toFixed(2)}</strong>
        <button
          onClick={handleRemove}
          style={{ background: "#dc3545", color: "white", padding: "4px 10px", fontSize: "13px", borderRadius: "6px" }}
          title="Remove item"
        >
          ❌ Remove
        </button>
      </div>
    </div>
  );
}
