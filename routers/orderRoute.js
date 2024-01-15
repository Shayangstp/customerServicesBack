const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.get("/orders", orderController.getOrders);
router.get("/order/:companyCode", orderController.getOrder);
router.post("/orders", orderController.addOrder);

module.exports = router;
