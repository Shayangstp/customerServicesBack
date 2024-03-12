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
// const postCompaniesOrders = async (companyCode, userRole) => {
//   try {
//     let pool = await sql.connect(configSql);
//     let products = await pool
//       .request()
//       .input("CompanyCode", sql.VarChar(100), companyCode)
//       .input("UserRole", sql.VarChar(100), userRole)
//       .execute("GetCompanyOrders");
//     return products.recordset;
//   } catch (error) {
//     console.log("Error occurred while executing stored procedure:", error);
//     console.log(error);
//   }
// };

//get the actions from orderActions table and show to the user
const postCompaniesOrders = async (
  companyCode,
  userId,
  pageNumber,
  pageSize
) => {
  try {
    let pool = await sql.connect(configSql);
    // Execute the stored procedure GetCompanyOrders
    let productsResult = await pool
      .request()
      .input("CompanyCode", sql.Int, companyCode)
      .input("PageNumber", sql.Int, pageNumber)
      .input("PageSize", sql.Int, pageSize)
      .input("UserId", sql.VarChar(100), userId)
      .output("TotalCount", sql.Int)
      .execute("GetCompanyOrders");

    const totalCount = productsResult.output.TotalCount;
    const products = productsResult.recordset;

    // Array to store output log for each order
    let ordersWithOutputLog = [];

    // Loop through each order
    for (let order of products) {
      // Execute the stored procedure GetOutputLog for each order
      let outputLogResult = await pool
        .request()
        .input("OrderNo", sql.Int, order.OrderNo)
        .execute("GetOutputLog");

      let outputLog =
        outputLogResult.recordset.length > 0
          ? outputLogResult.recordset[0]
          : null;
      // Add the output log to the order object
      order.outputLog = outputLog;

      // Push the order with output log to the result array
      ordersWithOutputLog.push(order);
    }

    return {
      totalCount,
      products: ordersWithOutputLog,
    };
  } catch (error) {
    console.log("Error occurred while executing stored procedure:", error);
    throw error;
  }
};

//insert actions to ActionOrder table
const postActionOrders = async (
  orderNo,
  userId,
  ipAddress,
  actionCode,
  comment,
  toPerson
) => {
  try {
    let pool = await sql.connect(configSql);
    await pool
      .request()
      .input("OrderNo", sql.Int, orderNo)
      .input("UserId", sql.NVarChar(100), userId)
      .input("IpAddress", sql.VarChar(50), ipAddress)
      .input("ActionCode", sql.Numeric, actionCode)
      .input("Comment", sql.NVarChar(100), comment)
      .input("ToPerson", sql.NVarChar(100), toPerson)
      .execute(`SaveAction`);

    // Optionally, you may return something meaningful here if needed.
    return "Action successfully inserted into OrderActions table.";
  } catch (error) {
    console.log("Error occurred while executing stored procedure:", error);
    console.log(error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const postOutputLog = async (values) => {
  try {
    let pool = await sql.connect(configSql);
    let request = await pool.request();

    // Input parameters for the stored procedure
    request.input("OutputNo", sql.Int, values.outputNo);
    request.input("OrderNo", sql.Int, values.orderNo);
    request.input("CarModel", sql.NVarChar(50), values.carModel);
    request.input("CarPlate", sql.NVarChar(10), values.carPlate);
    request.input("DriverName", sql.NVarChar(100), values.driverName);
    request.input("Date", sql.DateTime, values.date);
    request.input("CarByCustomer", sql.Bit, values.carByCustomer);

    // Execute the stored procedure
    await request.execute("SaveOutputLog");

    // Optionally, you may return something meaningful here if needed.
    return "Data successfully inserted or updated in OutputLog table.";
  } catch (error) {
    console.log("Error occurred while executing stored procedure:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// .query(`
//   INSERT INTO OrderActions (CompanyCode, Export, OrderNo, Username, IpAddress, ActionCode, Comments)
//   VALUES (@CompanyCode, @Export, @OrderNo, @Username, @IpAddress, @ActionCode, @Comments)
// `);

module.exports = {
  getCompanies,
  postCompaniesOrders,
  postActionOrders,
  postOutputLog,
};
