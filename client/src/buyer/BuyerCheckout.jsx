import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API } from "../services/api"

export default function BuyerCheckout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true)
        const res = await API.get("/api/buyer/cart")
        if (res.data.success) {
          const items = res.data.cart?.items || []
          if (items.length === 0) {
            alert("Your cart is empty!")
            navigate("/products")
            return
          }
          setCartItems(items)
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        if (error.response?.status === 404) {
          alert("Your cart is empty!")
          navigate("/products")
        }
      } finally {
        setLoading(false)
      }
    }

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
    } else {
      fetchCart()
    }
  }, [navigate])

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  })

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 5000
  const tax = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + tax

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo({ ...shippingInfo, [name]: value })
  }

  const handleProceedToPayment = () => {
    if (Object.values(shippingInfo).some(field => !field)) {
      alert("Please fill all shipping details")
      return
    }
    // Save shipping info to localStorage for payment page
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo))
    navigate("/payment")
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>Checkout</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem"
      }}>
        {/* Order Summary */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#333" }}>Order Summary</h2>
          <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1.5rem"
          }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #eee",
                  marginBottom: "1rem"
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>{item.name}</h4>
                  <p style={{ color: "#666", margin: 0 }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: "700", margin: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", borderTop: "2px solid #ddd", paddingTop: "1rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem"
              }}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem"
              }}>
                <span>Shipping:</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem"
              }}>
                <span>Tax (18%):</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#667eea",
                borderTop: "2px solid #ddd",
                paddingTop: "1rem"
              }}>
                <span>Total:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", color: "#333" }}>Shipping Address</h2>
          <form style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1.5rem"
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingInfo.fullName}
                onChange={handleShippingChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Email</label>
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Address</label>
              <textarea
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                rows="3"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit"
                }}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingChange}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={shippingInfo.pincode}
                onChange={handleShippingChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              style={{
                width: "100%",
                padding: "0.8rem",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "background-color 0.3s"
              }}
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
