const router = require("express").Router()
const auth = require("../middleware/auth")
const sellerOnly = require("../middleware/sellerOnly")
const { createShop, setupShop, getShopStatus, getShop, updateShop } = require("../controllers/sellerShopController")

router.post("/create", auth, sellerOnly, createShop)
router.post("/setup", auth, sellerOnly, setupShop)
router.get("/status", auth, sellerOnly, getShopStatus)
router.get("/", auth, sellerOnly, getShop)
router.put("/", auth, sellerOnly, updateShop)

module.exports = router
