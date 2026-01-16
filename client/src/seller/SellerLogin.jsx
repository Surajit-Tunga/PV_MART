import { useState } from "react"
import { API } from "../services/api"

export default function SellerLogin() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")

  const sendOtp = () =>
    API.post("/api/seller/auth/request-otp", { email })

  const verifyOtp = async () => {
    const res = await API.post("/api/seller/auth/verify-otp", { email, otp })
    localStorage.setItem("token", res.data.token)

    if (!res.data.shopProfileCompleted)
      location.href = "/seller/setup-shop"
    else
      location.href = "/seller/dashboard"
  }

  return (
    <>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendOtp}>Send OTP</button>

      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Login</button>
    </>
  )
}
