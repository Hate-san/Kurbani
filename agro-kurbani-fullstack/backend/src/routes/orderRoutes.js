const router = require('express').Router();
const { createOrder, listMyOrders, getOrder, updateOrder, listOrdersForFarmer } = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.post('/', requireAuth, requireRole('customer', 'admin'), createOrder);
router.get('/', requireAuth, listMyOrders);
router.get('/farmer/mine', requireAuth, requireRole('farmer'), listOrdersForFarmer);
router.get('/:id', requireAuth, getOrder);
router.put('/:id', requireAuth, requireRole('admin'), updateOrder);

module.exports = router;
