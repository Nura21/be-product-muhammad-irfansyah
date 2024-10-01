const db = require("../models");
const { Op } = require('sequelize');
const { Order, OrderDetail, Product } = require('../models'); // Include your models

exports.getOrders = async (req, res) => {
  const { customer_name, order_date, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const whereClause = {};

  // Filter by customer name
  if (customer_name) whereClause.customer_name = { [Op.like]: `%${customer_name}%` };

  // Filter by order date (full day)
  if (order_date) {
    const startOfDay = new Date(order_date);
    const endOfDay = new Date(order_date);
    endOfDay.setHours(23, 59, 59, 999);

    whereClause.createdAt = {
      [Op.between]: [startOfDay, endOfDay]
    };
  }

  try {
    const orders = await Order.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: OrderDetail, include: [Product] }],
      order: [['createdAt', 'DESC']] // Sort by latest orders
    });

    res.json({
      data: orders.rows,
      total: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving orders."
    });
  }
};


// Create a new order
exports.createOrder = async (req, res) => {
  const { customer_name, products } = req.body;
  if (!products || products.length === 0) {
    return res.status(400).send({ message: "At least one product is required." });
  }

  try {
    let total_order_price = 0;
    for (const product of products) {
      const prod = await Product.findByPk(product.product_id);
      if (!prod || prod.qty < product.qty) {
        return res.status(400).send({ message: `Product ${product.product_id} is not available.` });
      }
      total_order_price += prod.price * product.qty;
    }

    const newOrder = await Order.create({ customer_name, total_order_price });
    const orderDetails = products.map(p => ({
      order_id: newOrder.id,
      product_id: p.product_id,
      qty: p.qty,
      price: p.price,
    }));
    await OrderDetail.bulkCreate(orderDetails);

    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the order."
    });
  }
};

// View order details
exports.getOrderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderDetail, include: [Product] }]
    });
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.send(order);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error retrieving order details"
    });
  }
};

// Edit an order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    let total_order_price = 0;
    for (const product of products) {
      const prod = await Product.findByPk(product.product_id);
      if (!prod || prod.qty < product.qty) {
        return res.status(400).send({ message: `Product ${product.product_id} is not available.` });
      }
      total_order_price += prod.price * product.qty;
    }

    order.total_order_price = total_order_price;
    await order.save();

    await OrderDetail.destroy({ where: { order_id: id } });
    const orderDetails = products.map(p => ({
      order_id: id,
      product_id: p.product_id,
      qty: p.qty,
      price: p.price,
    }));
    await OrderDetail.bulkCreate(orderDetails);

    res.send(order);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error updating order"
    });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    await OrderDetail.destroy({ where: { order_id: id } });
    await order.destroy();
    res.send({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error deleting order"
    });
  }
};
