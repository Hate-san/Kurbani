const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const { ApiError } = require('./errorHandler');

// Verifies the Bearer token and attaches req.user (without the password hash).
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication required');

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) throw new ApiError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// Optional auth: attaches req.user if a valid token is present, but never blocks the request.
async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);
    if (user) req.user = user;
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, optionalAuth };
