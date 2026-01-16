const Product = require("../models/Product")
const path = require("path")
const fs = require("fs")

// Add new product (with optional image upload)
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productType,
      brand,
      powerCapacity,
      panelType,
      efficiency,
      price,
      installationIncluded,
      installationCharge,
      siteVisitCharge,
      installationAvailable,
      installationType,
      installationArea,
      estimatedInstallationTime,
      stockQuantity,
      productWarranty,
      performanceWarranty,
      afterSalesSupport,
      returnAvailable,
      replacementAvailable
    } = req.body

    // Validate required fields
    if (!productName || !productType || !price || !stockQuantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: productName, productType, price, stockQuantity"
      })
    }

    // Handle image upload if present
    let productImage = null
    if (req.file) {
      productImage = `/uploads/${req.file.filename}`
    }

    // Parse installationType if it's a JSON string
    let parsedInstallationType = installationType
    if (typeof installationType === "string") {
      try {
        parsedInstallationType = JSON.parse(installationType)
      } catch (e) {
        parsedInstallationType = []
      }
    }

    const product = new Product({
      seller: req.user._id,
      productName,
      productType,
      brand: brand || null,
      powerCapacity: powerCapacity || null,
      panelType: panelType || null,
      efficiency: efficiency ? Number(efficiency) : null,
      price: Number(price),
      installationIncluded: installationIncluded || "no",
      installationCharge: installationCharge ? Number(installationCharge) : null,
      siteVisitCharge: siteVisitCharge ? Number(siteVisitCharge) : null,
      installationAvailable: installationAvailable || "yes",
      installationType: Array.isArray(parsedInstallationType) ? parsedInstallationType : [],
      installationArea: installationArea || null,
      estimatedInstallationTime: estimatedInstallationTime || null,
      stockQuantity: Number(stockQuantity),
      productWarranty: productWarranty ? Number(productWarranty) : null,
      performanceWarranty: performanceWarranty ? Number(performanceWarranty) : null,
      afterSalesSupport: afterSalesSupport || "yes",
      returnAvailable: returnAvailable || "no",
      replacementAvailable: replacementAvailable || "no",
      productImage
    })

    await product.save()

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    })
  } catch (error) {
    console.error("Error adding product:", error)
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message
    })
  }
}

// Get all products for a seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      products
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    })
  }
}

// Get single product by ID
const getProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findOne({
      _id: productId,
      seller: req.user._id
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      success: true,
      product
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message
    })
  }
}

// Update product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const updateData = { ...req.body }

    // Convert numeric fields
    if (updateData.price) updateData.price = Number(updateData.price)
    if (updateData.stockQuantity) updateData.stockQuantity = Number(updateData.stockQuantity)
    if (updateData.efficiency) updateData.efficiency = Number(updateData.efficiency)
    if (updateData.installationCharge) updateData.installationCharge = Number(updateData.installationCharge)
    if (updateData.siteVisitCharge) updateData.siteVisitCharge = Number(updateData.siteVisitCharge)
    if (updateData.productWarranty) updateData.productWarranty = Number(updateData.productWarranty)
    if (updateData.performanceWarranty) updateData.performanceWarranty = Number(updateData.performanceWarranty)

    // Handle new image if uploaded
    if (req.file) {
      const product = await Product.findOne({
        _id: productId,
        seller: req.user._id
      })

      if (product && product.productImage) {
        const oldImagePath = path.join(__dirname, "..", "public", product.productImage)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      updateData.productImage = `/uploads/${req.file.filename}`
    }

    // Parse installationType if it's a JSON string
    if (typeof updateData.installationType === "string") {
      try {
        updateData.installationType = JSON.parse(updateData.installationType)
      } catch (e) {
        updateData.installationType = []
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, seller: req.user._id },
      updateData,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized"
      })
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    })
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message
    })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Product.findOne({
      _id: productId,
      seller: req.user._id
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized"
      })
    }

    // Delete associated image if exists
    if (product.productImage) {
      const imagePath = path.join(__dirname, "..", "public", product.productImage)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    await Product.findByIdAndDelete(productId)

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message
    })
  }
}

module.exports = {
  addProduct,
  getSellerProducts,
  getProduct,
  updateProduct,
  deleteProduct
}
