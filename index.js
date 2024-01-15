const express = require("express");
const configSql = require("./db/dbconfig");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbopration = require("./utils/dbopration");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();
const { PORT } = process.env;

const app = express();

//express config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

//for authentication
router.use((req, res, next) => {
  // console.log("middleware");
  next();
});

app.listen(PORT, () =>
  console.log("server is listening on http://localhost:" + PORT)
);

const orderRoute = require("./routers/orderRoute");
app.use("/api", orderRoute);

//customer
const customerRoute = require("./routers/customerRoute");
app.use("/api", customerRoute);

//companies
const companiesRoute = require("./routers/companiesRoute");
app.use("/api", companiesRoute);

//products
const productsRoute = require("./routers/productsRoute");
app.use("/api", productsRoute);

//db test table
dbopration.getGalassWareOrders().then((result) => {
  // console.log(result);
});
