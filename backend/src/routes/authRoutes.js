/* ===================================
   JANVOICE — AUTH ROUTES
   Base: /api/auth
   =================================== */

const express = require('express')
const router = express.Router()

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  updateProfile,
  changePassword,
  // ✅ New 2FA functions
  setupTwoFA,
  verifyTwoFA,
  disableTwoFA,
  verifyTwoFALogin
} = require('../controllers/authController')

const { protect } = require('../middleware/auth')
const {
  authLimiter,
  registerLimiter,
  passwordResetLimiter
} = require('../middleware/rateLimiter')

// ===================================
// PUBLIC ROUTES
// ===================================

router.post('/register', registerLimiter, register)
router.post('/login', authLimiter, login)
router.post('/forgot-password', passwordResetLimiter, forgotPassword)
router.get('/verify-reset-token/:token', verifyResetToken)
router.post('/reset-password', resetPassword)

// ✅ 2FA Login (public — user has already proven password but needs code)
router.post('/2fa/login', authLimiter, verifyTwoFALogin)

// ===================================
// PROTECTED ROUTES
// ===================================

router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/change-password', protect, changePassword)

// ✅ 2FA Management (require logged in user)
router.get('/2fa/setup', protect, setupTwoFA)
router.post('/2fa/verify', protect, verifyTwoFA)
router.post('/2fa/disable', protect, disableTwoFA)

module.exports = router