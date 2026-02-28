import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, addToCartAPI } from "../features/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent navigation when clicking Add to Cart
    
    // Add to local Redux state
    dispatch(addToCart(product));
    
    // Sync with backend if user is logged in
    if (user?.id) {
      try {
        await dispatch(addToCartAPI({
          userId: user.id,
          productId: product.id,
          quantity: 1,
        })).unwrap();
      } catch (error) {
        console.error("Failed to save cart to database:", error);
      }
    }
  };

  return (
    <div
      className="product-card"
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <img
        src={product.imageUrl || "https://via.placeholder.com/300"}
        alt={product.title}
      />
      <h3>{product.title}</h3>
      <p>₹{product.price}</p>

      <button
        className="btn-primary"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
