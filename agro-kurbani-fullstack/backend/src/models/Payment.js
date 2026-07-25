const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Payment extends Model {}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    transaction_id: { type: DataTypes.STRING(200) },
    payment_method: { type: DataTypes.STRING(100) },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' },
    paid_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Payment', tableName: 'payments', timestamps: false }
);

module.exports = Payment;
