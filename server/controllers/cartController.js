const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Get or create cart for buyer
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ buyer: req.user._id }).populate("items.product")

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ buyer: req.user._id, items: [] })
    }

    // Format cart items for response
    const formattedItems = cart.items.map((item) => ({
      _id: item.product?._id || item.product,
      id: item.product?._id || item.product,
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.productName,
      productType: item.productType,
      seller: item.seller,
      product: item.product // Include full product details if populated
    }))

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: formattedItems,
        itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message
    })
  }
}

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      })
    }

    // Get product details
    const product = await Product.findById(productId).populate("seller", "name")

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive"
      })
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stockQuantity} items available in stock`
      })
    }

    // Find or create cart
    let cart = await Cart.findOne({ buyer: req.user._id })

    if (!cart) {
      cart = await Cart.create({ buyer: req.user._id, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity

      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more items. Only ${product.stockQuantity} available in stock`
        })
      }

      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        productName: product.productName,
        productType: product.productType,
        seller: product.seller?.name || "Unknown Seller"
      })
    }

    await cart.save()

    // Populate and return updated cart
    await cart.populate("items.product")

    const formattedItems = cart.items.map((item) => ({
      _id: item.product?._id || item.product,
      id: item.product?._id || item.product,
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.productName,
      productType: item.productType,
      seller: item.seller,
      product: item.product
    }))

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: {
        _id: cart._id,
        items: formattedItems,
        itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message
    })
  }
}

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required"
      })
    }

    const cart = await Cart.findOne({ buyer: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      })
    }

    if (quantity === 0) {
      // Remove item
      cart.items.splice(itemIndex, 1)
    } else {
      // Check stock availability
      const product = await Product.findById(productId)
      if (product && quantity > product.stockQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stockQuantity} items available in stock`
        })
      }

      cart.items[itemIndex].quantity = quantity
    }

    await cart.save()
    await cart.populate("items.product")

    const formattedItems = cart.items.map((item) => ({
      _id: item.product?._id || item.product,
      id: item.product?._id || item.product,
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.productName,
      productType: item.productType,
      seller: item.seller,
      product: item.product
    }))

    res.status(200).json({
      success: true,
      message: quantity === 0 ? "Item removed from cart" : "Cart updated",
      cart: {
        _id: cart._id,
        items: formattedItems,
        itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    })
  } catch (error) {
    console.error("Error updating cart:", error)
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message
    })
  }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ buyer: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      })
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )

    await cart.save()
    await cart.populate("items.product")

    const formattedItems = cart.items.map((item) => ({
      _id: item.product?._id || item.product,
      id: item.product?._id || item.product,
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.productName,
      productType: item.productType,
      seller: item.seller,
      product: item.product
    }))

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: {
        _id: cart._id,
        items: formattedItems,
        itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: formattedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    })
  } catch (error) {
    console.error("Error removing from cart:", error)
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error: error.message
    })
  }
}

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyer: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      })
    }

    cart.items = []
    await cart.save()

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: {
        _id: cart._id,
        items: [],
        itemCount: 0,
        total: 0
      }
    })
  } catch (error) {
    console.error("Error clearing cart:", error)
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message
    })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}

