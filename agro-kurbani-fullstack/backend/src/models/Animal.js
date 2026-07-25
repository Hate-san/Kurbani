const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Animal extends Model {}

Animal.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    farmer_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    category: { type: DataTypes.ENUM('Cow', 'Goat', 'Sheep', 'Camel'), allowNull: false },
    breed: { type: DataTypes.STRING(100) },
    age: { type: DataTypes.STRING(50) },
    weight: { type: DataTypes.DECIMAL(8, 2) },
    farm_location: { type: DataTypes.STRING(150) },
    price_per_share: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total_shares: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1, max: 7 } },
    available_shares: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.ENUM('available', 'sold'), allowNull: false, defaultValue: 'available' },
  },
  { sequelize, modelName: 'Animal', tableName: 'animals', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

module.exports = Animal;
