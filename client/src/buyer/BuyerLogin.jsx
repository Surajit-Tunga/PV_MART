import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API } from "../services/api"
import "./styles/BuyerAuth.css"

export default function BuyerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await API.post("/api/auth/buyer/request-otp", { email, name })
      setOtpSent(true)
      setSuccess(response.data.message || "OTP sent to your email! Please check your inbox.")
      setError("")
    } catch (err) {
      console.error("OTP request error:", err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP. Please try again."
      setError(errorMessage)
      setSuccess("")
      
      // If network error, suggest checking server
      if (!err.response) {
        setError("Cannot connect to server. Please make sure the server is running.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      setLoading(false)
      return
    }

    try {
      const res = await API.post("/api/auth/buyer/verify-otp", {
        email,
        otp
      })

      // Store token and user info
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data))

      setSuccess("Login successful! Redirecting...")
      setTimeout(() => {
        navigate("/products")
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.")
      setSuccess("")
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    setOtpSent(false)
    setOtp("")
    setError("")
    setSuccess("")
    handleRequestOtp({ preventDefault: () => {} })
  }

  const handleBackToEmail = () => {
    setOtpSent(false)
    setOtp("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">☀️</div>
          <h1>PV MART</h1>
          <p>{otpSent ? "Enter OTP" : "Login with Email"}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <span>❌</span> {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            <span>✅</span> {success}
          </div>
        )}

        {/* Form */}
        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name (Optional)</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setOtp(value)
                }}
                disabled={loading}
                maxLength={6}
                autoFocus
              />
              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                OTP sent to: <strong>{email}</strong>
              </p>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1976d2",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.9rem"
                }}
              >
                Resend OTP
              </button>
              {" | "}
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1976d2",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.9rem"
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* Info */}
        <div className="auth-info">
          <p>🔒 Your data is secure and encrypted</p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="auth-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  )
}
