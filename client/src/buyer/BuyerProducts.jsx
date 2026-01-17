import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API } from "../services/api"
import "./styles/BuyerProducts.css"

export default function BuyerProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [locationPermission, setLocationPermission] = useState(null) // null, 'granted', 'denied', 'prompting'
  const [userLocation, setUserLocation] = useState(null) // { city, state, pincode }
  const [locationFilter, setLocationFilter] = useState(false)

  const [cart, setCart] = useState([])
  const [cartLoading, setCartLoading] = useState(false)

  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
    } else {
      setUser(JSON.parse(userData))
      // Request location permission
      requestLocationAccess()
      // Load cart from backend
      fetchCart()
    }
  }, [navigate])

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setCartLoading(true)
      const res = await API.get("/api/buyer/cart")
      setCart(res.data.cart?.items || [])
    } catch (error) {
      console.error("Error fetching cart:", error)
      // If cart doesn't exist yet, that's fine - it will be created on first add
      if (error.response?.status !== 404) {
        setCart([])
      }
    } finally {
      setCartLoading(false)
    }
  }

  // Request location access
  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationPermission("not-supported")
      return
    }

    setLocationPermission("prompting")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Reverse geocode to get city, state from coordinates
        try {
          const { latitude, longitude } = position.coords
          const locationData = await reverseGeocode(latitude, longitude)
          setUserLocation(locationData)
          setLocationPermission("granted")
          setLocationFilter(true)
          fetchProducts(locationData)
        } catch (err) {
          console.error("Error getting location details:", err)
          setLocationPermission("granted") // Permission granted but geocoding failed
          fetchProducts() // Fetch all products
        }
      },
      (err) => {
        console.error("Location access denied:", err)
        setLocationPermission("denied")
        fetchProducts() // Fetch all products without location filter
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Reverse geocode coordinates to city/state
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "PV-Mart-Buyer-App" // Required by Nominatim
          }
        }
      )
      const data = await response.json()
      
      // Extract city, state, and pincode from response
      const address = data.address || {}
      return {
        city: address.city || address.town || address.village || address.county || "",
        state: address.state || address.region || "",
        pincode: address.postcode || ""
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err)
      // Fallback: return empty location
      return { city: "", state: "", pincode: "" }
    }
  }

  // Fetch products from API
  const fetchProducts = async (location = null) => {
    try {
      setLoading(true)
      setError("")

      let url = "/api/buyer/products"
      if (location && locationFilter) {
        const params = new URLSearchParams()
        if (location.city) params.append("city", location.city)
        if (location.state) params.append("state", location.state)
        if (location.pincode) params.append("pincode", location.pincode)
        if (params.toString()) {
          url += `?${params.toString()}`
        }
      }

      const res = await API.get(url)
      setProducts(res.data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.response?.data?.message || "Failed to fetch products. Please try again.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch products when component mounts or location filter changes
  useEffect(() => {
    if (user && locationPermission !== "prompting") {
      if (locationFilter && userLocation) {
        fetchProducts(userLocation)
      } else {
        fetchProducts()
      }
    }
  }, [locationFilter, userLocation, user])

  // Add item to cart via API
  const addToCart = async (product) => {
    try {
      setCartLoading(true)
      const res = await API.post("/api/buyer/cart", {
        productId: product._id,
        quantity: 1
      })
      
      if (res.data.success) {
        setCart(res.data.cart?.items || [])
        console.log("✅ Product added to cart:", product.name)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert(error.response?.data?.message || "Failed to add item to cart")
    } finally {
      setCartLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setCartLoading(true)
      const res = await API.delete(`/api/buyer/cart/item/${productId}`)
      
      if (res.data.success) {
        setCart(res.data.cart?.items || [])
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      alert(error.response?.data?.message || "Failed to remove item from cart")
    } finally {
      setCartLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      setCartLoading(true)
      const res = await API.put(`/api/buyer/cart/item/${productId}`, { quantity })
      
      if (res.data.success) {
        setCart(res.data.cart?.items || [])
      }
    } catch (error) {
      console.error("Error updating cart:", error)
      alert(error.response?.data?.message || "Failed to update cart")
    } finally {
      setCartLoading(false)
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // Cart is on backend, no need to clear localStorage
    navigate("/")
  }

  const toggleLocationFilter = () => {
    setLocationFilter(!locationFilter)
  }

  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:5000${imagePath}`
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
          <a href="#products">Products</a>
        </nav>

        <div className="header-right">
          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "0.5rem 1rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginRight: "1rem"
            }}
          >
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          <button
            onClick={() => navigate("/buyer/orders")}
            style={{
              padding: "0.5rem 1rem",
              background: "#fff",
              color: "#667eea",
              border: "1px solid #667eea",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginRight: "1rem"
            }}
          >
            📦 My Orders
          </button>
          <div className="user-info">
            <span>👤 {user?.name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Location Filter Section */}
      <div className="location-filter-section" style={{ padding: "1rem", background: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {locationPermission === "denied" && (
              <button onClick={requestLocationAccess} style={{ padding: "0.5rem 1rem", background: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                📍 Allow Location Access
              </button>
            )}
            {locationPermission === "granted" && userLocation && (
              <span style={{ color: "#666" }}>
                📍 Location: {userLocation.city || "Unknown"}, {userLocation.state || ""}
              </span>
            )}
            {locationPermission === "prompting" && (
              <span style={{ color: "#666" }}>📍 Getting your location...</span>
            )}
          </div>
          
          {locationPermission === "granted" && userLocation && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={locationFilter}
                onChange={toggleLocationFilter}
                style={{ cursor: "pointer" }}
              />
              <span>Show products near me</span>
            </label>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <div>
          <h2 id="products">Available Solar Products</h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div className="spinner" style={{ margin: "0 auto" }}></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#d32f2f" }}>
              <p>❌ {error}</p>
              <button onClick={() => fetchProducts(locationFilter ? userLocation : null)} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <p>No products available{locationFilter ? " in your area" : ""}.</p>
              {locationFilter && (
                <button onClick={toggleLocationFilter} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Show all products
                </button>
              )}
            </div>
          ) : (
            <>
              <p style={{ color: "#666", marginBottom: "1rem" }}>
                {products.length} product{products.length !== 1 ? "s" : ""} found
                {locationFilter && userLocation && ` near ${userLocation.city || "your location"}`}
              </p>
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {product.image && getProductImageUrl(product.image) ? (
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none"
                            e.target.nextSibling.style.display = "block"
                          }}
                        />
                      ) : null}
                      <span style={{ fontSize: "3rem", display: product.image && getProductImageUrl(product.image) ? "none" : "block" }}>
                        {getProductIcon(product.productType)}
                      </span>
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="seller-name">by {product.seller}</p>
                      
                      {product.shop && (
                        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                          📍 {product.shop.city}, {product.shop.state}
                        </p>
                      )}

                      {product.powerCapacity && (
                        <p style={{ fontSize: "0.9rem", color: "#1976d2", marginTop: "0.5rem" }}>
                          ⚡ {product.powerCapacity}
                        </p>
                      )}

                      {product.warranty && (
                        <div className="product-warranty">
                          <span>🛡️ {product.warranty} warranty</span>
                        </div>
                      )}

                      {product.stockQuantity !== undefined && (
                        <p style={{ fontSize: "0.85rem", color: product.stockQuantity > 0 ? "#4CAF50" : "#d32f2f", marginTop: "0.5rem" }}>
                          {product.stockQuantity > 0 ? `✓ In Stock (${product.stockQuantity})` : "✗ Out of Stock"}
                        </p>
                      )}

                      <div className="product-price">
                        ₹{product.price.toLocaleString()}
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          
                          if (product.stockQuantity === 0) {
                            alert("This product is out of stock")
                            return
                          }

                          // Validate product has required fields
                          if (!product._id || !product.price) {
                            console.error("Product missing required fields:", product)
                            alert("Error: Product data is incomplete. Please refresh the page.")
                            return
                          }

                          console.log("Adding product to cart:", product)
                          addToCart(product)
                          
                          // Show success feedback
                          setTimeout(() => {
                            const currentCart = JSON.parse(localStorage.getItem("buyerCart") || "[]")
                            const count = currentCart.reduce((sum, item) => sum + (item.quantity || 1), 0)
                            console.log(`Product added! Cart now has ${count} items`)
                          }, 100)
                        }}
                        disabled={product.stockQuantity === 0}
                        style={{ opacity: product.stockQuantity === 0 ? 0.5 : 1, cursor: product.stockQuantity === 0 ? "not-allowed" : "pointer" }}
                      >
                        {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
