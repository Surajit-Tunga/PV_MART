const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// Serve public/uploads folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))

// Routes
app.use("/api/auth", require("./routes/authRoutes"))

app.get("/", (req, res) => res.send("PV Mart API Running"))
app.use("/api/seller/auth", require("./routes/sellerAuthRoutes"))
app.use("/api/seller/shop", require("./routes/sellerShopRoutes"))
app.use("/api/seller/products", require("./routes/productRoutes"))
app.use("/api/seller/orders", require("./routes/orderRoutes"))

// Buyer routes
app.use("/api/buyer/products", require("./routes/buyerProductRoutes"))
app.use("/api/buyer/cart", require("./routes/cartRoutes"))
app.use("/api/buyer/orders", require("./routes/buyerOrderRoutes"))
app.use("/api/buyer/place-order", require("./routes/placeOrderRoutes"))
app.use("/api/buyer/place-order", require("./routes/placeOrderRoutes"))

// Admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

// Payment routes
app.use("/api/payment", require("./routes/paymentRoutes"));

module.exports = app
