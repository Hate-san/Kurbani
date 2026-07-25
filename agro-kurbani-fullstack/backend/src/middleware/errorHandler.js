// Central error handler. Any controller can call next(err) or throw inside an
// async route wrapped with catchAsync, and it lands here.
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors ? err.errors.map((e) => e.message) : [err.message],
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

// Wraps an async route handler so rejected promises reach errorHandler
// instead of crashing the process.
function catchAsync(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { notFound, errorHandler, catchAsync, ApiError };
