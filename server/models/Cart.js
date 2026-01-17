const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  // Store product snapshot at time of adding to cart
  productName: {
    type: String,
    required: true
  },
  productType: String,
  seller: String
})

const cartSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// Update updatedAt before saving
cartSchema.pre("save", async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Cart", cartSchema)

