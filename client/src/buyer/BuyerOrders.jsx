import React, { useState } from "react"

export default function BuyerOrders() {
  const [orders] = useState([
    {
      id: "ORD-001",
      date: "2026-01-17",
      items: "3kW Solar Panel System, Solar Battery 10kWh",
      total: 775000,
      status: "Delivered",
      statusColor: "#28a745"
    },
    {
      id: "ORD-002",
      date: "2026-01-15",
      items: "Solar Inverter 5kW",
      total: 80000,
      status: "In Transit",
      statusColor: "#ffc107"
    },
    {
      id: "ORD-003",
      date: "2026-01-10",
      items: "Mounting Hardware Kit",
      total: 50000,
      status: "Processing",
      statusColor: "#17a2b8"
    }
  ])

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px"
        }}>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1.5rem" }}>
            No orders yet
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
          {orders.map((order) => (
            <div
              key={order.id}
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
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#333" }}>{order.id}</p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Order Date</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#333" }}>{order.date}</p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Total Amount</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0, color: "#667eea" }}>
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>Status</p>
                  <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: order.statusColor,
                    color: "white",
                    borderRadius: "5px",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.5rem 0", fontWeight: "600" }}>Items:</p>
                <p style={{ margin: 0, color: "#333" }}>{order.items}</p>
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
  )
}
