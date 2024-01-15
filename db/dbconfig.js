const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const { SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASS } = process.env;

const configSql = {
  server: SQL_SERVER,
  database: SQL_DATABASE,
  user: SQL_USER,
  password: SQL_PASS,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
    },
  },
};

const connectToDatabase = async () => {
  try {
    await sql.connect(configSql);
    console.log("Connected to SQL Server");
  } catch (error) {
    console.error("Error connecting to SQL Server:", error);
  }
};

connectToDatabase();

module.exports = configSql;
