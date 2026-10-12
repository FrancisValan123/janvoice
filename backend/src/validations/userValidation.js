/* ===================================
   JANVOICE — USER VALIDATION
   Validation for user profiles and management
   =================================== */

const { body, param, query } = require('express-validator')

// ===================================
// UPDATE PROFILE VALIDATION
// ===================================
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name contains invalid characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),

  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Street address cannot exceed 200 characters'),

  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('address.pincode')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit pincode')
]

// ===================================
// UPDATE USER (Admin) VALIDATION
// ===================================
const updateUserValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),

  body('role')
    .optional()
    .isIn([
      'citizen',
      'officer',
      'department_admin',
      'higher_authority',
      'system_admin'
    ])
    .withMessage('Invalid role'),

  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department cannot exceed 100 characters'),

  body('zone')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Zone cannot exceed 100 characters'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
]

// ===================================
// CREATE USER (Admin) VALIDATION
// ===================================
const createUserValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters'),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid mobile number'),

  body('role')
    .optional()
    .isIn([
      'citizen',
      'officer',
      'department_admin',
      'higher_authority',
      'system_admin'
    ])
    .withMessage('Invalid role'),

  body('department')
    .optional()
    .trim(),

  body('zone')
    .optional()
    .trim()
]

// ===================================
// USER PREFERENCES VALIDATION
// ===================================
const updatePreferencesValidation = [
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'bn'])
    .withMessage('Unsupported language'),

  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Invalid theme'),

  body('preferences.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Must be a boolean'),

  body('preferences.smsNotifications')
    .optional()
    .isBoolean()
    .withMessage('Must be a boolean')
]

// ===================================
// USER LIST QUERY VALIDATION
// ===================================
const listUsersValidation = [
  query('role')
    .optional()
    .isIn([
      'citizen',
      'officer',
      'department_admin',
      'higher_authority',
      'system_admin',
      'all'
    ])
    .withMessage('Invalid role filter'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'all'])
    .withMessage('Invalid status filter'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters')
]

// ===================================
// USER ID PARAM VALIDATION
// ===================================
const userIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
]

module.exports = {
  updateProfileValidation,
  updateUserValidation,
  createUserValidation,
  updatePreferencesValidation,
  listUsersValidation,
  userIdValidation
}