import React, { useEffect } from "react"
import { API } from "../services/api"

export default function BuyerApp() {

  const testLogin = async () => {
    const res = await API.post("/api/auth/register", {
      name: "Test Buyer",
      email: "buyer@test.com",
      password: "123456",
      role: "buyer"
    })
    console.log(res.data)
  }

  useEffect(() => {
    testLogin()
  }, [])

  return <h1>Buyer Portal</h1>
}
