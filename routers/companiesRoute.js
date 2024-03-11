const express = require("express");
const router = express.Router();

const companiesController = require("../controllers/companiesController");

//sp
router.get("/getCompanies", companiesController.getCompanies);
router.post(
  "/postCompaniesOrders/:pageNumber/:pageSize",
  companiesController.postCompaniesOrders
);
router.post("/postActionOrders", companiesController.postActionOrders);
router.post("/postOutputLog", companiesController.postOutputLog);

module.exports = router;
