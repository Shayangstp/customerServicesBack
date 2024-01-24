const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/postSignUpCustomer", authController.postSignUpCustomer);

module.exports = router;
