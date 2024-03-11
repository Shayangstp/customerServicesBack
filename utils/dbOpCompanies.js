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
  userID,
  pageNumber,
  pageSize
) => {
  console.log(companyCode, userID, pageNumber, pageSize);
  try {
    let pool = await sql.connect(configSql);
    console.log(companyCode, userID, pageNumber, pageSize);
    let products = await pool
      .request()
      .input("CompanyCode", sql.VarChar(100), companyCode)
      .input("PageNumber", sql.Int, pageNumber)
      .input("PageSize", sql.Int, pageSize)
      .output("TotalCount", sql.Int)
      .execute("GetCompanyOrders");

    const totalCount = products.output.TotalCount;
    products.recordset;
    return {
      totalCount,
      products: products.recordset,
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
