const configSql = require("../db/dbconfig");
const sql = require("mssql");

const getProducts = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetProducts");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getExportProducts = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetExportProducts");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
const postExportProductsPerCompany = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      .input("companyCode", sql.Int, companyCode)
      .execute("GetExportProductsPerCompany");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
const getLocalProducts = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetLocalProducts");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
const postLocalProductsPerCompany = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      .input("companyCode", sql.Int, companyCode)
      .execute("GetLocalProductsPerCompany");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
const postProductsPerCompany = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      .input("companyCode", sql.Int, companyCode)
      .execute("GetProductsPerCompany");
    return products.recordset;
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
  postProductsPerCompany,
};
