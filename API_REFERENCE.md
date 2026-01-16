# API Reference - Seller Dashboard Endpoints

## Base URL
```
http://localhost:5000/api
```

## Authentication
All seller endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## Authentication Endpoints

### Request OTP
```http
POST /seller/auth/request-otp
Content-Type: application/json

{
  "email": "seller@example.com"
}

Response 200:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
```http
POST /seller/auth/verify-otp
Content-Type: application/json

{
  "email": "seller@example.com",
  "otp": "123456"
}

Response 200:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "shopProfileCompleted": false
}
```

---

## Shop Setup Endpoints

### Complete Shop Setup
```http
POST /seller/shop/setup
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "shopName": "Solar Solutions PVT",
  "shopType": "installer",
  "shopDescription": "Professional solar installation...",
  "serviceArea": "Chennai, Tamil Nadu",
  "ownerName": "John Doe",
  "ownerMobile": "9876543210",
  "ownerEmail": "john@solar.com",
  "shopAddress": "123 Main Street",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "pincode": "600001",
  "businessType": "partnership",
  "gstNumber": "27AABCU1234B1Z0",
  "idProofType": "aadhar",
  "idProofNumber": "123456789012",
  "sellSolarPanels": "yes",
  "offersInstallation": "yes",
  "installationTypes": ["rooftop", "ground-mounted"],
  "capacityRangeMin": "1",
  "capacityRangeMax": "10",
  "pricePerKw": "45000",
  "installationCharge": "5000",
  "siteVisitCharge": "500",
  "bankAccountHolder": "John Doe",
  "accountNumber": "1234567890123456",
  "ifscCode": "SBIN0001234",
  "availabilityDays": "Monday-Saturday",
  "responseTime": "24 hours",
  "acceptTerms": true
}

Response 201:
{
  "success": true,
  "message": "Shop setup completed successfully",
  "shop": { ...shop data... }
}
```

### Get Shop Status
```http
GET /seller/shop/status
Authorization: Bearer {TOKEN}

Response 200:
{
  "success": true,
  "shopExists": true,
  "shopProfileCompleted": true
}
```

### Get Shop Details
```http
GET /seller/shop
Authorization: Bearer {TOKEN}

Response 200:
{
  "success": true,
  "shop": { ...all shop fields... }
}
```

### Update Shop Details
```http
PUT /seller/shop
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "shopName": "Updated Shop Name",
  "pricePerKw": "48000",
  ...other fields to update...
}

Response 200:
{
  "success": true,
  "message": "Shop updated successfully",
  "shop": { ...updated shop data... }
}
```

---

## Product Management Endpoints

### Add New Product
```http
POST /seller/products
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data

Form Data:
- productName (string, required): "3kW Solar System"
- productType (string, required): "complete-system" | "solar-panel" | "inverter" | "battery" | "installation"
- brand (string): "Vikram Solar"
- powerCapacity (string): "3kW"
- panelType (string): "mono-perc" | "polycrystalline" | "bifacial"
- efficiency (number): 22.5
- price (number, required): 150000
- installationIncluded (string): "yes" | "no"
- installationCharge (number): 5000 (if not included)
- siteVisitCharge (number): 500
- installationAvailable (string): "yes" | "no"
- installationType (json array): ["rooftop", "ground-mounted"]
- installationArea (string): "residential"
- estimatedInstallationTime (string): "2-3 days"
- stockQuantity (number, required): 10
- productWarranty (number): 25 (years)
- performanceWarranty (number): 5 (years)
- afterSalesSupport (string): "yes" | "no"
- returnAvailable (string): "yes" | "no"
- replacementAvailable (string): "yes" | "no"
- productImage (file): image file (JPEG, PNG, GIF, WebP, max 5MB)

Response 201:
{
  "success": true,
  "message": "Product added successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "productName": "3kW Solar System",
    "price": 150000,
    "stockQuantity": 10,
    "productImage": "/uploads/productImage-1234567890.jpg",
    ...
  }
}

Error 400:
{
  "success": false,
  "message": "Missing required fields: productName, productType, price, stockQuantity"
}

Error 500:
{
  "success": false,
  "message": "Error adding product",
  "error": "error details"
}
```

### Get All Products
```http
GET /seller/products
Authorization: Bearer {TOKEN}

Response 200:
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "productName": "3kW Solar System",
      "productType": "complete-system",
      "brand": "Vikram Solar",
      "price": 150000,
      "stockQuantity": 10,
      "productImage": "/uploads/productImage-1234567890.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      ...
    },
    ...more products...
  ]
}
```

### Get Single Product
```http
GET /seller/products/:productId
Authorization: Bearer {TOKEN}

Parameters:
- productId: MongoDB ObjectId (from products list)

Response 200:
{
  "success": true,
  "product": { ...complete product data... }
}

Error 404:
{
  "success": false,
  "message": "Product not found"
}
```

### Update Product
```http
PUT /seller/products/:productId
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data

Form Data: (same as Add Product, all optional)
- productName (optional)
- price (optional)
- stockQuantity (optional)
- productImage (optional): new image file
- ...any other fields to update...

Response 200:
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ...updated product data... }
}

Error 404:
{
  "success": false,
  "message": "Product not found or unauthorized"
}
```

### Delete Product
```http
DELETE /seller/products/:productId
Authorization: Bearer {TOKEN}

Parameters:
- productId: MongoDB ObjectId

Response 200:
{
  "success": true,
  "message": "Product deleted successfully"
}

Error 404:
{
  "success": false,
  "message": "Product not found or unauthorized"
}
```

---

## Order Management Endpoints

### Get All Orders
```http
GET /seller/orders
Authorization: Bearer {TOKEN}

Response 200:
{
  "success": true,
  "orders": [
    {
      "_id": "607f1f77bcf86cd799439022",
      "seller": "507f1f77bcf86cd799439011",
      "buyer": "507f1f77bcf86cd799439012",
      "totalAmount": 150000,
      "status": "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
      "paymentStatus": "pending" | "completed" | "failed",
      "customerName": "Customer Name",
      "customerPhone": "9876543210",
      "customerEmail": "customer@example.com",
      "products": [
        {
          "product": { "productName": "3kW System", "price": 150000 },
          "quantity": 1,
          "subtotal": 150000
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    ...more orders...
  ]
}
```

### Get Single Order
```http
GET /seller/orders/:orderId
Authorization: Bearer {TOKEN}

Parameters:
- orderId: MongoDB ObjectId

Response 200:
{
  "success": true,
  "order": { ...complete order data with populated product details... }
}

Error 404:
{
  "success": false,
  "message": "Order not found"
}
```

### Update Order Status
```http
PUT /seller/orders/:orderId/status
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "status": "confirmed" | "shipped" | "delivered" | "cancelled"
}

Response 200:
{
  "success": true,
  "message": "Order status updated successfully",
  "order": { ...updated order data... }
}

Error 400:
{
  "success": false,
  "message": "Invalid status. Allowed values: pending, confirmed, shipped, delivered, cancelled"
}

Error 404:
{
  "success": false,
  "message": "Order not found or unauthorized"
}
```

### Get Order Statistics
```http
GET /seller/orders/stats
Authorization: Bearer {TOKEN}

Response 200:
{
  "success": true,
  "stats": {
    "totalOrders": 15,
    "pendingOrders": 3,
    "confirmedOrders": 5,
    "shippedOrders": 4,
    "deliveredOrders": 2,
    "cancelledOrders": 1,
    "totalRevenue": 2250000
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" | "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only sellers can access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product/Order not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "detailed error info"
}
```

---

## File Upload Requirements

### Product Image
- **Accepted Formats:** JPEG, PNG, GIF, WebP
- **Max Size:** 5MB
- **Storage:** `/server/public/uploads/`
- **URL Access:** `http://localhost:5000/uploads/{filename}`
- **Field Name:** `productImage`

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not seller) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Server Error |

---

## Request Headers

All requests should include:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json (or multipart/form-data for file upload)
```

---

## Example cURL Commands

### Add Product
```bash
curl -X POST http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "productName=3kW System" \
  -F "productType=complete-system" \
  -F "price=150000" \
  -F "stockQuantity=10" \
  -F "productImage=@image.jpg"
```

### Get Products
```bash
curl -X GET http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Update Order Status
```bash
curl -X PUT http://localhost:5000/api/seller/orders/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{"status":"shipped"}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/seller/products/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Rate Limiting
Currently not implemented. For production, implement rate limiting to prevent API abuse.

---

**Last Updated:** 2024
**API Version:** 1.0
