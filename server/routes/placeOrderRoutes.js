const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { placeOrder } = require("../controllers/orderController");

// All routes require authentication
router.use(auth);

// POST - Place a new order
router.post("/", placeOrder);

module.exports = router;
