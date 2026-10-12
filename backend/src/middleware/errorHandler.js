/* ===================================
   JANVOICE — ERROR HANDLER
   =================================== */

class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404))
}

const handleMongooseError = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return new AppError(`${field} already exists`, 400, 'DUPLICATE_KEY')
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return new AppError(messages.join(', '), 400, 'VALIDATION_ERROR')
  }
  if (err.name === 'CastError') {
    return new AppError(`Invalid ${err.path}`, 400, 'CAST_ERROR')
  }
  return null
}

const handleJWTError = (err) => {
  if (err.name === 'TokenExpiredError') {
    return new AppError('Session expired. Please login again.', 401)
  }
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token', 401)
  }
  return null
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message }

  console.error('❌ Error:', err.message)

  error = handleMongooseError(err) || handleJWTError(err) || error

  const statusCode = error.statusCode || 500
  const message = error.message || 'Something went wrong'

  const response = {
    success: false,
    message,
    ...(error.code && { code: error.code })
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

const errors = {
  badRequest: (msg) => new AppError(msg, 400),
  unauthorized: (msg) => new AppError(msg, 401),
  forbidden: (msg) => new AppError(msg, 403),
  notFound: (msg) => new AppError(msg, 404),
  conflict: (msg) => new AppError(msg, 409),
  serverError: (msg) => new AppError(msg, 500)
}

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler,
  errors
}