import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function BuyerPayment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cartItems, setCartItems] = useState([]);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: ""
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [qrData, setQrData] = useState({ qr: "", upiUrl: "" });
  const [orderPlaced, setOrderPlaced] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/api/buyer/cart")
        if (res.data.success) {
          const items = res.data.cart?.items || []
          if (items.length === 0) {
            alert("Your cart is empty!")
            navigate("/products")
            return
          }
          setCartItems(items)
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        if (error.response?.status === 404) {
          alert("Your cart is empty!")
          navigate("/products")
        }
      }
    }

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      navigate("/login")
    } else {
      fetchCart()
    }
  }, [navigate])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 5000
  const tax = Math.round(subtotal * 0.18)
  const totalAmount = subtotal + shipping + tax


  // Fetch QR code from backend for UPI payment
  useEffect(() => {
    if (paymentMethod === "upi") {
      API.get(`/api/payment/upi-qr?amount=${totalAmount}&note=PV Mart Order`).then(res => {
        if (res.data.success) setQrData(res.data);
      });
    }
  }, [paymentMethod, totalAmount]);

  const handleCardChange = (e) => {
    const { name, value } = e.target
    setCardInfo({ ...cardInfo, [name]: value })
  }

  const handlePayment = async (e) => {
    if (e) e.preventDefault();

    if (paymentMethod === "card" && !cardInfo.cardNumber) {
      alert("Please enter card details");
      return;
    }

    setPaymentProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get shipping info from localStorage
      const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo") || "{}");

      // Place order via backend (status: pending, paymentStatus: pending)
      const orderRes = await API.post("/api/buyer/place-order", {
        shippingAddress: shippingInfo.address,
        customerName: shippingInfo.fullName,
        customerPhone: shippingInfo.phone,
        customerEmail: shippingInfo.email,
        paymentMethod,
      });

      if (orderRes.data.success) {
        localStorage.removeItem("shippingInfo");
        setOrderPlaced(orderRes.data.order);
      } else {
        alert(orderRes.data.message || "Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaymentProcessing(false);
    }
  };


  if (orderPlaced) {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ color: "#1976d2" }}>Order Placed!</h2>
        <p>Your order has been placed and is pending admin approval.</p>
        <p>Order ID: <b>{orderPlaced._id.slice(-6)}</b></p>
        <p>You will receive confirmation once payment is approved by admin.</p>
        <Link to={`/buyer/orders`}>Track your orders</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem", color: "#333" }}>Payment</h1>

      {/* Order Summary */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "1.5rem",
        borderRadius: "10px",
        marginBottom: "2rem",
        border: "1px solid #ddd"
      }}>
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>Order Total</h3>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#667eea"
        }}>
          <span>Amount Due:</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#333" }}>Select Payment Method</h3>
        
        <label style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          border: `2px solid ${paymentMethod === "card" ? "#667eea" : "#ddd"}`,
          borderRadius: "10px",
          marginBottom: "1rem",
          cursor: "pointer",
          backgroundColor: paymentMethod === "card" ? "#f0f3ff" : "white"
        }}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: "1rem", cursor: "pointer" }}
          />
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>💳 Credit/Debit Card</span>
        </label>

        <label style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          border: `2px solid ${paymentMethod === "upi" ? "#667eea" : "#ddd"}`,
          borderRadius: "10px",
          marginBottom: "1rem",
          cursor: "pointer",
          backgroundColor: paymentMethod === "upi" ? "#f0f3ff" : "white"
        }}>
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: "1rem", cursor: "pointer" }}
          />
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>📱 UPI</span>
        </label>

        <label style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          border: `2px solid ${paymentMethod === "bank" ? "#667eea" : "#ddd"}`,
          borderRadius: "10px",
          cursor: "pointer",
          backgroundColor: paymentMethod === "bank" ? "#f0f3ff" : "white"
        }}>
          <input
            type="radio"
            name="paymentMethod"
            value="bank"
            checked={paymentMethod === "bank"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ marginRight: "1rem", cursor: "pointer" }}
          />
          <span style={{ fontSize: "1rem", fontWeight: "600" }}>🏦 Net Banking</span>
        </label>
      </div>

      {/* Payment Form */}
      {paymentMethod === "card" && (
        <form onSubmit={handlePayment} style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "1.5rem",
          marginBottom: "2rem"
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              value={cardInfo.cardNumber}
              onChange={handleCardChange}
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Cardholder Name</label>
            <input
              type="text"
              name="cardholderName"
              placeholder="Name on Card"
              value={cardInfo.cardholderName}
              onChange={handleCardChange}
              style={{
                width: "100%",
                padding: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                maxLength="5"
                value={cardInfo.expiryDate}
                onChange={handleCardChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                maxLength="3"
                value={cardInfo.cvv}
                onChange={handleCardChange}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={paymentProcessing}
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: paymentProcessing ? "#999" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: paymentProcessing ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {paymentProcessing ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
          </button>
        </form>
      )}

      {paymentMethod === "upi" && (
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "2rem",
          marginBottom: "2rem",
          textAlign: "center",
          background: "#f8f9fa"
        }}>
          <h3 style={{ marginBottom: "1rem", color: "#333" }}>Scan QR Code to Pay</h3>
          <div style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "10px",
            display: "inline-block",
            marginBottom: "1rem",
            border: "2px solid #667eea"
          }}>
            {qrData.qr ? (
              <img
                src={qrData.qr}
                alt="UPI QR Code"
                style={{
                  width: "300px",
                  height: "300px",
                  display: "block"
                }}
              />
            ) : (
              <div>Loading QR...</div>
            )}
          </div>
          <p style={{ color: "#666", marginBottom: "0.5rem" }}>
            Amount: <strong style={{ color: "#667eea", fontSize: "1.2rem" }}>₹{totalAmount.toLocaleString()}</strong>
          </p>
          <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
            UPI ID: <strong>{qrData.upiUrl?.split("pa=")[1]?.split("&")[0] || "demo@upi"}</strong>
          </p>
          <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Scan this QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
          </p>
          <button
            onClick={handlePayment}
            disabled={paymentProcessing}
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: paymentProcessing ? "#999" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: paymentProcessing ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {paymentProcessing ? "Processing..." : "I have completed the payment"}
          </button>
          <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#999" }}>
            After making the payment, click the button above to confirm
          </p>
        </div>
      )}

      {paymentMethod === "bank" && (
        <form onSubmit={handlePayment} style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "1.5rem",
          marginBottom: "2rem"
        }}>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            You will be redirected to complete your Net Banking payment.
          </p>
          <button
            type="submit"
            disabled={paymentProcessing}
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: paymentProcessing ? "#999" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: paymentProcessing ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {paymentProcessing ? "Processing..." : "Continue to Net Banking"}
          </button>
        </form>
      )}

      <div style={{
        backgroundColor: "#fff3cd",
        border: "1px solid #ffc107",
        borderRadius: "5px",
        padding: "1rem",
        textAlign: "center",
        color: "#666"
      }}>
        <p style={{ margin: 0 }}>
          🔒 Your payment is secure and encrypted
        </p>
      </div>
    </div>
  )
}
