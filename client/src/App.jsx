import React from "react"
import BuyerApp from "./buyer/BuyerApp"
import SellerApp from "./seller/SellerApp"
import AdminApp from "./admin/AdminApp"

function App() {
  const host = window.location.hostname

  if (host.includes("seller")) return <SellerApp />
  if (host.includes("admin")) return <AdminApp />

  return <BuyerApp />
}

export default App
