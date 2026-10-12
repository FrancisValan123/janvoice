/* ===================================
   JANVOICE — RATE LIMITER
   =================================== */

const rateLimit = require('express-rate-limit')

// Helper to safely get the IP (handles IPv4, IPv6, and mapped addresses)
const getIp = (req) => {
  return req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}

const baseConfig = {
  standardHeaders: true,
  legacyHeaders: false,
  // Fix for express-rate-limit v7+ IPv6 validation error
  validate: {
    xForwardedForHeader: false, // Prevents validation errors if you aren't using a proxy
  },
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      const ip = getIp(req)
      return ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1'
    }
    return false
  }
}

const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many login attempts. Try again later.'
  }
})

const apiLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: 'Too many requests. Slow down.' }
})

const uploadLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many uploads. Try again later.' }
})

const passwordResetLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many reset requests.' }
})

const registerLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many registrations.' }
})

const complaintLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many complaints submitted.' },
  // Use the safe IP helper here to prevent the ERR_ERL_KEY_GEN_IPV6 error
  keyGenerator: (req) => req.user?.id || getIp(req)
})

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
  passwordResetLimiter,
  registerLimiter,
  complaintLimiter,
  strictLimiter: apiLimiter,
  feedbackLimiter: apiLimiter
}