const router = require('express').Router();
const { createPayment, paymentSuccess, paymentFail } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');

router.post('/create', requireAuth, createPayment);
router.post('/success', paymentSuccess); // gateway callback - no user session
router.post('/fail', paymentFail);       // gateway callback - no user session

module.exports = router;
