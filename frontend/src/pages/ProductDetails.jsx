import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosConfig";
import { addToCart, addToCartAPI } from "../features/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data); // backend already provides imageUrl
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
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

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details" style={{ 
      display: "flex", 
      gap: "40px", 
      maxWidth: "1200px", 
      margin: "40px auto", 
      padding: "30px",
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
    }}>
      <div style={{ flex: "0 0 500px" }}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.title}
          style={{ 
            width: "100%", 
            height: "auto", 
            maxHeight: "600px",
            objectFit: "contain",
            borderRadius: "10px"
          }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>{product.title}</h2>
        <p style={{ color: "#666", lineHeight: "1.6" }}>{product.description}</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
        </div>

        <div style={{ marginTop: "10px" }}>
          {product.oldPrice && (
            <p style={{ textDecoration: "line-through", color: "#999", marginBottom: "5px" }}>
              Old Price: ₹{product.oldPrice}
            </p>
          )}

          {product.discountedPrice ? (
            <p style={{ color: "green", fontWeight: "bold", fontSize: "24px" }}>
              Discounted Price: ₹{product.discountedPrice}
            </p>
          ) : (
            <p style={{ fontWeight: "bold", fontSize: "24px", color: "#0d6efd" }}>
              Price: ₹{product.price}
            </p>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={handleAddToCart}
          style={{ 
            marginTop: "20px", 
            padding: "14px 28px", 
            fontSize: "18px",
            alignSelf: "flex-start"
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
