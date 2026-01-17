const Product = require("../models/Product")
const SellerShop = require("../models/SellerShop")

// Get all products for buyers (with optional location filter)
const getBuyerProducts = async (req, res) => {
  try {
    const { city, state, pincode } = req.query

    // Base query - only active products
    let query = { isActive: true }

    // If location filters are provided, filter by seller shop location
    if (city || state || pincode) {
      const shopQuery = {}
      if (city) shopQuery.city = new RegExp(city, "i") // Case insensitive
      if (state) shopQuery.state = new RegExp(state, "i")
      if (pincode) shopQuery.pincode = pincode

      // Find shops matching the location
      const matchingShops = await SellerShop.find(shopQuery).select("_id")
      const shopIds = matchingShops.map((shop) => shop._id)

      // Find sellers who have shops in the matching locations
      const sellersInLocation = await SellerShop.find(shopQuery).distinct("seller")

      // Filter products by sellers in the location or by shop
      if (shopIds.length > 0) {
        query.$or = [{ shop: { $in: shopIds } }, { seller: { $in: sellersInLocation } }]
      } else if (sellersInLocation.length > 0) {
        query.seller = { $in: sellersInLocation }
      } else {
        // No shops found in location, return empty array
        return res.status(200).json({
          success: true,
          products: [],
          message: "No products found in the specified location"
        })
      }
    }

    // Fetch products with seller and shop information
    const products = await Product.find(query)
      .populate("seller", "name email")
      .populate("shop", "shopName city state pincode serviceArea")
      .sort({ createdAt: -1 })

    // Format products for buyer view
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.productName,
      productType: product.productType,
      brand: product.brand,
      powerCapacity: product.powerCapacity,
      price: product.price,
      image: product.productImage || null,
      warranty: product.productWarranty ? `${product.productWarranty} years` : null,
      stockQuantity: product.stockQuantity,
      seller: product.seller?.name || "Unknown Seller",
      shop: product.shop
        ? {
            name: product.shop.shopName,
            city: product.shop.city,
            state: product.shop.state,
            pincode: product.shop.pincode,
            serviceArea: product.shop.serviceArea
          }
        : null,
      installationAvailable: product.installationAvailable === "yes",
      installationCharge: product.installationCharge || null,
      createdAt: product.createdAt
    }))

    res.status(200).json({
      success: true,
      products: formattedProducts,
      count: formattedProducts.length
    })
  } catch (error) {
    console.error("Error fetching buyer products:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    })
  }
}

// Get single product for buyer
const getBuyerProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Product.findOne({ _id: productId, isActive: true })
      .populate("seller", "name email")
      .populate("shop", "shopName city state pincode serviceArea ownerMobile ownerEmail")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    const formattedProduct = {
      _id: product._id,
      name: product.productName,
      productType: product.productType,
      brand: product.brand,
      powerCapacity: product.powerCapacity,
      panelType: product.panelType,
      efficiency: product.efficiency,
      price: product.price,
      image: product.productImage || null,
      warranty: product.productWarranty ? `${product.productWarranty} years` : null,
      performanceWarranty: product.performanceWarranty
        ? `${product.performanceWarranty} years`
        : null,
      stockQuantity: product.stockQuantity,
      seller: product.seller?.name || "Unknown Seller",
      shop: product.shop
        ? {
            name: product.shop.shopName,
            city: product.shop.city,
            state: product.shop.state,
            pincode: product.shop.pincode,
            serviceArea: product.shop.serviceArea,
            contact: {
              mobile: product.shop.ownerMobile,
              email: product.shop.ownerEmail
            }
          }
        : null,
      installationAvailable: product.installationAvailable === "yes",
      installationIncluded: product.installationIncluded === "yes",
      installationCharge: product.installationCharge || null,
      installationType: product.installationType || [],
      estimatedInstallationTime: product.estimatedInstallationTime,
      afterSalesSupport: product.afterSalesSupport === "yes",
      returnAvailable: product.returnAvailable === "yes",
      replacementAvailable: product.replacementAvailable === "yes"
    }

    res.status(200).json({
      success: true,
      product: formattedProduct
    })
  } catch (error) {
    console.error("Error fetching buyer product:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    })
  }
}

module.exports = {
  getBuyerProducts,
  getBuyerProduct
}

