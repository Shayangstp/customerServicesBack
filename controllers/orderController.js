const configSql = require("../dbconfig");
const sql = require("mssql");
const dbopration = require("../dbopration");

const getOrders = async (req, res) => {
  try {
    dbopration.getGalassWareOrders().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

//get one order id and get the specefic order (we do it with params)
const getOrder = async (req, res) => {
  try {
    dbopration.getGalassWareOrder(req.params.companyCode).then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

//this make order into the database not needed for this project
const addOrder = async (req, res) => {
  let order = { ...req.body };
  try {
    dbopration.addOrder(order).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getOrders, getOrder, addOrder };
