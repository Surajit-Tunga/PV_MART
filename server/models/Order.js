const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        subtotal: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    adminApproval: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    paymentProof: {
      type: String // URL or reference to uploaded payment proof (if needed)
    },
    paymentMethod: String,
    shippingAddress: String,
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    estimatedDelivery: Date,
    notes: String
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)
