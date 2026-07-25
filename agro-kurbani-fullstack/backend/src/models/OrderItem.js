const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

// Represents one line of an order: N shares of one animal.
// purchase_type mirrors the SRS ('whole' when shares === animal.total_shares, else 'share').
class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    animal_id: { type: DataTypes.INTEGER, allowNull: false },
    purchase_type: { type: DataTypes.ENUM('whole', 'share'), allowNull: false, defaultValue: 'share' },
    shares: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price_per_share: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { sequelize, modelName: 'OrderItem', tableName: 'order_items', timestamps: false }
);

module.exports = OrderItem;
