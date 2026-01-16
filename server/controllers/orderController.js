const Order = require("../models/Order")

// Get all orders for a seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("buyer", "name email phone")
      .populate("products.product", "productName price")
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      orders
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    })
  }
}

// Get single order details
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findOne({
      _id: orderId,
      seller: req.user._id
    })
      .populate("buyer", "name email phone")
      .populate("products.product")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      })
    }

    res.status(200).json({
      success: true,
      order
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    })
  }
}

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`
      })
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, seller: req.user._id },
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized"
      })
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    })
  } catch (error) {
    console.error("Error updating order:", error)
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message
    })
  }
}

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      confirmedOrders: orders.filter((o) => o.status === "confirmed").length,
      shippedOrders: orders.filter((o) => o.status === "shipped").length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
      totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
    }

    res.status(200).json({
      success: true,
      stats
    })
  } catch (error) {
    console.error("Error fetching order stats:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching order statistics",
      error: error.message
    })
  }
}

module.exports = {
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
}
