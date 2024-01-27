const dbOpAuth = require("../utils/dbOpAuth");

const postSignUpCustomer = async (req, res) => {
  console.log(req.body);
  values = {};
  try {
    dbOpAuth.signUpCustomer(req.body).then((result) => {
      console.log("controller" + result);
      if (result.code === 409) {
        return res.json({ code: 409, message: result.message });
      }
      return res.json({ code: 201, message: "ثبت نام با موفقیت انجام شد" });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postSignUpCustomer };
