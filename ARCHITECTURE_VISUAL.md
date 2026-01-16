# Seller Dashboard - Visual Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PV MART SELLER SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐    ┌──────────────────────────────┐
│      CLIENT (React)              │    │    SERVER (Node.js)          │
│                                  │    │                              │
│  SellerDashboard.jsx             │    │  Express App                 │
│  ├─ Header (Logout)              │    │  ├─ Auth Routes             │
│  ├─ Overview Tab                 │    │  ├─ Shop Routes             │
│  │  └─ Statistics Widget         │───────→ ├─ Product Routes        │
│  │                               │    │  │  └─ Order Routes         │
│  ├─ Products Tab                 │    │  │                          │
│  │  ├─ Add Product Form          │───────→ ├─ productController     │
│  │  ├─ Product List              │    │  │  └─ Multer Upload       │
│  │  └─ Edit/Delete Actions       │    │  │                          │
│  │                               │    │  └─ orderController         │
│  └─ Orders Tab                   │───────→                          │
│     ├─ Orders Table              │    │                              │
│     └─ Status Badges             │    │                              │
│                                  │    │                              │
│  api.js (Axios)                  │    │  Models                     │
│  └─ Bearer Token Injection       │───────→ ├─ Product.js (48 fields)│
│                                  │    │  ├─ Order.js                │
└──────────────────────────────────┘    │  ├─ User.js                 │
                                        │  └─ SellerShop.js           │
                                        │                              │
                                        │  MongoDB                    │
                                        │  ├─ products collection     │
                                        │  ├─ orders collection       │
                                        │  └─ users collection        │
                                        │                              │
                                        │  File Storage               │
                                        │  └─ /public/uploads/        │
                                        └──────────────────────────────┘

                                    │
                            localhost:5000
                                    │
```

---

## User Journey / Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SELLER USER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

1. LANDING
   ┌──────────────────────┐
   │  /seller             │
   │  Landing Page        │
   │  [Sell on PV Mart]   │
   └──────┬───────────────┘
          │
          ▼
2. AUTHENTICATION
   ┌──────────────────────┐
   │  /seller/login       │
   │  Request OTP         │
   │  Email Verification  │
   │  Verify OTP          │
   │  Get JWT Token       │
   └──────┬───────────────┘
          │
          ├─────────────────────────┬────────────────────────┐
          │                         │                        │
       (New?)                   (Exists?)               (Exists + Setup?)
          │                         │                        │
          ▼                         ▼                        ▼
3. SETUP SHOP          4. SETUP SHOP          5. DASHBOARD
   /seller/setup-shop      /seller/setup-shop      /seller/dashboard
   └──┬────────────────────┘                       │
      │                                            │
      └─────────────────────────┬──────────────────┘
                                │
                                ▼
                    ┌────────────────────────────┐
                    │    SELLER DASHBOARD        │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ OVERVIEW TAB         │  │
                    │  │ • Total Products     │  │
                    │  │ • Total Orders       │  │
                    │  │ • Total Revenue      │  │
                    │  └──────────────────────┘  │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ PRODUCTS TAB         │  │
                    │  │ • [+ Add Product]    │  │
                    │  │ • Product List       │  │
                    │  │   - Name, Type, $    │  │
                    │  │   - Edit | Delete    │  │
                    │  └──────────────────────┘  │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ ORDERS TAB           │  │
                    │  │ • Order List         │  │
                    │  │   - ID, Customer, $  │  │
                    │  │   - Status (badge)   │  │
                    │  └──────────────────────┘  │
                    │                            │
                    │  [Logout]                  │
                    └────────────────────────────┘
```

---

## Product Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            PRODUCT MANAGEMENT WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

ADD PRODUCT
───────────
User Input Form (8 sections, 30+ fields)
        │
        ▼
Form Validation
        │
        ├─ Required fields check
        ├─ Image file validation (type, size)
        └─ Price/Stock numeric validation
        │
        ▼
FormData Construction
        │
        ├─ Form fields (JSON)
        └─ Image file (multipart)
        │
        ▼
API POST /api/seller/products
        │
        ├─ Multer File Upload (5MB limit)
        ├─ Product validation (Mongoose)
        └─ Database insert
        │
        ▼
Response
        │
        ├─ Success → Alert + Form Reset
        └─ Error → Display Error Message
        │
        ▼
Auto-Refresh Product List
        │
        └─ Products table updates


EDIT PRODUCT
────────────
User Clicks [Edit]
        │
        ▼
Form Pre-fills with Product Data
        │
        ├─ productName: "3kW Solar System"
        ├─ price: 150000
        ├─ stockQuantity: 10
        └─ ...other fields...
        │
        ▼
User Modifies Fields
        │
        ▼
Click [Update Product]
        │
        ▼
API PUT /api/seller/products/:id
        │
        ├─ Delete old image (if new one provided)
        ├─ Upload new image
        └─ Update product in database
        │
        ▼
Response
        │
        ├─ Success → Alert + List refresh
        └─ Error → Display Error Message


DELETE PRODUCT
──────────────
User Clicks [Delete]
        │
        ▼
Confirmation Dialog
        │
        ├─ Confirm → Proceed
        └─ Cancel → Abort
        │
        ▼
API DELETE /api/seller/products/:id
        │
        ├─ Delete from database
        ├─ Delete image file from disk
        └─ Return success
        │
        ▼
Product Removed from Table
```

---

## Order Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│            ORDER MANAGEMENT WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

VIEW ORDERS
───────────
User Clicks "Orders" Tab
        │
        ▼
API GET /api/seller/orders
        │
        ├─ Query: find all orders where seller = current user
        ├─ Populate: buyer details, product details
        └─ Sort: by createdAt descending
        │
        ▼
Orders Table Display
        │
        ├─ Order ID (shortened)
        ├─ Customer Name
        ├─ Total Amount (₹)
        ├─ Status (color badge)
        │  ├─ pending (yellow)
        │  ├─ confirmed (blue)
        │  ├─ shipped (blue)
        │  ├─ delivered (green)
        │  └─ cancelled (red)
        └─ Order Date


UPDATE STATUS
──────────────
User Clicks Status Badge
        │
        ▼
Status Dropdown/Selection
        │
        ├─ pending
        ├─ confirmed
        ├─ shipped
        ├─ delivered
        └─ cancelled
        │
        ▼
API PUT /api/seller/orders/:id/status
        │
        └─ Update order status in database
        │
        ▼
List Refreshes with New Status
```

---

## Product Form Structure

```
┌──────────────────────────────────────────────────────────────────┐
│               PRODUCT FORM (30+ FIELDS)                          │
└──────────────────────────────────────────────────────────────────┘

SECTION 1: BASIC INFO
├─ Product Name* (text, required)
├─ Product Type* (dropdown, required)
│  ├─ Solar Panel
│  ├─ Inverter
│  ├─ Battery
│  ├─ Complete System
│  └─ Installation
├─ Brand Name (text)
└─ Power Capacity (text, e.g., "3kW")

SECTION 2: TECHNICAL SPECS
├─ Panel Type (dropdown)
│  ├─ Mono PERC
│  ├─ Polycrystalline
│  └─ Bifacial
├─ Efficiency (%) (number)
└─ Installation Available (yes/no)

SECTION 3: PRICING
├─ Price (₹)* (number, required)
├─ Installation Included (yes/no)
├─ Installation Charge (₹) [conditional]
└─ Site Visit Charge (₹) [optional]

SECTION 4: INSTALLATION
├─ Installation Area (text)
├─ Estimated Time (text, e.g., "2-3 days")
└─ Installation Types (multi-select)

SECTION 5: STOCK
└─ Stock Quantity* (number, required)

SECTION 6: WARRANTY
├─ Product Warranty (years)
└─ Performance Warranty (years)

SECTION 7: SUPPORT & POLICIES
├─ After-sales Support (checkbox)
├─ Return Available (checkbox)
└─ Replacement Available (checkbox)

SECTION 8: MEDIA
└─ Product Image (file upload, 5MB max)

BUTTONS
├─ [Add/Update Product] (blue, primary)
└─ [Cancel] (gray) [only when editing]
```

---

## API Request/Response Examples

```
ADD PRODUCT REQUEST
───────────────────
POST /api/seller/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: multipart/form-data

productName: "3kW Solar Panel System"
productType: "complete-system"
brand: "Vikram Solar"
powerCapacity: "3kW"
panelType: "mono-perc"
efficiency: "22.5"
price: "150000"
installationIncluded: "no"
installationCharge: "5000"
siteVisitCharge: "500"
stockQuantity: "10"
productWarranty: "25"
performanceWarranty: "5"
afterSalesSupport: "yes"
returnAvailable: "no"
replacementAvailable: "no"
productImage: [binary image data]


ADD PRODUCT RESPONSE
────────────────────
{
  "success": true,
  "message": "Product added successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "seller": "507f1f77bcf86cd799439010",
    "productName": "3kW Solar Panel System",
    "price": 150000,
    "stockQuantity": 10,
    "productImage": "/uploads/productImage-1234567890.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}


GET ORDERS RESPONSE
───────────────────
{
  "success": true,
  "orders": [
    {
      "_id": "607f1f77bcf86cd799439022",
      "customerName": "Raj Kumar",
      "totalAmount": 150000,
      "status": "confirmed",
      "createdAt": "2024-01-14T15:20:00Z",
      "products": [
        {
          "product": { "productName": "3kW System" },
          "quantity": 1,
          "price": 150000
        }
      ]
    },
    ...more orders...
  ]
}
```

---

## Database Structure

```
PRODUCTS COLLECTION
───────────────────
{
  _id: ObjectId,
  seller: ObjectId → User,
  productName: String,
  productType: String (enum),
  price: Number,
  stockQuantity: Number,
  brand: String,
  powerCapacity: String,
  panelType: String,
  efficiency: Number,
  productWarranty: Number,
  performanceWarranty: Number,
  afterSalesSupport: String,
  returnAvailable: String,
  replacementAvailable: String,
  productImage: String (path),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - seller (for quick lookup)
  - createdAt (for sorting)


ORDERS COLLECTION
─────────────────
{
  _id: ObjectId,
  seller: ObjectId → User,
  buyer: ObjectId → User,
  products: [
    {
      product: ObjectId → Product,
      quantity: Number,
      price: Number,
      subtotal: Number
    }
  ],
  totalAmount: Number,
  status: String (enum),
  paymentStatus: String,
  customerName: String,
  customerEmail: String,
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
  - seller (for quick lookup)
  - createdAt (for sorting)
```

---

## File Upload Process

```
CLIENT SIDE
───────────
User selects image
        │
        ▼
File validation
├─ Type check (JPEG, PNG, GIF, WebP)
└─ Size check (< 5MB)
        │
        ▼
File added to FormData
        │
        ▼
POST /api/seller/products
Content-Type: multipart/form-data
        │


SERVER SIDE
───────────
        ▼
Multer middleware
├─ Intercepts file
├─ Validates MIME type
├─ Checks file size
└─ Saves to disk
        │
        ▼
Generate unique filename
├─ Original name: photo.jpg
├─ Generated: productImage-1234567890.jpg
└─ Path: /public/uploads/productImage-1234567890.jpg
        │
        ▼
Database stores relative path
├─ productImage: "/uploads/productImage-1234567890.jpg"
        │
        ▼
Express serves file
├─ app.use("/uploads", express.static(...))
└─ Accessible via HTTP: /uploads/productImage-1234567890.jpg
        │
        ▼
Frontend displays
        │
        └─ img src="/uploads/productImage-1234567890.jpg"
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────┐
│             SECURITY IMPLEMENTATION                  │
└──────────────────────────────────────────────────────┘

LAYER 1: AUTHENTICATION
────────────────────────
OTP Email Login
    ├─ Email verification
    ├─ Time-limited OTP (5 min)
    └─ One-time use

JWT Token
    ├─ Generated after OTP verification
    ├─ Stored in localStorage
    └─ Expires after set time


LAYER 2: API AUTHORIZATION
──────────────────────────
Middleware Chain
    ├─ authMiddleware (check token exists)
    ├─ verifyToken (validate JWT)
    └─ sellerOnlyMiddleware (check role)

Authorization Header
    └─ Authorization: Bearer {token}


LAYER 3: FILE UPLOAD VALIDATION
───────────────────────────────
Multer Configuration
    ├─ File type whitelist
    │  └─ JPEG, PNG, GIF, WebP only
    ├─ Size limit
    │  └─ 5MB maximum
    ├─ Filename generation
    │  └─ Unique timestamp-based names
    └─ Directory permissions
       └─ /public/uploads only


LAYER 4: DATA ACCESS CONTROL
────────────────────────────
Database Queries
    ├─ Products: filter by seller ID
    ├─ Orders: filter by seller ID
    └─ No cross-seller data exposure


LAYER 5: INPUT VALIDATION
─────────────────────────
Frontend Validation
    ├─ Required fields check
    ├─ Type validation
    └─ Format validation

Backend Validation
    ├─ Mongoose schema validation
    ├─ Business logic checks
    └─ Error responses
```

---

## Component Hierarchy

```
SellerApp
├─ /
│  └─ SellerLanding
├─ /login
│  └─ SellerLogin
├─ /setup-shop
│  └─ SellerSetupShop
└─ /dashboard
   └─ SellerDashboard
      ├─ Header (Logout button)
      ├─ Shop Setup Warning (conditional)
      ├─ Tab Navigation
      ├─ Overview Tab
      │  └─ Statistics Widget
      ├─ Products Tab
      │  ├─ Add Product Button
      │  ├─ AddProductForm (conditional)
      │  └─ Products Table
      └─ Orders Tab
         └─ Orders Table
```

---

## State Management

```
SellerDashboard Component State
────────────────────────────────
const [activeTab, setActiveTab] = useState("overview")
const [shopSetupDone, setShopSetupDone] = useState(false)
const [products, setProducts] = useState([])
const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [showAddProduct, setShowAddProduct] = useState(false)
const [editingProduct, setEditingProduct] = useState(null)

AddProductForm Component State
──────────────────────────────
const [formData, setFormData] = useState({...30 fields...})
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")
const [editingId, setEditingId] = useState(null)
```

---

## Deployment Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────┘

CLIENT
├─ React build optimized
├─ Served via Vercel/Netlify
└─ Environment: REACT_APP_API_URL=https://api.pvmart.com

SERVER
├─ Node.js with PM2
├─ Hosted on AWS EC2/Heroku/DigitalOcean
└─ Environment: MONGO_URI, JWT_SECRET

DATABASE
├─ MongoDB Atlas (cloud)
└─ Backup & replication enabled

FILE STORAGE
├─ AWS S3 or Cloudinary
└─ CDN for fast image delivery

SECURITY
├─ HTTPS/SSL certificates
├─ CORS configured for production domain
├─ Rate limiting enabled
└─ Input validation on both sides
```

---

**This visual architecture summarizes the complete seller dashboard system!**
