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

//login

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const pool = await sql.connect(config); // Replace 'config' with your SQL Server connection configuration
//       const result = await pool.request()
//         .input('email', sql.VarChar(255), email)
//         .input('password', sql.VarChar(255), password)
//         .query('SELECT * FROM Users WHERE email = @email AND password = @password');

//       if (result.recordset.length === 1) {
//         // Login success
//         res.status(200).json({ message: 'Login successful' });
//       } else {
//         // Login failed
//         res.status(401).json({ message: 'Invalid email or password' });
//       }
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

module.exports = { signUpCustomer };
