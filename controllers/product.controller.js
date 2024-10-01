const db = require("../models");
const Product = db.Product;

exports.getProductList = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'product_name', 'price']
    });
    res.json(products);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving products."
    });
  }
};
