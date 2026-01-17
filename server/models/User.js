const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

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
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      select: false // Don't include password in queries by default
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
      default: "email"
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

// Hash password before saving
userSchema.pre("save", async function () {
  // Only hash password if it was modified and exists
  if (!this.isModified("password") || !this.password) {
    return
  }
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error) {
    throw error
  }
})

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
