const dbOpCompanies = require("../utils/dbOpCompanies");

//sp controller
const getCompanies = async (req, res) => {
  try {
    dbOpCompanies.getCompanies().then((result) => {
      return res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCompanies };
