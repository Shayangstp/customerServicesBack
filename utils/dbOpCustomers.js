const configSql = require("../db/dbconfig");
const sql = require("mssql");

const getCustomers = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetCustomers");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

const postCustomersPerCompany = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      .input("CompanyCode", sql.Int, companyCode)
      .execute("GetCustomersPerCompany");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

const postCustomersOrders = async (customerCode) => {
  try {
    let pool = await sql.connect(configSql);
    let result = await pool
      .request()
      .input("customerCode", sql.Int, customerCode)
      .execute("GetCustomerOrders");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

const postCustomersOrdersPerCompany = async (customerCode, companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let result = await pool
      .request()
      .input("customerCode", sql.Int, customerCode)
      .input("companyCode", sql.Int, companyCode)
      .execute("GetCustomerOrdersPerCompany");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getExportCustomers = async () => {
  try {
    let pool = await sql.connect(configSql);
    let result = await pool.request().execute("GetExportCustomers");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

const postExportCustomersPerCompany = async (companyCode) => {
  console.log(companyCode);
  try {
    let pool = await sql.connect(configSql);
    let result = await pool
      .request()
      .input("companyCode", sql.Int, companyCode)
      .execute("GetExportCustomersPerCompany");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};
const getLocalCustomers = async () => {
  try {
    let pool = await sql.connect(configSql);
    let result = await pool.request().execute("GetLocalCustomers");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};
const postLocalCustomersPerCompany = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let result = await pool
      .request()
      .input("companyCode", sql.Int, companyCode)
      .execute("GetLocalCustomersPerCompany");
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCustomers,
  postCustomersOrders,
  postCustomersOrdersPerCompany,
  getExportCustomers,
  postExportCustomersPerCompany,
  getLocalCustomers,
  postLocalCustomersPerCompany,
  postCustomersPerCompany,
};
