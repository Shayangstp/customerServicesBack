const dbOpCustomers = require("../utils/dbOpCustomers");

const getCustomers = async (req, res) => {
  try {
    dbOpCustomers.getCustomers().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const postCustomersPerCompany = async (req, res) => {
  let reqbody = { ...req.body };
  try {
    dbOpCustomers
      .postCustomersPerCompany(reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};

const postCustomersOrders = async (req, res) => {
  //40114
  console.log(req.body);
  let reqbody = { ...req.body };
  try {
    dbOpCustomers.postCustomersOrders(reqbody.customerCode).then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

const postCustomerOrdersPerCompany = async (req, res) => {
  //40114 customercode
  //68 companyCode
  let reqbody = { ...req.body };
  console.log(reqbody.customerCode);
  console.log(reqbody.companyCode);
  try {
    dbOpCustomers
      .postCustomersOrdersPerCompany(reqbody.customerCode, reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};
const getExportCustomers = async (req, res) => {
  try {
    dbOpCustomers.getExportCustomers().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const postExportCustomersPerCompany = async (req, res) => {
  //68 companyCode
  //88 companyCode
  let reqbody = { ...req.body };
  try {
    dbOpCustomers
      .postExportCustomersPerCompany(reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};
const getLocalCustomers = async (req, res) => {
  try {
    dbOpCustomers.getLocalCustomers().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const postLocalCustomersPerCompany = async (req, res) => {
  let reqbody = { ...req.body };
  try {
    dbOpCustomers
      .postLocalCustomersPerCompany(reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCustomers,
  postCustomersOrders,
  postCustomerOrdersPerCompany,
  getExportCustomers,
  postExportCustomersPerCompany,
  getLocalCustomers,
  postLocalCustomersPerCompany,
  postCustomersPerCompany,
};
