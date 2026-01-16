const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { generateOTP } = require("../utils/otp")

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })

// Request OTP
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        email,
        authProvider: "email",
        role: "seller"
      })
    }

    const otp = generateOTP()
    user.otp = otp
    user.otpExpiry = Date.now() + 5 * 60 * 1000
    await user.save()

    console.log("OTP:", otp) // MVP only

    res.json({ message: "OTP sent" })
  } catch (error) {
    console.error("requestOtp error:", error)
    res.status(500).json({ message: error.message })
  }
}

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    res.json({
      token: generateToken(user._id),
      shopProfileCompleted: user.shopProfileCompleted
    })
  } catch (error) {
    console.error("verifyOtp error:", error)
    res.status(500).json({ message: error.message })
  }
}
