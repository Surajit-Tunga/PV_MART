const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "SellerShop" },

    // Basic Product Information
    productName: { type: String, required: true },
    productType: {
      type: String,
      enum: ["solar-panel", "inverter", "battery", "complete-system", "installation"],
      required: true
    },
    brand: String,
    powerCapacity: String, // e.g., "1kW", "3kW", "5kW"
    panelType: {
      type: String,
      enum: ["mono-perc", "polycrystalline", "bifacial"]
    },
    efficiency: Number, // Percentage

    // Pricing Information
    price: { type: Number, required: true },
    installationIncluded: { type: String, enum: ["yes", "no"], default: "no" },
    installationCharge: Number,
    siteVisitCharge: Number,

    // Installation Details
    installationAvailable: { type: String, enum: ["yes", "no"], default: "yes" },
    installationType: [String], // Array for multiple installation types
    installationArea: String,
    estimatedInstallationTime: String,

    // Stock and Warranty
    stockQuantity: { type: Number, required: true, default: 0 },
    productWarranty: Number, // In years
    performanceWarranty: Number, // In years
    afterSalesSupport: { type: String, enum: ["yes", "no"], default: "yes" },

    // Policies
    returnAvailable: { type: String, enum: ["yes", "no"], default: "no" },
    replacementAvailable: { type: String, enum: ["yes", "no"], default: "no" },

    // Product Image
    productImage: String, // URL or file path

    // Status
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)
