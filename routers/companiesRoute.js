const express = require("express");
const router = express.Router();

const companiesController = require("../controllers/companiesController");

//sp
router.get("/getCompanies", companiesController.getCompanies);
router.post("/postCompaniesOrders", companiesController.postCompaniesOrders);
router.post("/postActionOrders", companiesController.postActionOrders);
router.post("/postOutputLog", companiesController.postOutputLog);

module.exports = router;
