const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

// One row per individual numbered share ticket, per the SRS "shares" table.
class Share extends Model {}

Share.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    animal_id: { type: DataTypes.INTEGER, allowNull: false },
    customer_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    share_number: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: 'Share', tableName: 'shares', timestamps: true, createdAt: 'created_at', updatedAt: false }
);

module.exports = Share;
