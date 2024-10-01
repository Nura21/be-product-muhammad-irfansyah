const orders = require("../controllers/order.controller.js");

module.exports = app => {
  app.get('/orders', orders.getOrders);
  app.get('/orders/:id', orders.getOrderDetails);
  app.post('/orders', orders.createOrder);
  app.put('/orders/:id', orders.updateOrder);
  app.delete('/orders/:id', orders.deleteOrder);
};
