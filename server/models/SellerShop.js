const mongoose = require("mongoose")

const sellerShopSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Shop Details
    shopName: { type: String, required: true },
    shopType: { type: String, enum: ["seller", "installer", "both"], required: true },
    shopDescription: { type: String },
    serviceArea: { type: String, required: true },

    // Owner Contact Details
    ownerName: { type: String, required: true },
    ownerMobile: { type: String, required: true },
    ownerEmail: { type: String, required: true },

    // Address Details
    shopAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    // Business Verification
    businessType: { type: String, enum: ["individual", "company", "partnership"], required: true },
    gstNumber: { type: String },
    idProofType: { type: String },
    idProofNumber: { type: String },

    // Services and Products
    sellSolarPanels: { type: String, enum: ["yes", "no"], default: "yes" },
    offersInstallation: { type: String, enum: ["yes", "no"], default: "no" },
    installationTypes: { type: [String], enum: ["rooftop", "ground-mounted"] },
    capacityRangeMin: { type: Number },
    capacityRangeMax: { type: Number },

    // Pricing
    pricePerKw: { type: Number },
    installationCharge: { type: Number },
    siteVisitCharge: { type: Number },

    // Payment Details
    bankAccountHolder: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },

    // Availability
    availabilityDays: { type: [String] },
    responseTime: { type: String, required: true },

    // Agreement
    acceptTerms: { type: Boolean, default: false },

    // Status
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("SellerShop", sellerShopSchema)
