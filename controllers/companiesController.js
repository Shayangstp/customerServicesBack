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
  let reqParam = { ...req.params };
  try {
    dbOpCompanies
      .postCompaniesOrders(
        reqbody.companyCode,
        reqbody.userId,
        reqParam.pageNumber,
        reqParam.pageSize
      )
      .then((result) => {
        return res.json({
          code: 200,
          totalOrders: result.totalCount,
          companyOrders: result.products,
        });
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
        reqbody.orderNo,
        reqbody.userId,
        reqbody.ipAddress,
        reqbody.actionCode,
        reqbody.comment,
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
const postOutputLog = async (req, res) => {
  let reqbody = { ...req.body };
  console.log(reqbody);
  const values = {
    orderNo: reqbody.orderNo,
    outputNo: reqbody.outputNo,
    carModel: reqbody.carModel,
    carPlate: reqbody.carPlate,
    driverName: reqbody.driverName,
    date: reqbody.date,
    carByCustomer: reqbody.carByCustomer,
  };
  console.log(values);
  try {
    dbOpCompanies.postOutputLog(values).then((result) => {
      return res.json({
        code: 200,
        message: "اطلاعات با موفقیت ثبت شد",
        result,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCompanies,
  postCompaniesOrders,
  postActionOrders,
  postOutputLog,
};
