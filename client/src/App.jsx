import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import BuyerApp from "./buyer/BuyerApp"
import SellerApp from "./seller/SellerApp"
import AdminApp from "./admin/AdminApp"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/seller/*" element={<SellerApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<BuyerApp />} />
      </Routes>
    </Router>
  )
}

export default App
