// import sql from "mssql";
const sql = require("mssql");

const configSql = {
  server: "SHAYAN\\SQLEXPRESS",
  database: "OT",
  user: "shayan",
  password: "sh5262",
  options: {
    encrypt: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
  },
};

// async function connectToDatabase() {
//   try {
//     await sql.connect(config);
//     console.log("Connected to SQL Server");
//   } catch (error) {
//     console.error("Error connecting to SQL Server:", error);
//   }
// }

// connectToDatabase();

module.exports = configSql;
