const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(50) },
    payment_status: { type: DataTypes.ENUM('pending', 'paid', 'failed'), allowNull: false, defaultValue: 'pending' },
    delivery_status: { type: DataTypes.ENUM('processing', 'shipping', 'delivered'), allowNull: false, defaultValue: 'processing' },
    delivery_address: { type: DataTypes.STRING(255) },
    delivery_phone: { type: DataTypes.STRING(20) },
  },
  { sequelize, modelName: 'Order', tableName: 'orders', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

module.exports = Order;
