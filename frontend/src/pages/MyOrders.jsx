import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get(`/orders/user/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

  return (
    <div className="my-orders-container" style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ padding: "2rem", textAlign: "center", color: "#666", fontSize: "1.2rem" }}>
          📦 You have no orders yet.
        </p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            // Handle both Java entity (with getters) and plain objects
            const orderId = order.id || (order.getId ? order.getId() : null);
            const orderTime = order.orderTime
              ? new Date(order.orderTime).toLocaleString()
              : (order.getOrderTime ? new Date(order.getOrderTime()).toLocaleString() : "N/A");
            const totalPrice = order.totalPrice || (order.getTotalPrice ? order.getTotalPrice() : 0);
            const orderItems = order.orderItems || (order.getOrderItems ? order.getOrderItems() : []);
            const isExpanded = expandedOrderId === orderId;

            return (
              <div
                key={orderId}
                className="order-card"
                style={{
                  background: "white",
                  padding: "20px",
                  marginBottom: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
                onClick={() => toggleOrder(orderId)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                      Order #{orderId}
                      <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal" }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </h3>
                    <p style={{ color: "#666", marginBottom: "4px" }}>
                      <strong>Date:</strong> {orderTime}
                    </p>
                    <p style={{ color: "#666" }}>
                      <strong>User:</strong> {user?.username || "N/A"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#0d6efd" }}>
                      ₹{totalPrice}
                    </p>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #dee2e6" }}>
                    <h4 style={{ marginBottom: "15px", color: "#333" }}>Order Items:</h4>
                    {orderItems && orderItems.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {orderItems.map((item, index) => {
                          // Handle both Java entity (with getters) and plain objects
                          const product = item.product || (item.getProduct ? {
                            id: item.getProduct().getId(),
                            title: item.getProduct().getTitle(),
                            imageUrl: item.getProduct().getImageUrl(),
                            price: item.getProduct().getPrice(),
                          } : null);
                          const itemId = item.id || (item.getId ? item.getId() : null) || `order-item-${index}`;
                          const quantity = item.quantity || (item.getQuantity ? item.getQuantity() : 1);
                          const price = item.price || (item.getPrice ? item.getPrice() : 0) || product?.price || 0;
                          const productTitle = product?.title || "Product";
                          const productImage = product?.imageUrl || "https://via.placeholder.com/100";

                          return (
                            <div
                              key={`${orderId}-item-${itemId}-${index}`}
                              style={{
                                display: "flex",
                                gap: "15px",
                                padding: "12px",
                                background: "#f8f9fa",
                                borderRadius: "8px",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={productImage}
                                alt={productTitle}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: "500" }}>{productTitle}</p>
                                <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>
                                  Quantity: {quantity}
                                </p>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <p style={{ margin: 0, fontWeight: "bold", color: "#0d6efd" }}>
                                  ₹{price * quantity}
                                </p>
                                <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "12px" }}>
                                  ₹{price} each
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: "#666", fontStyle: "italic" }}>No items found in this order.</p>
                    )}
                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #dee2e6", textAlign: "right" }}>
                      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#0d6efd" }}>
                        Total: ₹{totalPrice}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
