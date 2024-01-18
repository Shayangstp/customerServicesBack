const express = require("express");
const router = express.Router();

const productsController = require("../controllers/productsController");

router.get("/getExportProducts", productsController.getExportProducts);
router.get("/getProducts", productsController.getProducts);
router.post(
  "/getExportProductsPerCompany",
  productsController.postExportProductsPerCompany
);
router.get("/getLocalProducts", productsController.getLocalProducts);
router.post(
  "/getLocalProductsPerCompany",
  productsController.postLocalProductsPerCompany
);

module.exports = router;
