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

module.exports = {
  getExportProducts,
  getProducts,
};
