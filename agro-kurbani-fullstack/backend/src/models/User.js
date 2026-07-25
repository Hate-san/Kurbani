const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('customer', 'farmer', 'admin'), allowNull: false, defaultValue: 'customer' },
  },
  { sequelize, modelName: 'User', tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

module.exports = User;
