const express = require("express");
const configSql = require("./dbconfig");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbopration = require("./dbopration");
const router = express.Router();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

//for authentication
router.use((req, res, next) => {
  console.log("middleware");
  next();
});

//get --> all the orders from table
// router.route("/orders").get((req, res) => {
//   dbopration.getGalassWareOrders().then((result) => {
//     res.json(result);
//   });
// });

// router.route("/orders/:companyCode").get((req, res) => {
//   dbopration.getGalassWareOrder(req.params.companyCode).then((result) => {
//     res.json(result);
//   });
// });

//add the order and get the req.body from front add to header aplication/type content-type
router.route("/orders").post((req, res) => {
  let order = { ...req.body };
  dbopration.addOrder(order).then((result) => {
    res.status(200).json(result);
  });
});

const orderRoute = require("./routers/orderRoute");
app.use("/api", orderRoute);

app.listen(8080, () =>
  console.log("server is listening on http://localhost:" + 8080)
);

console.log(configSql);

dbopration.getGalassWareOrders().then((result) => {
  console.log(result);
});
