const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cartController")

// All routes require authentication
router.use(auth)

// GET - Get buyer's cart
router.get("/", getCart)

// POST - Add item to cart
router.post("/", addToCart)

// PUT - Update cart item quantity
router.put("/item/:productId", updateCartItem)

// DELETE - Remove item from cart
router.delete("/item/:productId", removeFromCart)

// DELETE - Clear entire cart
router.delete("/", clearCart)

module.exports = router

