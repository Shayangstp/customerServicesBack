const dbOpProducts = require("../utils/dbOpProducts");

const getProducts = async (req, res) => {
  try {
    dbOpProducts.getProducts().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const getExportProducts = async (req, res) => {
  try {
    dbOpProducts.getExportProducts().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const postExportProductsPerCompany = async (req, res) => {
  //68
  let reqbody = { ...req.body };
  try {
    dbOpProducts
      .postExportProductsPerCompany(reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};
const getLocalProducts = async (req, res) => {
  try {
    dbOpProducts.getLocalProducts().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const postLocalProductsPerCompany = async (req, res) => {
  let reqbody = { ...req.body };
  try {
    dbOpProducts
      .postLocalProductsPerCompany(reqbody.companyCode)
      .then((result) => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getExportProducts,
  getProducts,
  postExportProductsPerCompany,
  getLocalProducts,
  postLocalProductsPerCompany,
};
