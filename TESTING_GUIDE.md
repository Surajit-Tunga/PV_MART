# Testing Guide - Seller Dashboard Features

## Prerequisites
1. Server running: `npm start` in `/server` folder
2. Client running: `npm run dev` in `/client` folder
3. MongoDB connected
4. Browser DevTools open (for debugging)

---

## Test Scenario 1: Seller Authentication & Dashboard Access

### Steps:
1. Navigate to `http://localhost:5173/seller`
2. Click "Sell on PV Mart" button → Should go to `/seller/login`
3. Enter email and click "Send OTP"
4. Check server logs for OTP (currently logs to console in development)
5. Enter OTP and click "Verify"
6. Should receive JWT token and redirect based on shop setup status

### Expected Results:
- ✅ Token saved in localStorage
- ✅ Redirects to `/seller/setup-shop` if first time
- ✅ Redirects to `/seller/dashboard` if shop already setup
- ✅ Console shows "OTP sent successfully" or error message

---

## Test Scenario 2: Complete Shop Setup

### Steps (if not already done):
1. On setup page, fill out all 9 sections:
   - Shop Details (name, type, description, area)
   - Owner Contact (name, mobile, email)
   - Address (street, city, state, zip)
   - Business Verification (type, GST, ID proof)
   - Services (solar Y/N, installation Y/N)
   - Pricing (price/kW, installation charge)
   - Payment (account details)
   - Availability (days, response time)
   - Agreement (checkbox)
2. Click "Complete Setup"
3. Should redirect to dashboard

### Expected Results:
- ✅ All data saved to database
- ✅ User's `shopProfileCompleted` flag set to true
- ✅ Redirect to dashboard
- ✅ No warning banner on dashboard

---

## Test Scenario 3: Add Product

### Steps:
1. On Dashboard, click Products tab
2. Click "+ Add New Product" button
3. Fill out product form:
   - **Section 1:** 
     - Product Name: "3kW Solar Panel System"
     - Type: "complete-system"
     - Brand: "Vikram Solar"
     - Power Capacity: "3kW"
   - **Section 2:**
     - Panel Type: "mono-perc"
     - Efficiency: "22.5"
   - **Section 3:**
     - Price: "150000"
     - Installation Included: "Yes"
   - **Section 4:**
     - Stock: "10"
   - **Section 5:**
     - Product Warranty: "25"
     - Performance Warranty: "5"
   - **Section 6:**
     - Check "After-sales Support"
     - Uncheck "Return/Replacement"
   - **Section 7:**
     - Select a product image file
4. Click "Add Product" button

### Expected Results:
- ✅ Form submits without errors
- ✅ "Product added successfully!" alert appears
- ✅ Form clears/resets
- ✅ Product appears in products list immediately

### Expected Request in DevTools:
```
POST /api/seller/products
Content-Type: multipart/form-data
Authorization: Bearer {token}

{
  "productName": "3kW Solar Panel System",
  "productType": "complete-system",
  "brand": "Vikram Solar",
  "price": "150000",
  "stockQuantity": "10",
  ...
  [image file]
}
```

---

## Test Scenario 4: Edit Product

### Steps:
1. In Products tab, find the product you just added
2. Click "Edit" button
3. Change some fields:
   - Price: "145000"
   - Stock: "8"
   - Panel Type: "polycrystalline"
4. Click "Update Product"

### Expected Results:
- ✅ Form fills with current product data
- ✅ Submit button says "Update Product"
- ✅ "Product updated successfully!" alert
- ✅ Table updates with new values

---

## Test Scenario 5: Delete Product

### Steps:
1. In Products tab, find any product
2. Click "Delete" button
3. Confirm deletion in dialog
4. Should disappear from table

### Expected Results:
- ✅ Confirmation dialog appears
- ✅ Product removed from list
- ✅ Database entry deleted
- ✅ Associated image deleted from server

---

## Test Scenario 6: Product Image Upload

### Steps:
1. Add new product
2. In image section, upload a JPEG/PNG file
3. File should be accepted
4. Try uploading:
   - Too large file (>5MB) - should reject
   - Non-image file (.txt, .pdf) - should reject
   - Valid image file - should accept

### Expected Results:
- ✅ Valid images accepted
- ✅ Invalid files rejected with error
- ✅ File size limit enforced
- ✅ Image accessible at `/uploads/[filename]`

---

## Test Scenario 7: View Orders

### Steps:
1. Click Orders tab
2. Should see "No orders yet" message initially
3. (In production, orders would be created by buyers)
4. Once orders exist, should show:
   - Order ID (shortened)
   - Customer name
   - Amount
   - Status (with color badge)
   - Date

### Expected Results:
- ✅ Tab loads without errors
- ✅ API call to `/api/seller/orders` succeeds
- ✅ Orders display correctly
- ✅ Status badges show correct colors

---

## Test Scenario 8: Logout

### Steps:
1. On dashboard, click "Logout" button (top-right)
2. Should clear token and redirect to `/seller`

### Expected Results:
- ✅ Token removed from localStorage
- ✅ Redirect to seller landing page
- ✅ Cannot access dashboard without re-login

---

## Test Scenario 9: Form Validation

### Steps:
1. Try to add product without filling required fields:
   - Leave "Product Name" empty
   - Try to submit
2. Check each required field:
   - Product Name
   - Product Type
   - Price
   - Stock Quantity

### Expected Results:
- ✅ Form shows validation error
- ✅ Submit button disabled or error message
- ✅ Cannot submit with missing required fields

---

## Test Scenario 10: Error Handling

### Steps (for testing error scenarios):
1. **Network Error:**
   - Stop server
   - Try to add product
   - Should show error message

2. **Large Image:**
   - Upload image >5MB
   - Should reject with error

3. **Duplicate Product:**
   - Add same product twice (should be allowed)
   - Both should appear in list

### Expected Results:
- ✅ Graceful error messages
- ✅ No app crash
- ✅ User informed of what went wrong

---

## Database Verification

### Check Products Collection:
```bash
db.products.find({ seller: ObjectId("...") }).pretty()
```

Should return:
```javascript
{
  _id: ObjectId(...),
  seller: ObjectId(...),
  productName: "3kW Solar Panel System",
  productType: "complete-system",
  price: 150000,
  stockQuantity: 10,
  productImage: "/uploads/productImage-1234567890.jpg",
  ...
}
```

### Check Orders Collection:
```bash
db.orders.find({ seller: ObjectId("...") }).pretty()
```

Should return order documents with status, items, amounts, etc.

---

## API Manual Testing (Using Postman/cURL)

### Add Product:
```bash
curl -X POST http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer {TOKEN}" \
  -F "productName=3kW System" \
  -F "productType=complete-system" \
  -F "price=150000" \
  -F "stockQuantity=10" \
  -F "productImage=@/path/to/image.jpg"
```

### Get Products:
```bash
curl -X GET http://localhost:5000/api/seller/products \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Orders:
```bash
curl -X GET http://localhost:5000/api/seller/orders \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Common Issues & Solutions

### Issue: "401 Unauthorized"
- **Cause:** Token missing or expired
- **Fix:** Re-login to get fresh token

### Issue: "Product added but not visible in list"
- **Cause:** Page not refreshed after submission
- **Fix:** Dashboard auto-fetches on tab switch, or refresh page

### Issue: "Image upload fails"
- **Cause:** Invalid file type or size >5MB
- **Fix:** Use JPEG/PNG under 5MB

### Issue: "Form data not submitting"
- **Cause:** Missing required fields or server error
- **Fix:** Check form validation, check server logs

### Issue: "Orders tab shows error"
- **Cause:** Server not running or route missing
- **Fix:** Start server, check app.js has orderRoutes

---

## Performance Testing

### Check API Response Times:
1. Open DevTools → Network tab
2. Add a product and watch request time
3. Get products list and check response time
4. Expected: <200ms for GET, <500ms for POST with image

### Check Bundle Size:
1. No console warnings about missing files
2. All assets load without 404 errors
3. Image uploads complete without timeouts

---

## Browser Compatibility Testing

Test on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Check for:
- Form functionality
- Image upload
- Tab switching
- Button clicks

---

## Security Verification

- [ ] Token stored in localStorage (check DevTools Storage)
- [ ] Token sent with Authorization header (check Network tab)
- [ ] Cannot access routes without valid token (test with invalid token)
- [ ] Seller can only see their own products/orders (test with 2 accounts)
- [ ] File uploads validated on client and server

---

## Completion Checklist

- [ ] Seller authentication works (OTP flow)
- [ ] Dashboard loads with stats
- [ ] Can add products (all fields)
- [ ] Can view product list
- [ ] Can edit products
- [ ] Can delete products (with confirmation)
- [ ] Image upload works and displays
- [ ] Orders tab loads (even if empty)
- [ ] Logout works
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] No console errors
- [ ] Database has correct data

---

**When all checkboxes are marked, the feature is ready for production!** ✅
