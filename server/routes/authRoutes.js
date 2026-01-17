const express = require("express")
const router = express.Router()
const { registerUser, loginUser, requestBuyerOtp, verifyBuyerOtp } = require("../controllers/authController")

router.post("/register", registerUser)
router.post("/login", loginUser)

// Buyer OTP routes
router.post("/buyer/request-otp", requestBuyerOtp)
router.post("/buyer/verify-otp", verifyBuyerOtp)

module.exports = router
