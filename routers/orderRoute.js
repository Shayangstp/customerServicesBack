const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.route("/orders").get(orderController.getOrders);
router.route("/order/:companyCode").get(orderController.getOrder);
router.route("/orders").post(orderController.addOrder);

module.exports = router;
