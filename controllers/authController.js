const dbOpAuth = require("../utils/dbOpAuth");
const jwt = require("jsonwebtoken");

const postSignUpCustomer = async (req, res) => {
  values = {};
  try {
    dbOpAuth.signUpCustomer(req.body).then((result) => {
      if (result.code === 409) {
        return res.json({ code: 409, message: result.message });
      }
      return res.json({ code: 201, message: "ثبت نام با موفقیت انجام شد" });
    });
  } catch (error) {
    console.log(error);
  }
};
const postLoginCustomer = async (req, res) => {
  try {
    dbOpAuth.loginCustomer(req.body).then((result) => {
      if (result.code === 401) {
        return res.json({ code: 401, message: result.message });
      }
      const token = jwt.sign(result, "shayan5262");
      return res.json({
        code: 415,
        message: "ورود با موفقیت انجام شد",
        token,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postSignUpCustomer, postLoginCustomer };
