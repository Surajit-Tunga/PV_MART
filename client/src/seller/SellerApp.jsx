import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import SellerLanding from "./SellerLanding"
import SellerLogin from "./SellerLogin"
import SellerDashboard from "./SellerDashboard"
import SellerSetupShop from "./SellerSetupShop"

export default function SellerApp() {
  return (
    <Routes>
      <Route path="/" element={<SellerLanding />} />
      <Route path="/login" element={<SellerLogin />} />
      <Route path="/dashboard" element={<SellerDashboard />} />
      <Route path="/setup-shop" element={<SellerSetupShop />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
