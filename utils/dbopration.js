const configSql = require("../db/dbconfig");
const sql = require("mssql");

const getGalassWareOrders = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().query("SELECT * FROM GlasswareOrders");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

//get one order id and get the specefic order (we do it with params)
const getGalassWareOrder = async (companyCode) => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool
      .request()
      //this is for the id
      .input("input_parameter", sql.Int, companyCode)
      .query(
        "SELECT * FROM GlasswareOrders where companyCode = @input_parameter"
      );
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

//this make order into the database not needed for this project
const addOrder = async (order) => {
  try {
    let pool = await sql.connect(configSql);
    let insertProduct = await pool
      .request()
      .input("CompanyCode", sql.Int, order.CompanyCode)
      .input("CompanyName", sql.NVarChar, order.CompanyName)
      .input("Export", sql.Int, order.Export)
      .input("CustomerCode", sql.Int, order.CustomerCode)
      .input("CustomerName", sql.NVarChar, order.CustomerName)
      .input("OrderDate", sql.NVarChar, order.OrderDate)
      .input("OrderNo", sql.Int, order.OrderNo)
      .input("ProductCode", sql.NVarChar, order.ProductCode)
      .input("ProductName", sql.NVarChar, order.ProductName)
      .input("OrderQuantity", sql.Int, order.OrderQuantity)
      .input("OrderUnitPrice", sql.Int, order.OrderUnitPrice)
      .input("OrderBasePrice", sql.Int, order.OrderBasePrice)
      .input("DiscountPercent", sql.Int, order.DiscountPercent)
      .input("OrderStatus", sql.NVarChar, order.OrderStatus)
      .input("Creator", sql.NVarChar, order.Creator)
      .input("CreateDate", sql.NVarChar, order.CreateDate)
      .input("SentQuantity", sql.Int, order.SentQuantity)
      .input("BalanceQuantity", sql.Int, order.BalanceQuantity)
      .execute("InsertOrders");
    return insertProduct.recordset;
  } catch (error) {
    console.log(error);
  }
};

//exec from sp
//comapnies
const getCompanies = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetCompanies");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};
//customers
const getCustomers = async () => {
  try {
    let pool = await sql.connect(configSql);
    let products = await pool.request().execute("GetCustomers");
    return products.recordset;
  } catch (error) {
    console.log(error);
  }
};

const getCustomersOrders = async (customerCode) => {
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

//if you want to pass params
// const getGalassWareOrdersWithStoredProcedure = async (param1, param2) => {
//   try {
//     let pool = await sql.connect(configSql);
//     let result = await pool
//       .request()
//       .input("Param1", sql.NVarChar, param1)
//       .input("Param2", sql.Int, param2)
//       .execute("YourStoredProcedureName");
//     return result.recordset;
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  getGalassWareOrders,
  getGalassWareOrder,
  addOrder,
  getCompanies,
  getCustomers,
  getCustomersOrders,
};
