const configSql = require("../db/dbconfig");
const sql = require("mssql");

const getCompanies = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetCompanies");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
const postCompaniesOrders = async (companyCode, userRole) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      .input("CompanyCode", sql.VarChar(100), companyCode)
      .input("UserRole", sql.VarChar(100), userRole)
      .execute("GetCompanyOrders");
    return products.recordset;
  } catch (error) {
    console.log("Error occurred while executing stored procedure:", error);
    console.log(error);
  }
};

module.exports = {
  getCompanies,
  postCompaniesOrders,
};
