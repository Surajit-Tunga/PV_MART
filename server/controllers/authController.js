const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { generateOTP } = require("../utils/otp")

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const userExists = await User.findOne({ email })
    if(userExists) return res.status(400).json({ message: "User already exists" })

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || "buyer",
      authProvider: "email"
    })
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).select("+password")
    if(user && user.password && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Buyer OTP: Request OTP
exports.requestBuyerOtp = async (req, res) => {
  try {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Basic email validation on server side
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" })
    }

    let user = await User.findOne({ email })

    if (!user) {
      // Create new user if doesn't exist
      try {
        const userData = {
          email,
          name: name || "",
          authProvider: "email",
          role: "buyer"
        }
        console.log("Creating new user with data:", userData)
        user = await User.create(userData)
        console.log("User created successfully:", user._id)
      } catch (createError) {
        console.error("User creation error:", createError)
        // If creation fails, try to find again (race condition)
        if (createError.code === 11000) {
          user = await User.findOne({ email })
          if (!user) {
            throw new Error("User creation failed and user not found")
          }
        } else {
          throw createError
        }
      }
    } else {
      console.log("User found:", user._id, "Role:", user.role)
      // Update name if provided and user exists but doesn't have name
      if (name && !user.name) {
        user.name = name
      }
    }

    // Generate and save OTP
    const otp = generateOTP()
    user.otp = otp
    user.otpExpiry = Date.now() + 5 * 60 * 1000 // 5 minutes
    
    try {
      await user.save()
    } catch (saveError) {
      console.error("Error saving user with OTP:", saveError)
      throw saveError
    }

    console.log("Buyer OTP for", email, ":", otp) // MVP only - remove in production

    res.json({ message: "OTP sent to your email" })
  } catch (error) {
    console.error("requestBuyerOtp error - Full error:", error)
    console.error("Error stack:", error.stack)
    console.error("Error name:", error.name)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    
    // Provide more helpful error messages
    let errorMessage = "Failed to send OTP. Please try again."
    if (error.code === 11000) {
      errorMessage = "Email already exists. Please use a different email."
    } else if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors).map(e => e.message).join(", ")
    } else if (error.name === "CastError") {
      errorMessage = "Invalid data format"
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    })
  }
}

// Buyer OTP: Verify OTP
exports.verifyBuyerOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found. Please request OTP first." })
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // OTP verified successfully
    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    })
  } catch (error) {
    console.error("verifyBuyerOtp error:", error)
    res.status(500).json({ message: error.message })
  }
}
