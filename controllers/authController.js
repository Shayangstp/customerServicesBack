const dbOpAuth = require("../utils/dbOpAuth");

const postSignUpCustomer = async (req, res) => {
  console.log(req.body);
  values = {};
  try {
    dbOpAuth.signUpCustomer(req.body).then((result) => {
      return res.json({ code: 200, message: "User signed up successfully" });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postSignUpCustomer };
