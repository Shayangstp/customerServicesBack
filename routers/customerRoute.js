const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");

//sp
router.get("/getCustomers", customerController.getCustomers);
router.post("/getCustomerOrders", customerController.postCustomersOrders);
router.post(
  "/getCustomerOrdersPerCompany",
  customerController.postCustomerOrdersPerCompany
);
router.get("/getExportCustomers", customerController.getExportCustomers);
router.post(
  "/getExportCustomersPerCompany",
  customerController.postExportCustomersPerCompany
);
router.get("/getLocalCustomers", customerController.getLocalCustomers);
router.post(
  "/getLocalCustomersPerCompany",
  customerController.postLocalCustomersPerCompany
);
router.post(
  "/getCustomersPerCompany",
  customerController.postCustomersPerCompany
);
router.post(
  "/postCustomerCarDetail",
  customerController.postCustomerCarDetail
);

module.exports = router;
