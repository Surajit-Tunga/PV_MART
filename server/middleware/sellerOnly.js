module.exports = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller only" })
  }
  next()
}
