const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const auth = require("../middleware/auth")
const sellerOnly = require("../middleware/sellerOnly")
const {
  addProduct,
  getSellerProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController")

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads")
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP allowed"))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})

// All routes require seller authentication
router.use(auth)
router.use(sellerOnly)

// POST - Add new product (with optional image)
router.post("/", upload.single("productImage"), addProduct)

// GET - Get all seller's products
router.get("/", getSellerProducts)

// GET - Get specific product
router.get("/:productId", getProduct)

// PUT - Update product
router.put("/:productId", upload.single("productImage"), updateProduct)

// DELETE - Delete product
router.delete("/:productId", deleteProduct)

module.exports = router
