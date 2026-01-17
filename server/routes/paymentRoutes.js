const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Generate UPI QR code
router.get("/upi-qr", paymentController.generateUpiQr);

module.exports = router;
