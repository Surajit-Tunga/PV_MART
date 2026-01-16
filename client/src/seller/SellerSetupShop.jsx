import React, { useState } from "react"
import { API } from "../services/api"

export default function SellerSetupShop() {
  const [formData, setFormData] = useState({
    shopName: "",
    shopType: "",
    shopDescription: "",
    serviceArea: "",
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    shopAddress: "",
    city: "",
    state: "",
    pincode: "",
    businessType: "",
    gstNumber: "",
    idProofType: "",
    idProofNumber: "",
    sellSolarPanels: "yes",
    offersInstallation: "yes",
    installationTypes: [],
    capacityRangeMin: "",
    capacityRangeMax: "",
    pricePerKw: "",
    installationCharge: "",
    siteVisitCharge: "",
    bankAccountHolder: "",
    accountNumber: "",
    ifscCode: "",
    availabilityDays: [],
    responseTime: "",
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === "checkbox" && name === "installationTypes") {
      setFormData((prev) => ({
        ...prev,
        installationTypes: checked
          ? [...prev.installationTypes, value]
          : prev.installationTypes.filter((item) => item !== value)
      }))
    } else if (type === "checkbox" && name === "availabilityDays") {
      setFormData((prev) => ({
        ...prev,
        availabilityDays: checked
          ? [...prev.availabilityDays, value]
          : prev.availabilityDays.filter((item) => item !== value)
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.acceptTerms) {
      setError("Please accept terms and conditions")
      setLoading(false)
      return
    }

    try {
      await API.post("/api/seller/shop/setup", formData)
      alert("Shop setup completed successfully!")
      location.href = "/seller/dashboard"
    } catch (err) {
      setError(err.response?.data?.message || "Error setting up shop")
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    maxWidth: "900px",
    margin: "30px auto",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  }

  const sectionStyle = {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e0e0e0"
  }

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333"
  }

  const formGroupStyle = { marginBottom: "15px" }
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }
  const inputStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box", fontSize: "14px" }
  const selectStyle = { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box", fontSize: "14px" }
  const gridStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }
  const checkboxContainerStyle = { display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "10px" }
  const checkboxStyle = { display: "flex", alignItems: "center", gap: "8px" }
  const errorStyle = { backgroundColor: "#f8d7da", color: "#721c24", padding: "10px", borderRadius: "5px", marginBottom: "20px" }
  const buttonStyle = { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }

  return (
    <div style={containerStyle}>
      <h1>Solar Seller and Installer Setup Form</h1>
      <p style={{ color: "#666" }}>Complete all sections to start selling</p>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Shop Details */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>1. Shop Details</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Shop Name *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Solar Energy Solutions"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Shop Type *</label>
            <select
              name="shopType"
              value={formData.shopType}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select Shop Type</option>
              <option value="seller">Seller Only</option>
              <option value="installer">Installer Only</option>
              <option value="both">Both Seller and Installer</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Short Description</label>
            <textarea
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleChange}
              rows="3"
              style={inputStyle}
              placeholder="Brief description of your business"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Service Area (City or District) *</label>
            <input
              type="text"
              name="serviceArea"
              value={formData.serviceArea}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </div>
        </div>

        {/* Owner Contact Details */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>2. Owner and Contact Details</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Mobile Number *</label>
              <input
                type="tel"
                name="ownerMobile"
                value={formData.ownerMobile}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email ID *</label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>3. Address Details</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Shop Address *</label>
            <input
              type="text"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Street address"
            />
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>PIN Code *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Business Verification */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>4. Business Verification</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select Business Type</option>
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>GST Number (Optional)</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g., 27AABCT1234A1Z5"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>ID Proof Type</label>
              <select
                name="idProofType"
                value={formData.idProofType}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="">Select ID Proof</option>
                <option value="aadhar">Aadhar</option>
                <option value="pan">PAN</option>
                <option value="driving">Driving License</option>
                <option value="passport">Passport</option>
              </select>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>ID Proof Number</label>
            <input
              type="text"
              name="idProofNumber"
              value={formData.idProofNumber}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Services and Products */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>5. Services and Products</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Sell Solar Panels *</label>
            <div style={checkboxContainerStyle}>
              <label style={checkboxStyle}>
                <input
                  type="radio"
                  name="sellSolarPanels"
                  value="yes"
                  checked={formData.sellSolarPanels === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label style={checkboxStyle}>
                <input
                  type="radio"
                  name="sellSolarPanels"
                  value="no"
                  checked={formData.sellSolarPanels === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Offer Installation Service *</label>
            <div style={checkboxContainerStyle}>
              <label style={checkboxStyle}>
                <input
                  type="radio"
                  name="offersInstallation"
                  value="yes"
                  checked={formData.offersInstallation === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label style={checkboxStyle}>
                <input
                  type="radio"
                  name="offersInstallation"
                  value="no"
                  checked={formData.offersInstallation === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {formData.offersInstallation === "yes" && (
            <>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Types of Installation Available</label>
                <div style={checkboxContainerStyle}>
                  <label style={checkboxStyle}>
                    <input
                      type="checkbox"
                      name="installationTypes"
                      value="rooftop"
                      checked={formData.installationTypes.includes("rooftop")}
                      onChange={handleChange}
                    />
                    Rooftop
                  </label>
                  <label style={checkboxStyle}>
                    <input
                      type="checkbox"
                      name="installationTypes"
                      value="ground-mounted"
                      checked={formData.installationTypes.includes("ground-mounted")}
                      onChange={handleChange}
                    />
                    Ground mounted
                  </label>
                </div>
              </div>

              <div style={gridStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Capacity Range Min (kW)</label>
                  <input
                    type="number"
                    name="capacityRangeMin"
                    value={formData.capacityRangeMin}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Capacity Range Max (kW)</label>
                  <input
                    type="number"
                    name="capacityRangeMax"
                    value={formData.capacityRangeMax}
                    onChange={handleChange}
                    style={inputStyle}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pricing */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>6. Pricing (Basic)</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Price per kW (₹)</label>
            <input
              type="number"
              name="pricePerKw"
              value={formData.pricePerKw}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., 50000"
              min="0"
            />
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Installation Charge (₹)</label>
              <input
                type="number"
                name="installationCharge"
                value={formData.installationCharge}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g., 10000"
                min="0"
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Site Visit Charge (₹, Optional)</label>
              <input
                type="number"
                name="siteVisitCharge"
                value={formData.siteVisitCharge}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g., 500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>7. Payment Details</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Bank Account Holder Name *</label>
            <input
              type="text"
              name="bankAccountHolder"
              value={formData.bankAccountHolder}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>IFSC Code *</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>8. Availability</div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Installation Available Days</label>
            <div style={checkboxContainerStyle}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <label key={day} style={checkboxStyle}>
                  <input
                    type="checkbox"
                    name="availabilityDays"
                    value={day.toLowerCase()}
                    checked={formData.availabilityDays.includes(day.toLowerCase())}
                    onChange={handleChange}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Response Time *</label>
            <select
              name="responseTime"
              value={formData.responseTime}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select Response Time</option>
              <option value="within-2-hours">Within 2 Hours</option>
              <option value="within-24-hours">Within 24 Hours</option>
              <option value="within-2-days">Within 2 Days</option>
              <option value="within-1-week">Within 1 Week</option>
            </select>
          </div>
        </div>

        {/* Agreement */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>9. Agreement</div>

          <div style={checkboxStyle}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label style={{ margin: 0 }}>
              I agree to PV Mart Terms and Conditions and Privacy Policy *
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Setting up..." : "Complete Shop Setup"}
        </button>
      </form>
    </div>
  )
}
