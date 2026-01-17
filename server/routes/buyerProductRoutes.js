const express = require("express")
const router = express.Router()
const { getBuyerProducts, getBuyerProduct } = require("../controllers/buyerProductController")

// GET - Get all products for buyers (public route, no auth required)
router.get("/", getBuyerProducts)

// GET - Get single product for buyer (public route, no auth required)
router.get("/:productId", getBuyerProduct)

module.exports = router

