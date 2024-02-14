const express = require("express");
const router = express.Router();

const companiesController = require("../controllers/companiesController");

//sp
router.get("/getCompanies", companiesController.getCompanies);
router.post("/postCompaniesOrders", companiesController.postCompaniesOrders);

module.exports = router;
