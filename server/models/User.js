const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true
    },

    // Auth provider
    authProvider: {
      type: String,
      enum: ["email", "google"],
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // Role is SYSTEM controlled, not user input
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "seller"
    },

    // OTP login
    otp: String,
    otpExpiry: Date,

    // Seller onboarding flag
    shopProfileCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

// Validation: email OR phone must exist
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("Email or phone is required"))
  } else {
    next()
  }
})

module.exports = mongoose.model("User", userSchema)
