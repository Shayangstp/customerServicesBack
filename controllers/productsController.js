const dbOpProducts = require("../utils/dbOpProducts");

const getProducts = async (req, res) => {
  try {
    dbOpProducts.getProducts().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};
const getExportProducts = async (req, res) => {
  try {
    dbOpProducts.getExportProducts().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getExportProducts,
  getProducts,
};
