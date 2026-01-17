import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API } from "../services/api"
import "./styles/BuyerProducts.css"

export default function BuyerCart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartTotal, setCartTotal] = useState(0)

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await API.get("/api/buyer/cart")
      if (res.data.success) {
        setCart(res.data.cart?.items || [])
        setCartTotal(res.data.cart?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      // If cart doesn't exist yet, that's fine
      if (error.response?.status !== 404) {
        setCart([])
        setCartTotal(0)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
    } else {
      fetchCart()
    }
  }, [navigate])

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId)
      } else {
        const res = await API.put(`/api/buyer/cart/item/${productId}`, { quantity })
        if (res.data.success) {
          setCart(res.data.cart?.items || [])
          setCartTotal(res.data.cart?.total || 0)
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      alert(error.response?.data?.message || "Failed to update quantity")
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/api/buyer/cart/item/${productId}`)
      if (res.data.success) {
        setCart(res.data.cart?.items || [])
        setCartTotal(res.data.cart?.total || 0)
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      alert(error.response?.data?.message || "Failed to remove item")
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!")
      return
    }
    navigate("/checkout")
  }

  const getProductIcon = (productType) => {
    switch (productType) {
      case "solar-panel":
      case "complete-system":
        return "☀️"
      case "battery":
        return "🔋"
      case "inverter":
        return "⚡"
      case "installation":
        return "🔧"
      default:
        return "☀️"
    }
  }

  return (
    <div className="products-container">
      {/* Header */}
      <header className="products-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">☀️</span>
            <h1>PV MART</h1>
          </div>
        </div>
        
        <nav className="header-nav">
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
            Home
          </button>
          <button onClick={() => navigate("/products")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
            Products
          </button>
        </nav>
      </header>

      {/* Cart Content */}
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <h1 style={{ marginBottom: "2rem", color: "#333", fontSize: "2rem" }}>🛒 Shopping Cart</h1>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div className="spinner" style={{ margin: "0 auto" }}></div>
            <p>Loading cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "#f5f5f5", borderRadius: "10px" }}>
            <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "1.5rem" }}>Your cart is empty</p>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "0.8rem 2rem",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
            {/* Cart Items */}
            <div>
              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  style={{
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    display: "flex",
                    gap: "1.5rem"
                  }}
                >
                  <div style={{ fontSize: "4rem" }}>
                    {getProductIcon(item.productType)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", color: "#333" }}>
                      {item.name}
                    </h3>
                    {item.seller && (
                      <p style={{ margin: "0 0 1rem 0", color: "#666", fontSize: "0.9rem" }}>
                        Seller: {item.seller}
                      </p>
                    )}
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontWeight: "600", color: "#333" }}>Quantity:</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #ddd", borderRadius: "5px" }}>
                          <button
                            onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                            style={{
                              padding: "0.3rem 0.8rem",
                              border: "none",
                              background: "#f5f5f5",
                              cursor: "pointer",
                              borderRadius: "5px 0 0 5px",
                              fontSize: "1.2rem"
                            }}
                          >
                            −
                          </button>
                          <span style={{ padding: "0.3rem 1rem", minWidth: "3rem", textAlign: "center" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                            style={{
                              padding: "0.3rem 0.8rem",
                              border: "none",
                              background: "#f5f5f5",
                              cursor: "pointer",
                              borderRadius: "0 5px 5px 0",
                              fontSize: "1.2rem"
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: "700", color: "#667eea" }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        background: "none",
                        border: "1px solid #d32f2f",
                        color: "#d32f2f",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div>
              <div style={{
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1.5rem",
                position: "sticky",
                top: "2rem"
              }}>
                <h3 style={{ marginBottom: "1.5rem", fontSize: "1.3rem", color: "#333" }}>
                  Order Summary
                </h3>
                
                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Items ({cartCount}):</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Shipping:</span>
                    <span>₹5,000</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tax (18%):</span>
                    <span>₹{Math.round(cartTotal * 0.18).toLocaleString()}</span>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#667eea",
                  paddingTop: "1rem",
                  borderTop: "2px solid #ddd",
                  marginBottom: "1.5rem"
                }}>
                  <span>Total:</span>
                  <span>₹{(cartTotal + 5000 + Math.round(cartTotal * 0.18)).toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#5568d3"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#667eea"}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

