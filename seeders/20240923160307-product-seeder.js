'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      {
        product_name: 'Laptop',
        qty: 100,
        price: 1500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Phone',
        qty: 200,
        price: 800,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Headphones',
        qty: 50,
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
