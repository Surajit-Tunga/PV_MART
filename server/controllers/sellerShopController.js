const SellerShop = require("../models/SellerShop")

exports.createShop = async (req, res) => {
  const shop = await SellerShop.create({
    seller: req.user._id,
    ...req.body
  })

  req.user.shopProfileCompleted = true
  await req.user.save()

  res.json(shop)
}
