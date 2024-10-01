'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Orders', [
      {
        customer_name: 'John Doe',
        total_order_price: 3000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        customer_name: 'Jane Smith',
        total_order_price: 1600,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Orders', null, {});
  }
};
