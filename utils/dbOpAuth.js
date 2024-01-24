const configSql = require("../db/dbconfig");
const sql = require("mssql");

const signUpCustomer = async (values) => {
  console.log(values);
  try {
    let pool = await sql.connect(configSql);
    const result = await pool
      .request()
      .input("codeMeli", sql.VarChar(255), values.codeMeli)
      .input("fullName", sql.VarChar(255), values.fullName)
      .input("PhoneNumber", sql.VarChar(255), values.phoneNumber)
      .input("password", sql.VarChar(255), values.password)
      .query(
        "INSERT INTO Users (codeMeli, fullName, PhoneNumber , password) VALUES (@codeMeli, @fullName, @PhoneNumber , @password)"
      );
    return result;
  } catch (error) {
    console.log(error);
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
