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
        order.carDetail = null;
      }
      let orderDelivered = await pool
        .request()
        .input("OrderNo", sql.Numeric, order.OrderNo)
        .query(
          "SELECT OrderNumbersAccepted , OrderLooksAccepted  FROM OrderDelivered WHERE OrderNo = @OrderNo"
        );

      if (orderDelivered.recordset.length > 0) {
        order.orderDelivered = {
          orderNumbersAccepted:
            orderDelivered.recordset[0].OrderNumbersAccepted,
          OrderLooksAccepted: orderDelivered.recordset[0].OrderLooksAccepted,
        };
      } else {
        order.orderDelivered = null;
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

//carDetail update and insert
const postCustomerCarDetail = async (
  plate,
  model,
  driverName,
  orderNo,
  date
) => {
  try {
    let pool = await sql.connect(configSql);
    let request = await pool.request();

    // Check if the plate number already exists in the database
    const checkQuery = `
      SELECT COUNT(*) AS count FROM CarDetail WHERE OrderNo = @OrderNo;
    `;

    request.input("OrderNo", sql.Int, orderNo);

    const result = await request.query(checkQuery);
    const count = result.recordset[0].count;

    if (count > 0) {
      // If the plate number exists, update the existing record
      const updateQuery = `
        UPDATE CarDetail
        SET Model = @Model, DriverName = @DriverName, Plate = @Plate, Date = @Date
        WHERE OrderNo = @OrderNo;
      `;

      request.input("Model", sql.VarChar(50), model);
      request.input("DriverName", sql.VarChar(50), driverName);
      request.input("Plate", sql.VarChar(50), plate);
      request.input("Date", sql.DateTime, date);

      await request.query(updateQuery);

      return "Data successfully updated in CarDetail table.";
    } else {
      // If the plate number doesn't exist, insert a new record
      const insertQuery = `
        INSERT INTO CarDetail (Plate, Model, DriverName, OrderNo , Date) 
        VALUES (@Plate ,@Model ,@DriverName ,@OrderNo ,@Date); 
      `;

      request.input("Model", sql.VarChar(50), model);
      request.input("DriverName", sql.VarChar(50), driverName);
      request.input("Plate", sql.VarChar(50), plate);
      request.input("Date", sql.DateTime, date);

      await request.query(insertQuery);

      return "Data successfully inserted into CarDetail table.";
    }
  } catch (error) {
    console.log("Error occurred while executing SQL query:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const postOrderDelivered = async (
  orderNumbersAccepted,
  orderlooksAccepted,
  date,
  orderNo
) => {
  try {
    let pool = await sql.connect(configSql);
    let request = await pool.request();

    // Prepare the SQL query to insert data into SendCar table
    const query = `
      INSERT INTO OrderDelivered (OrderNumbersAccepted, OrderLooksAccepted, date, OrderNo) 
      VALUES (@OrderNumbersAccepted ,@OrderLooksAccepted ,@date ,@OrderNo); 
    `;

    // Input parameters for the SQL query
    request.input("OrderNumbersAccepted", sql.Int, orderNumbersAccepted);
    request.input("OrderLooksAccepted", sql.Int, orderlooksAccepted);
    request.input("date", sql.DateTime, date);
    request.input("OrderNo", sql.Int, orderNo);

    // Execute the SQL query
    await request.query(query);

    // Optionally, you may return something meaningful here if needed.
    return "Data successfully inserted into SendCar table.";
  } catch (error) {
    console.log("Error occurred while executing SQL query:", error);
    throw error; // Rethrow the error to handle it in the calling function
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
  postCustomerCarDetail,
  postOrderDelivered,
};
