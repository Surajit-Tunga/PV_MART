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

module.exports = app
