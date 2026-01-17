import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import BuyerLanding from "./BuyerLanding"
import BuyerLogin from "./BuyerLogin"
import BuyerProducts from "./BuyerProducts"
import BuyerCart from "./BuyerCart"
import BuyerCheckout from "./BuyerCheckout"
import BuyerPayment from "./BuyerPayment"
import BuyerOrders from "./BuyerOrders"

export default function BuyerApp() {
  return (
    <Routes>
      <Route path="/" element={<BuyerLanding />} />
      <Route path="/login" element={<BuyerLogin />} />
      <Route path="/products" element={<BuyerProducts />} />
      <Route path="/cart" element={<BuyerCart />} />
      <Route path="/checkout" element={<BuyerCheckout />} />
      <Route path="/payment" element={<BuyerPayment />} />
      <Route path="/orders" element={<BuyerOrders />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
