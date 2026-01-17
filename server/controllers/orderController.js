const Cart = require("../models/Cart");

// Place a new order for the buyer
const placeOrder = async (req, res) => {
  try {
    // Get buyer's cart
    const cart = await Cart.findOne({ buyer: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Prepare order data
    const orderProducts = cart.items.map((item) => ({
      product: item.product._id || item.product,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
    const totalAmount = orderProducts.reduce((sum, item) => sum + item.subtotal, 0);

    // Shipping info from request (optional)
    const { shippingAddress, customerName, customerPhone, customerEmail, paymentMethod } = req.body;

    // Create order for each seller in the cart (if multi-seller)
    // For now, assume all items are from one seller (first item's seller)
    const seller = cart.items[0].product.seller || cart.items[0].seller;


    const order = await Order.create({
      seller,
      buyer: req.user._id,
      products: orderProducts,
      totalAmount,
      paymentStatus: "pending", // Wait for admin approval
      adminApproval: "pending",
      status: "pending",
      paymentMethod: paymentMethod || "upi",
      shippingAddress,
      customerName,
      customerPhone,
      customerEmail
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message
    });
  }
};
// Get all orders for a buyer
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("seller", "name email phone")
      .populate("products.product", "productName price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching buyer orders",
      error: error.message
    });
  }
};
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
  getOrderStats,
  getBuyerOrders,
  placeOrder
}
