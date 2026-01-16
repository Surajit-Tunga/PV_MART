import React, { useState, useEffect } from "react"
import { API } from "../services/api"

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [shopSetupDone, setShopSetupDone] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkShopStatus = async () => {
      try {
        const res = await API.get("/api/seller/shop/status")
        setShopSetupDone(res.data.shopProfileCompleted)
      } catch (error) {
        console.error("Error checking shop status:", error)
      }
      setLoading(false)
    }

    checkShopStatus()
  }, [])

  // Fetch products when products tab is opened
  useEffect(() => {
    if (activeTab === "products" && shopSetupDone) {
      fetchProducts()
    }
  }, [activeTab, shopSetupDone])

  // Fetch orders when orders tab is opened
  useEffect(() => {
    if (activeTab === "orders" && shopSetupDone) {
      fetchOrders()
    }
  }, [activeTab, shopSetupDone])

  const fetchProducts = async () => {
    try {
      setError("")
      const res = await API.get("/api/seller/products")
      setProducts(res.data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      const errorMsg = error.response?.data?.message || error.message
      setError(`Error fetching products: ${errorMsg}`)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        location.href = "/seller/login"
      }
    }
  }

  const fetchOrders = async () => {
    try {
      setError("")
      const res = await API.get("/api/seller/orders")
      setOrders(res.data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      const errorMsg = error.response?.data?.message || error.message
      setError(`Error fetching orders: ${errorMsg}`)
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.")
        location.href = "/seller/login"
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    location.href = "/seller"
  }

  const handleSetupShop = () => {
    location.href = "/seller/setup-shop"
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowAddProduct(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/api/seller/products/${productId}`)
        alert("Product deleted successfully!")
        fetchProducts()
      } catch (error) {
        alert("Error deleting product: " + (error.response?.data?.message || error.message))
      }
    }
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e0e0e0"
  }

  const logoutButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }

  const tabButtonStyle = (isActive) => ({
    padding: "10px 20px",
    marginRight: "10px",
    backgroundColor: isActive ? "#007bff" : "#f0f0f0",
    color: isActive ? "white" : "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: isActive ? "bold" : "normal"
  })

  const containerStyle = { padding: "20px", fontFamily: "Arial, sans-serif" }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Seller Dashboard</h1>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {!shopSetupDone && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #ffc107"
          }}
        >
          <p>
            <strong>⚠️ Complete Your Shop Setup!</strong> You need to set up your
            shop before you can add and sell products.
          </p>
          <button
            onClick={handleSetupShop}
            style={{
              backgroundColor: "#ffc107",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Set Up Shop Now
          </button>
        </div>
      )}

      <div style={{ marginBottom: "20px", borderBottom: "2px solid #ddd" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={tabButtonStyle(activeTab === "overview")}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("products")}
          disabled={!shopSetupDone}
          style={{
            ...tabButtonStyle(activeTab === "products"),
            opacity: shopSetupDone ? 1 : 0.5,
            cursor: shopSetupDone ? "pointer" : "not-allowed"
          }}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          disabled={!shopSetupDone}
          style={{
            ...tabButtonStyle(activeTab === "orders"),
            opacity: shopSetupDone ? 1 : 0.5,
            cursor: shopSetupDone ? "pointer" : "not-allowed"
          }}
        >
          Orders
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <h2>Dashboard Overview</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginTop: "20px"
            }}
          >
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              <h3>Total Products</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>{products.length}</p>
            </div>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              <h3>Total Orders</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>{orders.length}</p>
            </div>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              <h3>Total Revenue</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹0</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && shopSetupDone && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2>Manage Products</h2>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {showAddProduct ? "Cancel" : "+ Add New Product"}
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb"
            }}>
              {error}
            </div>
          )}

          {showAddProduct && <AddProductForm onProductAdded={() => {
            setShowAddProduct(false)
            setEditingProduct(null)
            fetchProducts()
          }} editingProduct={editingProduct} />}

          {products.length === 0 ? (
            <div
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              <p>No products added yet. Start by adding your first product!</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Product Name</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Type</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Price</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Stock</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>{product.productName}</td>
                      <td style={{ padding: "10px" }}>{product.productType}</td>
                      <td style={{ padding: "10px" }}>₹{product.price}</td>
                      <td style={{ padding: "10px" }}>{product.stockQuantity}</td>
                      <td style={{ padding: "10px" }}>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          style={{ padding: "5px 10px", marginRight: "5px", cursor: "pointer", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "3px" }}>
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && shopSetupDone && (
        <div>
          <h2>Your Orders</h2>
          {error && (
            <div style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb"
            }}>
              {error}
            </div>
          )}
          {orders.length === 0 ? (
            <div
              style={{
                backgroundColor: "#f0f0f0",
                padding: "20px",
                borderRadius: "5px",
                textAlign: "center"
              }}
            >
              <p>No orders yet. Keep your shop updated to get orders!</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Order ID</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Customer</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Amount</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Status</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>{order._id.substring(0, 8)}...</td>
                      <td style={{ padding: "10px" }}>{order.customerName || order.buyer?.name || "N/A"}</td>
                      <td style={{ padding: "10px" }}>₹{order.totalAmount}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{
                          padding: "5px 10px",
                          borderRadius: "3px",
                          backgroundColor: order.status === "delivered" ? "#d4edda" : 
                                           order.status === "cancelled" ? "#f8d7da" :
                                           order.status === "confirmed" ? "#cfe2ff" : "#fff3cd",
                          color: order.status === "delivered" ? "#155724" :
                                 order.status === "cancelled" ? "#721c24" :
                                 order.status === "confirmed" ? "#084298" : "#664d03"
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AddProductForm({ onProductAdded, editingProduct }) {
  const initialFormData = {
    productName: "",
    productType: "",
    brand: "",
    powerCapacity: "",
    panelType: "",
    efficiency: "",
    price: "",
    installationIncluded: "no",
    installationCharge: "",
    siteVisitCharge: "",
    installationAvailable: "yes",
    installationType: [],
    installationArea: "",
    estimatedInstallationTime: "",
    stockQuantity: "",
    productWarranty: "",
    performanceWarranty: "",
    afterSalesSupport: "yes",
    returnAvailable: "no",
    replacementAvailable: "no",
    productImage: null
  }

  const [formData, setFormData] = useState(editingProduct ? {
    productName: editingProduct.productName || "",
    productType: editingProduct.productType || "",
    brand: editingProduct.brand || "",
    powerCapacity: editingProduct.powerCapacity || "",
    panelType: editingProduct.panelType || "",
    efficiency: editingProduct.efficiency || "",
    price: editingProduct.price || "",
    installationIncluded: editingProduct.installationIncluded || "no",
    installationCharge: editingProduct.installationCharge || "",
    siteVisitCharge: editingProduct.siteVisitCharge || "",
    installationAvailable: editingProduct.installationAvailable || "yes",
    installationType: editingProduct.installationType || [],
    installationArea: editingProduct.installationArea || "",
    estimatedInstallationTime: editingProduct.estimatedInstallationTime || "",
    stockQuantity: editingProduct.stockQuantity || "",
    productWarranty: editingProduct.productWarranty || "",
    performanceWarranty: editingProduct.performanceWarranty || "",
    afterSalesSupport: editingProduct.afterSalesSupport || "yes",
    returnAvailable: editingProduct.returnAvailable || "no",
    replacementAvailable: editingProduct.replacementAvailable || "no",
    productImage: null
  } : initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(editingProduct?._id || null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox" && name === "installationType") {
      setFormData((prev) => ({
        ...prev,
        installationType: checked
          ? [...prev.installationType, value]
          : prev.installationType.filter((item) => item !== value)
      }))
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (key === "installationType") {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else if (key === "productImage" && formData[key]) {
          formDataToSend.append(key, formData[key])
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      if (editingId) {
        // Update existing product
        await API.put(`/api/seller/products/${editingId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        alert("Product updated successfully!")
        setEditingId(null)
      } else {
        // Create new product
        await API.post("/api/seller/products", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        alert("Product added successfully!")
      }

      // Reset form
      setFormData({
        productName: "",
        productType: "",
        brand: "",
        powerCapacity: "",
        panelType: "",
        efficiency: "",
        price: "",
        installationIncluded: "no",
        installationCharge: "",
        siteVisitCharge: "",
        installationAvailable: "yes",
        installationType: [],
        installationArea: "",
        estimatedInstallationTime: "",
        stockQuantity: "",
        productWarranty: "",
        performanceWarranty: "",
        afterSalesSupport: "yes",
        returnAvailable: "no",
        replacementAvailable: "no",
        productImage: null
      })
      onProductAdded()
    } catch (err) {
      setError(err.response?.data?.message || "Error saving product")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" }
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }
  const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }

  return (
    <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px", marginBottom: "20px" }}>
      <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required style={inputStyle} placeholder="e.g., 3kW Rooftop Solar System" />
          </div>

          <div>
            <label style={labelStyle}>Product Type *</label>
            <select name="productType" value={formData.productType} onChange={handleChange} required style={inputStyle}>
              <option value="">Select Type</option>
              <option value="solar-panel">Solar Panel</option>
              <option value="inverter">Inverter</option>
              <option value="battery">Battery</option>
              <option value="complete-system">Complete Solar System</option>
              <option value="installation">Installation Service</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Brand Name</label>
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Power Capacity (e.g., 1kW, 3kW, 5kW)</label>
            <input type="text" name="powerCapacity" value={formData.powerCapacity} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Panel Type</label>
            <select name="panelType" value={formData.panelType} onChange={handleChange} style={inputStyle}>
              <option value="">Select Panel Type</option>
              <option value="mono-perc">Mono PERC</option>
              <option value="polycrystalline">Polycrystalline</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Efficiency (%) (optional)</label>
            <input type="number" name="efficiency" value={formData.efficiency} onChange={handleChange} style={inputStyle} step="0.1" />
          </div>

          <div>
            <label style={labelStyle}>Price (₹) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} min="0" />
          </div>

          <div>
            <label style={labelStyle}>Installation Included?</label>
            <select name="installationIncluded" value={formData.installationIncluded} onChange={handleChange} style={inputStyle}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {formData.installationIncluded === "no" && (
            <>
              <div>
                <label style={labelStyle}>Installation Charge (₹)</label>
                <input type="number" name="installationCharge" value={formData.installationCharge} onChange={handleChange} style={inputStyle} min="0" />
              </div>

              <div>
                <label style={labelStyle}>Site Visit Charge (₹) (optional)</label>
                <input type="number" name="siteVisitCharge" value={formData.siteVisitCharge} onChange={handleChange} style={inputStyle} min="0" />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Stock Quantity *</label>
            <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required style={inputStyle} min="0" />
          </div>

          <div>
            <label style={labelStyle}>Product Warranty (Years)</label>
            <input type="number" name="productWarranty" value={formData.productWarranty} onChange={handleChange} style={inputStyle} min="0" />
          </div>

          <div>
            <label style={labelStyle}>Performance Warranty (Years)</label>
            <input type="number" name="performanceWarranty" value={formData.performanceWarranty} onChange={handleChange} style={inputStyle} min="0" />
          </div>

          <div>
            <label style={labelStyle}>Estimated Installation Time</label>
            <input type="text" name="estimatedInstallationTime" value={formData.estimatedInstallationTime} onChange={handleChange} style={inputStyle} placeholder="e.g., 2-3 days" />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={labelStyle}>
            <input type="checkbox" name="afterSalesSupport" checked={formData.afterSalesSupport === "yes"} onChange={(e) => setFormData({ ...formData, afterSalesSupport: e.target.checked ? "yes" : "no" })} />
            After-sales Support Available
          </label>

          <label style={labelStyle}>
            <input type="checkbox" name="returnAvailable" checked={formData.returnAvailable === "yes"} onChange={(e) => setFormData({ ...formData, returnAvailable: e.target.checked ? "yes" : "no" })} />
            Return Available
          </label>

          <label style={labelStyle}>
            <input type="checkbox" name="replacementAvailable" checked={formData.replacementAvailable === "yes"} onChange={(e) => setFormData({ ...formData, replacementAvailable: e.target.checked ? "yes" : "no" })} />
            Replacement Available
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <label style={labelStyle}>Product Image</label>
          <input type="file" name="productImage" onChange={handleChange} style={inputStyle} accept="image/*" />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (editingId ? "Updating Product..." : "Adding Product...") : (editingId ? "Update Product" : "Add Product")}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setFormData({
                productName: "",
                productType: "",
                brand: "",
                powerCapacity: "",
                panelType: "",
                efficiency: "",
                price: "",
                installationIncluded: "no",
                installationCharge: "",
                siteVisitCharge: "",
                installationAvailable: "yes",
                installationType: [],
                installationArea: "",
                estimatedInstallationTime: "",
                stockQuantity: "",
                productWarranty: "",
                performanceWarranty: "",
                afterSalesSupport: "yes",
                returnAvailable: "no",
                replacementAvailable: "no",
                productImage: null
              })
            }}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  )
}

