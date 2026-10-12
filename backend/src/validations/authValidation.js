/* ===================================
   JANVOICE — AUTH VALIDATION
   Validation rules for authentication routes
   =================================== */

const { body } = require('express-validator')

// ===================================
// REGISTER VALIDATION
// ===================================
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can only contain letters, spaces, dots, apostrophes, and hyphens'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('role')
    .optional()
    .isIn([
      'citizen',
      'officer',
      'department_admin',
      'higher_authority',
      'system_admin'
    ])
    .withMessage('Invalid role')
]

// ===================================
// LOGIN VALIDATION
// ===================================
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
]

// ===================================
// FORGOT PASSWORD VALIDATION
// ===================================
const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
]

// ===================================
// RESET PASSWORD VALIDATION
// ===================================
const resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 32, max: 128 })
    .withMessage('Invalid reset token format'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
]

// ===================================
// CHANGE PASSWORD VALIDATION
// ===================================
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password')
      }
      return true
    })
]

// ===================================
// VERIFY OTP VALIDATION
// ===================================
const verifyOTPValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),

  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
]

// ===================================
// VERIFY EMAIL VALIDATION
// ===================================
const verifyEmailValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required')
]

// ===================================
// LOGOUT VALIDATION
// ===================================
const logoutValidation = [
  body('refreshToken')
    .optional()
    .isString()
    .withMessage('Refresh token must be a string')
]

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyOTPValidation,
  verifyEmailValidation,
  logoutValidation
}