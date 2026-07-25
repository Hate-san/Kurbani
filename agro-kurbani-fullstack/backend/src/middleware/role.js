const { ApiError } = require('./errorHandler');

// Usage: router.post('/animals', requireAuth, requireRole('farmer', 'admin'), handler)
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `This action requires one of these roles: ${allowedRoles.join(', ')}`));
    }
    next();
  };
}

module.exports = { requireRole };
