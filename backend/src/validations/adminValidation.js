/* ===================================
   JANVOICE — ADMIN VALIDATION
   Validation for admin & department operations
   =================================== */

const { body, param, query } = require('express-validator')

// ===================================
// ASSIGN OFFICER VALIDATION
// ===================================
const assignOfficerValidation = [
  param('complaintId')
    .isMongoId()
    .withMessage('Invalid complaint ID'),

  body('officerId')
    .notEmpty()
    .withMessage('Officer ID is required')
    .isMongoId()
    .withMessage('Invalid officer ID'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('priority')
    .optional()
    .isIn(['emergency', 'high', 'normal', 'low'])
    .withMessage('Invalid priority')
]

// ===================================
// DEPARTMENT VALIDATION
// ===================================
const createDepartmentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Department name must be between 3 and 100 characters'),

  body('code')
    .trim()
    .notEmpty()
    .withMessage('Department code is required')
    .isLength({ min: 2, max: 4 })
    .withMessage('Code must be between 2 and 4 characters')
    .isUppercase()
    .withMessage('Code must be uppercase'),

  body('head')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Head name cannot exceed 100 characters'),

  body('contactEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Invalid contact email')
    .normalizeEmail(),

  body('contactPhone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Contact phone cannot exceed 20 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex code'),

  body('slaTargets.emergency')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('Emergency SLA must be 1-720 hours'),

  body('slaTargets.high')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('High SLA must be 1-720 hours'),

  body('slaTargets.normal')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('Normal SLA must be 1-720 hours'),

  body('slaTargets.low')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('Low SLA must be 1-720 hours')
]

const updateDepartmentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid department ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Department name must be between 3 and 100 characters'),

  body('head')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Head name cannot exceed 100 characters'),

  body('contactEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
]

// ===================================
// CATEGORY VALIDATION
// ===================================
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be lowercase with hyphens'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Icon cannot exceed 10 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid hex color'),

  body('department')
    .optional()
    .trim(),

  body('severityWeight')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Severity weight must be 0-100'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a positive integer')
]

const updateCategoryValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid hex color'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
]

// ===================================
// BROADCAST NOTIFICATION VALIDATION
// ===================================
const broadcastValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),

  body('type')
    .optional()
    .isIn(['info', 'success', 'warning', 'danger', 'emergency'])
    .withMessage('Invalid notification type'),

  body('role')
    .optional()
    .isIn([
      'citizen',
      'officer',
      'department_admin',
      'higher_authority',
      'system_admin',
      'all'
    ])
    .withMessage('Invalid role target'),

  body('link')
    .optional()
    .trim()
    .isString()
    .withMessage('Link must be a string')
]

// ===================================
// AUDIT LOG QUERY VALIDATION
// ===================================
const auditLogQueryValidation = [
  query('action')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Action cannot exceed 100 characters'),

  query('category')
    .optional()
    .isIn(['auth', 'user', 'complaint', 'system', 'admin', 'all'])
    .withMessage('Invalid category'),

  query('severity')
    .optional()
    .isIn(['info', 'warning', 'danger', 'success', 'all'])
    .withMessage('Invalid severity'),

  query('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
]

// ===================================
// ANALYTICS QUERY VALIDATION
// ===================================
const analyticsQueryValidation = [
  query('range')
    .optional()
    .isIn(['7d', '30d', '90d', '1y', 'all'])
    .withMessage('Invalid range'),

  query('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department cannot exceed 100 characters'),

  query('from')
    .optional()
    .isISO8601()
    .withMessage('From date must be valid'),

  query('to')
    .optional()
    .isISO8601()
    .withMessage('To date must be valid')
]

// ===================================
// CONFIG UPDATE VALIDATION
// ===================================
const updateConfigValidation = [
  body('key')
    .trim()
    .notEmpty()
    .withMessage('Config key is required')
    .isLength({ max: 100 })
    .withMessage('Config key cannot exceed 100 characters'),

  body('value')
    .exists()
    .withMessage('Config value is required')
]

// ===================================
// BULK ACTION VALIDATION
// ===================================
const bulkActionValidation = [
  body('ids')
    .isArray({ min: 1, max: 100 })
    .withMessage('IDs array must contain 1-100 items'),

  body('ids.*')
    .isMongoId()
    .withMessage('All IDs must be valid MongoDB IDs'),

  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['activate', 'deactivate', 'delete'])
    .withMessage('Invalid bulk action')
]

// ===================================
// EXPORT
// ===================================
module.exports = {
  // Officer assignment
  assignOfficerValidation,
  // Department
  createDepartmentValidation,
  updateDepartmentValidation,
  // Category
  createCategoryValidation,
  updateCategoryValidation,
  // Broadcast
  broadcastValidation,
  // Audit
  auditLogQueryValidation,
  // Analytics
  analyticsQueryValidation,
  // Config
  updateConfigValidation,
  // Bulk
  bulkActionValidation
}