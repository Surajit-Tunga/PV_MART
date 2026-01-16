const mongoose = require("mongoose")

const sellerShopSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },

    shopType: {
      type: String,
      enum: ["Individual", "Company", "Installer", "Dealer"],
      required: true
    },

    phone: { type: String, required: true },
    email: { type: String },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    experienceYears: Number,

    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("SellerShop", sellerShopSchema)
