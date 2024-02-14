const dbOpCompanies = require("../utils/dbOpCompanies");

//sp controller
const getCompanies = async (req, res) => {
  try {
    dbOpCompanies.getCompanies().then((result) => {
      return res.json({ code: 200, companies: result });
    });
  } catch (error) {
    console.log(error);
  }
};

const postCompaniesOrders = async (req, res) => {
  let reqbody = { ...req.body };
  console.log(reqbody);
  try {
    dbOpCompanies
      .postCompaniesOrders(reqbody.companyCode, reqbody.userRole)
      .then((result) => {
        return res.json({ code: 200, companyOrders: result });
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCompanies, postCompaniesOrders };
