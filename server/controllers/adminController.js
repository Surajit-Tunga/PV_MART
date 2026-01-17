const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@pv-mart.com";
const ADMIN_PASSWORD = "admin123"; // Change to a secure password in production
const JWT_SECRET = process.env.JWT_SECRET || "adminsecret";

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "1d" });
    return res.json({ success: true, token });
  }
  return res.json({ success: false, message: "Invalid credentials" });
};


const Order = require("../models/Order");
const User = require("../models/User");

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("seller", "name email phone")
      .populate("buyer", "name email phone")
      .populate("products.product", "productName price");
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// Update order status (admin)
exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${validStatuses.join(", ")}` });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};

// Approve payment (admin)
exports.adminApprovePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: "completed", status: "confirmed" }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Payment approved and order confirmed", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error approving payment", error: error.message });
  }
};
