const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin login
router.post("/login", adminController.adminLogin);


// Get all orders
router.get("/orders", adminController.getAllOrders);

// Update order status (admin)
router.patch("/orders/:orderId/status", adminController.adminUpdateOrderStatus);

// Approve payment (admin)
router.patch("/orders/:orderId/approve-payment", adminController.adminApprovePayment);

module.exports = router;
