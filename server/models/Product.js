const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "SellerShop" },

    name: { type: String, required: true },
    category: String,
    price: Number,
    stock: Number,
    description: String,

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
