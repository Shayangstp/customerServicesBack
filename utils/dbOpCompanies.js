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
const postCompaniesOrders = async (companyCode, userID) => {
  console.log(companyCode);
  try {
    let pool = await sql.connect(configSql);

    //get user roles
    const userQuery = await pool
      .request()
      .input("userID", sql.VarChar(100), userID)
      .query("SELECT userId FROM Users WHERE UserId = @userID");
    const userId = userQuery.recordset[0].userId;

    let products = await pool
      .request()
      .input("CompanyCode", sql.VarChar(100), companyCode)
      .execute("GetCompanyOrders");

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
    for (const order of products.recordset) {
      let actions = await pool
        .request()
        .input("OrderNo", sql.Numeric, order.OrderNo)
        .input("CompanyCode", sql.Int, order.CompanyCode)
        .query(
          "SELECT TOP 1 ActionCode, Comments , ToPerson FROM OrderActions WHERE OrderNo = @OrderNo AND CompanyCode = @CompanyCode ORDER BY ActionCode DESC"
        );

      if (actions.recordset.length > 0) {
        const latestActionCode = actions.recordset[0].ActionCode;
        const latestComments = actions.recordset[0].Comments;
        const lastToPerson = actions.recordset[0].ToPerson;
        order.latestActionCode = latestActionCode;

        // Set statusEn, statusFa, toPerson , and comments based on the latest action code
        const actionName = actionNames[latestActionCode];
        if (actionName) {
          order.statusEn = actionName.en;
          order.statusFa = actionName.fa;
          order.comments = latestComments;
          order.ToPerson = lastToPerson;
        } else {
          order.statusEn = "Unknown";
          order.statusFa = "نامشخص";
          order.comments = latestComments;
          order.toPerson = lastToPerson;
        }
      } else {
        order.latestActionCode = null;
        order.statusEn = "Unknown";
        order.statusFa = "نامشخص";
        order.comments = null;
        order.toPerson = "Unknown";
      }

      // Fetch sendCarDate from SendCar table
      let sendCarDateQuery = await pool
        .request()
        .input("OrderNo", sql.Numeric, order.OrderNo)
        .query("SELECT SendCarDate FROM SendCar WHERE OrderNo = @OrderNo");

      if (sendCarDateQuery.recordset.length > 0) {
        order.sendCarDate = sendCarDateQuery.recordset[0].SendCarDate;
      } else {
        order.sendCarDate = null; // If orderNo doesn't exist in SendCar table, set sendCarDate to null
      }

      // Fetch carDetail from SendCar table
      let customerCarDetail = await pool
        .request()
        .input("OrderNo", sql.Numeric, order.OrderNo)
        .query(
          "SELECT Plate , Model , DriverName FROM CarDetail WHERE OrderNo = @OrderNo"
        );

      if (customerCarDetail.recordset.length > 0) {
        order.carDetail = {
          plate: customerCarDetail.recordset[0].Plate,
          model: customerCarDetail.recordset[0].Model,
          driverName: customerCarDetail.recordset[0].DriverName,
        };
      } else {
        order.carDetail = null; // If orderNo doesn't exist in SendCar table, set sendCarDate to null
      }
    }

    const filteredOrders = products.recordset.filter(
      (order) => order.ToPerson === userId
    );

    return filteredOrders;
    // return products.recordset;
  } catch (error) {
    console.log("Error occurred while executing stored procedure:", error);
    console.log(error);
  }
};

//insert actions to ActionOrder table
const postActionOrders = async (
  companyCode,
  exports,
  orderNo,
  userName,
  ipAddress,
  actionCode,
  comments,
  toPerson
) => {
  try {
    let pool = await sql.connect(configSql);
    await pool
      .request()
      .input("CompanyCode", sql.Numeric, companyCode)
      .input("Export", sql.Numeric, exports)
      .input("OrderNo", sql.Numeric, orderNo)
      .input("Username", sql.VarChar(100), userName)
      .input("IpAddress", sql.VarChar(100), ipAddress)
      .input("ActionCode", sql.Numeric, actionCode)
      .input("Comments", sql.NVarChar(100), comments)
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

const postSendCarDate = async (orderNo, sendCarDate) => {
  console.log(sendCarDate);
  try {
    let pool = await sql.connect(configSql);
    let request = await pool.request();

    if (sendCarDate === null || sendCarDate === undefined) {
      throw new Error("sendCarDate is null or undefined.");
    }

    // Prepare the SQL query to insert data into SendCar table
    const query = `
      INSERT INTO SendCar (OrderNo, SendCarDate)
      VALUES (@OrderNo, @SendCarDate);
    `;

    // Input parameters for the SQL query
    request.input("OrderNo", sql.Int, orderNo);
    request.input("SendCarDate", sql.VarChar(100), sendCarDate);

    // Execute the SQL query
    await request.query(query);

    // Optionally, you may return something meaningful here if needed.
    return "Data successfully inserted into SendCar table.";
  } catch (error) {
    console.log("Error occurred while executing SQL query:", error);
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
  postSendCarDate,
};
