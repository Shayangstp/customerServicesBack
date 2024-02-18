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
      .input("companyCode", sql.NVarChar(50), companyCode)
      .execute("GetCustomerOrdersPerCompany");

    // Fetch action names from the Actions table
    let actionNamesQuery = await pool.query(
      "SELECT ActionCode, ActionEnName, ActionFaName FROM Actions"
    );

    // Get the actions
    let actionNames = {};
    actionNamesQuery.recordset.forEach((row) => {
      actionNames[row.ActionCode] = {
        en: row.ActionEnName,
        fa: row.ActionFaName,
      };
    });

    // Fetch the latest action code and comments for each order
    for (const order of result.recordset) {
      let actions = await pool
        .request()
        .input("OrderNo", sql.Numeric, order.OrderNo)
        .input("CompanyCode", sql.Int, order.CompanyCode)
        .query(
          "SELECT TOP 1 ActionCode, Comments FROM OrderActions WHERE OrderNo = @OrderNo AND CompanyCode = @CompanyCode ORDER BY ActionCode DESC"
        );

      if (actions.recordset.length > 0) {
        const latestActionCode = actions.recordset[0].ActionCode;
        const latestComments = actions.recordset[0].Comments;
        order.latestActionCode = latestActionCode;

        // Set statusEn, statusFa, and comments based on the latest action code
        const actionName = actionNames[latestActionCode];
        if (actionName) {
          order.statusEn = actionName.en;
          order.statusFa = actionName.fa;
          order.comments = latestComments;
        } else {
          order.statusEn = "Unknown";
          order.statusFa = "نامشخص";
          order.comments = latestComments;
        }
      } else {
        order.latestActionCode = null;
        order.statusEn = "Unknown";
        order.statusFa = "نامشخص";
        order.comments = null;
      }
    }

    return result.recordset;
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for handling in the caller function
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
