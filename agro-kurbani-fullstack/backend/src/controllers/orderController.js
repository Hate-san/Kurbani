const { sequelize, Order, OrderItem, Animal, Share, Payment, User } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

// POST /api/orders
// body: { items: [{ animal_id, shares }], payment_method, delivery_address, delivery_phone }
const createOrder = catchAsync(async (req, res) => {
  const { items, payment_method, delivery_address, delivery_phone } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'items must be a non-empty array of { animal_id, shares }');
  }
  if (!delivery_address || !delivery_phone) {
    throw new ApiError(400, 'delivery_address and delivery_phone are required');
  }

  const result = await sequelize.transaction(async (t) => {
    let totalPrice = 0;
    const orderItemsData = [];

    // Lock each animal row while we check/decrement availability, so two
    // simultaneous checkouts can't both claim the last share.
    for (const item of items) {
      const animal = await Animal.findByPk(item.animal_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (!animal) throw new ApiError(404, `Animal ${item.animal_id} not found`);

      const shares = Math.max(1, parseInt(item.shares, 10) || 1);
      if (animal.status === 'sold' || animal.available_shares < shares) {
        throw new ApiError(409, `Only ${animal.available_shares} share(s) left for "${animal.title}"`);
      }

      const subtotal = Number(animal.price_per_share) * shares;
      totalPrice += subtotal;
      orderItemsData.push({
        animal,
        shares,
        purchase_type: shares === animal.total_shares ? 'whole' : 'share',
        price_per_share: animal.price_per_share,
        subtotal,
      });
    }

    const order = await Order.create(
      {
        customer_id: req.user.id,
        total_price: totalPrice,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'paid',
        delivery_status: 'processing',
        delivery_address,
        delivery_phone,
      },
      { transaction: t }
    );

    for (const data of orderItemsData) {
      await OrderItem.create(
        {
          order_id: order.id,
          animal_id: data.animal.id,
          purchase_type: data.purchase_type,
          shares: data.shares,
          price_per_share: data.price_per_share,
          subtotal: data.subtotal,
        },
        { transaction: t }
      );

      // Issue one numbered share ticket per share purchased.
      const takenBefore = data.animal.total_shares - data.animal.available_shares;
      for (let i = 1; i <= data.shares; i++) {
        await Share.create(
          {
            animal_id: data.animal.id,
            customer_id: req.user.id,
            order_id: order.id,
            share_number: takenBefore + i,
          },
          { transaction: t }
        );
      }

      data.animal.available_shares -= data.shares;
      if (data.animal.available_shares <= 0) data.animal.status = 'sold';
      await data.animal.save({ transaction: t });
    }

    await Payment.create(
      {
        order_id: order.id,
        transaction_id: `MOCK-${Date.now()}`,
        payment_method,
        amount: totalPrice,
        status: order.payment_status,
        paid_at: order.payment_status === 'paid' ? new Date() : null,
      },
      { transaction: t }
    );

    return order;
  });

  const full = await Order.findByPk(result.id, {
    include: [{ model: OrderItem, as: 'items', include: [{ model: Animal, as: 'animal' }] }],
  });
  res.status(201).json({ order: full });
});

const listMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.findAll({
    where: { customer_id: req.user.id },
    include: [{ model: OrderItem, as: 'items', include: [{ model: Animal, as: 'animal' }] }],
    order: [['created_at', 'DESC']],
  });
  res.json({ orders });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: OrderItem, as: 'items', include: [{ model: Animal, as: 'animal' }] }, { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }],
  });
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = order.customer_id === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) throw new ApiError(403, 'Not authorized to view this order');

  res.json({ order });
});

// PUT /api/orders/:id - update delivery/payment status (admin only, enforced in routes)
const updateOrder = catchAsync(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const { delivery_status, payment_status } = req.body;
  if (delivery_status) order.delivery_status = delivery_status;
  if (payment_status) order.payment_status = payment_status;
  await order.save();
  res.json({ order });
});

// Orders for animals belonging to the logged-in farmer
const listOrdersForFarmer = catchAsync(async (req, res) => {
  const items = await OrderItem.findAll({
    include: [
      { model: Animal, as: 'animal', where: { farmer_id: req.user.id } },
      { model: Order, as: 'order', include: [{ model: User, as: 'customer', attributes: ['id', 'name'] }] },
    ],
    order: [['id', 'DESC']],
  });
  res.json({ items });
});

module.exports = { createOrder, listMyOrders, getOrder, updateOrder, listOrdersForFarmer };
