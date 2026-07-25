const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');
const { catchAsync, ApiError } = require('../middleware/errorHandler');

function sanitize(user) {
  const { id, name, email, phone, role, created_at } = user;
  return { id, name, email, phone, role, created_at };
}

const register = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'name, email and password are required');
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const allowedRoles = ['customer', 'farmer'];
  const finalRole = allowedRoles.includes(role) ? role : 'customer'; // admins are never self-registered

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, password: hashed, role: finalRole });

  const token = signToken(user);
  res.status(201).json({ user: sanitize(user), token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'email and password are required');

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, 'Invalid email or password');

  const token = signToken(user);
  res.json({ user: sanitize(user), token });
});

const getProfile = catchAsync(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});

const updateProfile = catchAsync(async (req, res) => {
  const { name, phone } = req.body;
  if (name) req.user.name = name;
  if (phone) req.user.phone = phone;
  await req.user.save();
  res.json({ user: sanitize(req.user) });
});

const logout = catchAsync(async (req, res) => {
  // Stateless JWT - logout is handled client-side by discarding the token.
  res.json({ message: 'Logged out' });
});

module.exports = { register, login, getProfile, updateProfile, logout };
