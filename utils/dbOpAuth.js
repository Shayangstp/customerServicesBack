const configSql = require("../db/dbconfig");
const sql = require("mssql");

const signUpCustomer = async (values) => {
  console.log(values);
  try {
    let pool = await sql.connect(configSql);

    // Check if the codeMeli already exists
    const checkCodeMeliQuery = await pool
      .request()
      .input("codeMeli", sql.VarChar(255), values.codeMeli)
      .query("SELECT COUNT(*) AS count FROM Users WHERE codeMeli = @codeMeli");

    const { count: codeMeliCount } = checkCodeMeliQuery.recordset[0];

    if (codeMeliCount > 0) {
      const result = {
        code: 409,
        message: "کد ملی قبلا در سیستم ثبت شده است",
      };
      return result;
    }

    // Check if the phone number already exists
    const checkPhoneNumberQuery = await pool
      .request()
      .input("PhoneNumber", sql.VarChar(255), values.phoneNumber)
      .query(
        "SELECT COUNT(*) AS count FROM Users WHERE PhoneNumber = @PhoneNumber"
      );

    const { count: phoneNumberCount } = checkPhoneNumberQuery.recordset[0];

    if (phoneNumberCount > 0) {
      const result = {
        code: 409,
        message: "شماره تلفن قبلا در سیستم ثبت شده است",
      };
      return result;
    }

    // If no duplicate entry exists, proceed with inserting the new user
    const result = await pool
      .request()
      .input("codeMeli", sql.VarChar(255), values.codeMeli)
      .input("fullName", sql.VarChar(255), values.fullName)
      .input("PhoneNumber", sql.VarChar(255), values.phoneNumber)
      .input("password", sql.VarChar(255), values.password)
      .query(
        "INSERT INTO Users (codeMeli, fullName, PhoneNumber, password) VALUES (@codeMeli, @fullName, @PhoneNumber, @password)"
      );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const loginCustomer = async (values) => {
  try {
    const pool = await sql.connect(configSql); // Replace 'config' with your SQL Server connection configuration
    const result = await pool
      .request()
      .input("codeMeli", sql.VarChar(255), values.codeMeli)
      .input("password", sql.VarChar(255), values.password)
      .query(
        "SELECT * FROM Users WHERE codeMeli = @codeMeli AND password = @password"
      );

    if (result.recordset.length === 0) {
      // Login success
      const errorResult = {
        code: 401,
        message: "کد ملی یا رمز عبور اشتباه است",
      };
      return errorResult;
    }

    return result.recordset[0];
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



//forget password 
// app.post("/forgotpassword", async (req, res) => {
//   const { codeMeli } = req.body;

//   try {
//     // Check if the codeMeli exists in the database
//     const userQuery = await pool
//       .request()
//       .input("codeMeli", sql.VarChar(255), codeMeli)
//       .query("SELECT * FROM Users WHERE codeMeli = @codeMeli");

//     const user = userQuery.recordset[0];

//     if (!user) {
//       // If the codeMeli does not exist, return an error response
//       return res.status(404).json({ message: "کد ملی وارد شده معتبر نیست" });
//     }

//     // Generate a new password or a password reset token get the password
//     const newPassword = generateNewPassword(); // You may implement your own logic to generate a new password or a password reset token

//     // Update the user's password in the database
//     const updatePasswordResult = await pool
//       .request()
//       .input("codeMeli", sql.VarChar(255), codeMeli)
//       .input("newPassword", sql.VarChar(255), newPassword)
//       .query(
//         "UPDATE Users SET password = @newPassword WHERE codeMeli = @codeMeli"
//       );

//     // Send the new password to the user's email or phone number this nothind we make it
//     sendPasswordResetEmail(user.email, newPassword); // You may implement your own logic to send the password reset email or SMS

//     // Return a success response
//     return res
//       .status(200)
//       .json({ message: "رمز عبور جدید به ایمیل یا شماره تلفن شما ارسال شد" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "مشکلی در سرور رخ داده است" });
//   }
// });

module.exports = { signUpCustomer, loginCustomer };
