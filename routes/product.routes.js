const products = require("../controllers/product.controller.js");

module.exports = app => {
  app.get('/products', products.getProductList);
};
