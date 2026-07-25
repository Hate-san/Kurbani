const { User, Order, OrderItem, Animal } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

const listUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['created_at', 'DESC']] });
  res.json({ users });
});

const listAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: OrderItem, as: 'items', include: [{ model: Animal, as: 'animal' }] },
      { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
    ],
    order: [['created_at', 'DESC']],
  });
  res.json({ orders });
});

const reports = catchAsync(async (req, res) => {
  const [userCount, animalCount, orderCount, orders] = await Promise.all([
    User.count(),
    Animal.count(),
    Order.count(),
    Order.findAll({ attributes: ['total_price', 'payment_status'] }),
  ]);
  const revenue = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0);

  res.json({
    totals: { users: userCount, animals: animalCount, orders: orderCount, revenue },
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  await user.destroy();
  res.json({ message: 'User removed' });
});

module.exports = { listUsers, listAllOrders, reports, deleteUser };
