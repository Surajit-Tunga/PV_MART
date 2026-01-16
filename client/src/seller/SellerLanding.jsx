import React from "react"

export default function SellerLanding() {
  return (
    <div>
      <h1>Sell on PV Mart</h1>
      <button onClick={() => location.href="/seller/login"}>
        Want to sell?
      </button>
    </div>
  )
}

// This is the starting point for sellers to either log in or set up their shop. Having some platform related information and simple "Want to sell " button

