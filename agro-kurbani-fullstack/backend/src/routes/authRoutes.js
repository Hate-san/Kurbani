const router = require('express').Router();
const { register, login, getProfile, updateProfile, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.post('/logout', requireAuth, logout);

module.exports = router;
