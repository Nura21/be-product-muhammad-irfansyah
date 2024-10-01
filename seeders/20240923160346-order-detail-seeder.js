'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('OrderDetails', [
      {
        order_id: 1,
        product_id: 1,
        qty: 1,
        price: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order_id: 1,
        product_id: 3,
        qty: 1,
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        order_id: 2,
        product_id: 2,
        qty: 2,
        price: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('OrderDetails', null, {});
  }
};
