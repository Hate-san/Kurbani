const { Payment, Order } = require('../models');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

// These endpoints mock the SSLCommerz/Stripe redirect flow described in the SRS.
// In production, `createPayment` would call out to the gateway and return a
// redirect URL; `success`/`fail` are the gateway's webhook/callback URLs.

const createPayment = catchAsync(async (req, res) => {
  const { order_id } = req.body;
  const order = await Order.findByPk(order_id);
  if (!order) throw new ApiError(404, 'Order not found');

  // Mock gateway session - a real integration returns a hosted checkout URL here.
  res.json({
    checkout_url: `/mock-gateway/checkout?order=${order.id}`,
    transaction_id: `MOCK-${Date.now()}`,
  });
});

const paymentSuccess = catchAsync(async (req, res) => {
  const { order_id, transaction_id } = req.body;
  const order = await Order.findByPk(order_id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.payment_status = 'paid';
  await order.save();

  const payment = await Payment.findOne({ where: { order_id: order.id } });
  if (payment) {
    payment.status = 'paid';
    payment.transaction_id = transaction_id || payment.transaction_id;
    payment.paid_at = new Date();
    await payment.save();
  }

  res.json({ message: 'Payment confirmed', order });
});

const paymentFail = catchAsync(async (req, res) => {
  const { order_id } = req.body;
  const order = await Order.findByPk(order_id);
  if (!order) throw new ApiError(404, 'Order not found');

  order.payment_status = 'failed';
  await order.save();

  const payment = await Payment.findOne({ where: { order_id: order.id } });
  if (payment) {
    payment.status = 'failed';
    await payment.save();
  }

  res.json({ message: 'Payment marked as failed', order });
});

module.exports = { createPayment, paymentSuccess, paymentFail };
