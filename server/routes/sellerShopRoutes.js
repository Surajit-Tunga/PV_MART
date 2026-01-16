const router = require("express").Router()
const auth = require("../middleware/auth")
const sellerOnly = require("../middleware/sellerOnly")
const { createShop } = require("../controllers/sellerShopController")

router.post("/create", auth, sellerOnly, createShop)

module.exports = router
