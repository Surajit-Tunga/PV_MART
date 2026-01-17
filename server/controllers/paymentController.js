const QRCode = require("qrcode");

// Generate UPI QR code for payment
exports.generateUpiQr = async (req, res) => {
  try {
    const { amount, note } = req.query;
    const upiId = process.env.DEMO_UPI_ID || "demo@upi";
    const upiUrl = `upi://pay?pa=${upiId}&pn=PV%20Mart&am=${amount || ""}&cu=INR&tn=${encodeURIComponent(note || "PV Mart Order")}`;
    const qr = await QRCode.toDataURL(upiUrl);
    res.json({ success: true, qr, upiUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate QR", error: error.message });
  }
};
