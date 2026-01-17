import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data.orders);
      setError("");
    } catch (err) {
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  const handleApprovePayment = async (orderId) => {
    setActionLoading(orderId + "-approve");
    try {
      await axios.patch(`/api/admin/orders/${orderId}/approve-payment`);
      fetchOrders();
    } catch {
      alert("Failed to approve payment");
    }
    setActionLoading("");
  };

  const handleStatusChange = async (orderId, status) => {
    setActionLoading(orderId + "-status");
    try {
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch {
      alert("Failed to update status");
    }
    setActionLoading("");
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Seller</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Admin Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.buyer?.name || "-"}</td>
              <td>{order.seller?.name || "-"}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.adminApproval}</td>
              <td>
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={() => handleApprovePayment(order._id)}
                    disabled={actionLoading === order._id + "-approve"}
                  >
                    {actionLoading === order._id + "-approve" ? "Approving..." : "Approve Payment"}
                  </button>
                )}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={actionLoading === order._id + "-status"}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
