const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getBuyerOrders } = require("../controllers/orderController");

// All routes require authentication
router.use(auth);

// GET - Get all buyer's orders
router.get("/", getBuyerOrders);

module.exports = router;
