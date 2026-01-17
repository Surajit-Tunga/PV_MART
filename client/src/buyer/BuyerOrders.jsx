
import React, { useState, useEffect } from "react";
import API from "../services/api";

const STATUS_COLORS = {
  delivered: "#28a745",
  shipped: "#17a2b8",
  confirmed: "#007bff",
  pending: "#ffc107",
  processing: "#17a2b8",
  cancelled: "#dc3545"
};

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState("active"); // 'active' or 'past'

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/api/buyer/orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Filter orders based on toggle
  const filteredOrders = orders.filter((order) => {
    if (toggle === "active") {
      return ["pending", "confirmed", "processing", "shipped"].includes(order.status);
    } else {
      return ["delivered", "cancelled"].includes(order.status);
    }
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>My Orders</h1>

      {/* Toggle buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setToggle("active")}
          style={{
            padding: "0.6rem 2rem",
            backgroundColor: toggle === "active" ? "#667eea" : "#f8f9fa",
            color: toggle === "active" ? "white" : "#667eea",
            border: toggle === "active" ? "none" : "1px solid #667eea",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem"
          }}
        >
          Active Orders
        </button>
        <button
          onClick={() => setToggle("past")}
          style={{
            padding: "0.6rem 2rem",
            backgroundColor: toggle === "past" ? "#667eea" : "#f8f9fa",
            color: toggle === "past" ? "white" : "#667eea",
            border: toggle === "past" ? "none" : "1px solid #667eea",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "1rem"
          }}
        >
          Past Orders
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading orders...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px"
        }}>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1.5rem" }}>
            No orders in this category
          </p>
          <button
            onClick={() => (location.href = "/buyer/products")}
            style={{
              padding: "0.8rem 2rem",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem"
            }}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "2rem" }}>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1.5rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid #eee"
              }}>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Order ID</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#333" }}>{order._id}</p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Order Date</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#333" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Total Amount</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#667eea" }}>
                    ₹{order.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Status</p>
                  <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: STATUS_COLORS[order.status] || "#888",
                    color: "white",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0", fontWeight: "600" }}>Items:</p>
                <ul style={{ margin: 0, color: "#333", paddingLeft: 20 }}>
                  {order.products.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.productName || "Product"} x{item.quantity} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  style={{
                    padding: "0.6rem 1.5rem",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}
                >
                  Track Order
                </button>
                <button
                  style={{
                    padding: "0.6rem 1.5rem",
                    backgroundColor: "#f8f9fa",
                    color: "#667eea",
                    border: "1px solid #667eea",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
