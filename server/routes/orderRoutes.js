const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const sellerOnly = require("../middleware/sellerOnly")
const {
  getSellerOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
} = require("../controllers/orderController")

// All routes require seller authentication
router.use(auth)
router.use(sellerOnly)

// GET - Get all seller's orders
router.get("/", getSellerOrders)

// GET - Get order statistics
router.get("/stats", getOrderStats)

// GET - Get specific order
router.get("/:orderId", getOrder)

// PUT - Update order status
router.put("/:orderId/status", updateOrderStatus)

module.exports = router
