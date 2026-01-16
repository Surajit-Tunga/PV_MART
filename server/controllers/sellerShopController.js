const SellerShop = require("../models/SellerShop")
const User = require("../models/User")

exports.setupShop = async (req, res) => {
  try {
    const userId = req.user._id
    
    // Check if shop already exists
    let shop = await SellerShop.findOne({ seller: userId })
    
    if (shop) {
      return res.status(400).json({ message: "Shop already setup" })
    }

    // Create new shop
    shop = await SellerShop.create({
      seller: userId,
      ...req.body
    })

    // Update user's shopProfileCompleted flag
    await User.findByIdAndUpdate(userId, { shopProfileCompleted: true })

    res.json({ message: "Shop setup completed", shop })
  } catch (error) {
    console.error("setupShop error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getShopStatus = async (req, res) => {
  try {
    const shop = await SellerShop.findOne({ seller: req.user._id })
    const user = await User.findById(req.user._id)

    res.json({
      shopExists: !!shop,
      shopProfileCompleted: user.shopProfileCompleted,
      shop: shop || null
    })
  } catch (error) {
    console.error("getShopStatus error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.getShop = async (req, res) => {
  try {
    const shop = await SellerShop.findOne({ seller: req.user._id })
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" })
    }

    res.json(shop)
  } catch (error) {
    console.error("getShop error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.updateShop = async (req, res) => {
  try {
    const userId = req.user._id
    
    let shop = await SellerShop.findOne({ seller: userId })
    
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" })
    }

    // Update fields
    Object.assign(shop, req.body)
    await shop.save()

    res.json({ message: "Shop updated successfully", shop })
  } catch (error) {
    console.error("updateShop error:", error)
    res.status(500).json({ message: error.message })
  }
}

exports.createShop = async (req, res) => {
  try {
    const shop = await SellerShop.create({
      seller: req.user._id,
      ...req.body
    })

    req.user.shopProfileCompleted = true
    await req.user.save()

    res.json(shop)
  } catch (error) {
    console.error("createShop error:", error)
    res.status(500).json({ message: error.message })
  }
}
