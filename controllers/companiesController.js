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
  try {
    dbOpCompanies
      .postCompaniesOrders(reqbody.companyCode, reqbody.userID)
      .then((result) => {
        return res.json({ code: 200, companyOrders: result });
      });
  } catch (error) {
    console.log(error);
  }
};

const postActionOrders = async (req, res) => {
  let reqbody = { ...req.body };
  console.log(reqbody);
  try {
    dbOpCompanies
      .postActionOrders(
        reqbody.companyCode,
        reqbody.exports,
        reqbody.orderNo,
        reqbody.userName,
        reqbody.ipAddress,
        reqbody.actionCode,
        reqbody.comments,
        reqbody.toPerson
      )
      .then((result) => {
        return res.json({
          code: 200,
          message: "action set successFully",
          result,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCompanies, postCompaniesOrders, postActionOrders };
