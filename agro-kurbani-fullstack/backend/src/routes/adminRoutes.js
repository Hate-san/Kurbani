const router = require('express').Router();
const { listUsers, listAllOrders, reports, deleteUser } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

router.use(requireAuth, requireRole('admin'));

router.get('/users', listUsers);
router.get('/orders', listAllOrders);
router.get('/reports', reports);
router.delete('/user/:id', deleteUser);

module.exports = router;
