const sequelize = require('../config/db');
const User = require('./User');
const Animal = require('./Animal');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Share = require('./Share');
const Payment = require('./Payment');

// A farmer (User) lists many Animals
User.hasMany(Animal, { foreignKey: 'farmer_id', as: 'animals' });
Animal.belongsTo(User, { foreignKey: 'farmer_id', as: 'farmer' });

// A customer (User) places many Orders
User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });

// An Order has many OrderItems; each OrderItem references one Animal
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Animal.hasMany(OrderItem, { foreignKey: 'animal_id', as: 'orderItems' });
OrderItem.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });

// Individual numbered share tickets
Animal.hasMany(Share, { foreignKey: 'animal_id', as: 'shareTickets' });
Share.belongsTo(Animal, { foreignKey: 'animal_id', as: 'animal' });
User.hasMany(Share, { foreignKey: 'customer_id', as: 'shares' });
Share.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Order.hasMany(Share, { foreignKey: 'order_id', as: 'shareTickets' });
Share.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// One Order has one Payment record
Order.hasOne(Payment, { foreignKey: 'order_id', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

module.exports = { sequelize, User, Animal, Order, OrderItem, Share, Payment };
