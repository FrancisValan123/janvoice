/* ===================================
   JANVOICE — COMPLAINT VALIDATION
   Validation for complaint operations
   =================================== */

const { body, param, query } = require('express-validator')

// ===================================
// CREATE COMPLAINT VALIDATION
// ===================================
const createComplaintValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'roads',
      'water',
      'sanitation',
      'electricity',
      'safety',
      'transport',
      'health',
      'education',
      'environment',
      'other'
    ])
    .withMessage('Invalid category'),

  body('priority')
    .optional()
    .isIn(['emergency', 'high', 'normal', 'low'])
    .withMessage('Invalid priority'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 500 })
    .withMessage('Address cannot exceed 500 characters'),

  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('State cannot exceed 100 characters'),

  body('location.pincode')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit pincode'),

  body('location.coordinates.lat')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),

  body('location.coordinates.lng')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),

  body('affectedPeople')
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Affected people must be between 1 and 1,000,000')
    .toInt(),

  body('evidence')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Evidence must be an array with max 10 items')
]

// ===================================
// UPDATE STATUS VALIDATION
// ===================================
const updateStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([
      'pending',
      'assigned',
      'investigating',
      'in-progress',
      'resolved',
      'rejected',
      'escalated',
      'closed'
    ])
    .withMessage('Invalid status'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
]

// ===================================
// REQUEST REASSIGNMENT VALIDATION
// ===================================
const requestReassignmentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),

  body('reasonCategory')
    .optional()
    .isIn(['conflict', 'jurisdiction', 'expertise', 'workload', 'personal', 'other'])
    .withMessage('Invalid reason category'),

  body('suggestedOfficer')
    .optional()
    .isMongoId()
    .withMessage('Invalid suggested officer ID'),

  body('urgency')
    .optional()
    .isIn(['low', 'normal', 'urgent'])
    .withMessage('Invalid urgency level')
]

// ===================================
// ESCALATE CASE VALIDATION
// ===================================
const escalateCaseValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['authority', 'resource', 'jurisdiction', 'political', 'safety', 'other'])
    .withMessage('Invalid escalation category'),

  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 30, max: 1000 })
    .withMessage('Reason must be between 30 and 1000 characters'),

  body('urgency')
    .notEmpty()
    .withMessage('Urgency is required')
    .isIn(['high', 'critical', 'emergency'])
    .withMessage('Invalid urgency level'),

  body('requestedAction')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Requested action cannot exceed 500 characters')
]

// ===================================
// UPLOAD ACTION EVIDENCE VALIDATION
// ===================================
const uploadActionEvidenceValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID'),

  body('url')
    .trim()
    .notEmpty()
    .withMessage('Evidence URL is required')
    .isURL()
    .withMessage('Invalid URL'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Evidence type is required')
    .isIn(['image', 'video', 'document'])
    .withMessage('Invalid evidence type'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),

  body('publicId')
    .optional()
    .trim()
    .isString()
    .withMessage('Public ID must be a string')
]

// ===================================
// COMPLAINT LIST QUERY VALIDATION
// ===================================
const listComplaintsValidation = [
  query('status')
    .optional()
    .isIn([
      'pending',
      'assigned',
      'investigating',
      'in-progress',
      'resolved',
      'rejected',
      'escalated',
      'closed',
      'all'
    ])
    .withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['emergency', 'high', 'normal', 'low', 'all'])
    .withMessage('Invalid priority filter'),

  query('category')
    .optional()
    .isIn([
      'roads',
      'water',
      'sanitation',
      'electricity',
      'safety',
      'transport',
      'health',
      'education',
      'environment',
      'other',
      'all'
    ])
    .withMessage('Invalid category filter'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),

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

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'priority', 'deadline', 'status'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
]

// ===================================
// COMPLAINT ID PARAM VALIDATION
// ===================================
const complaintIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid complaint ID')
]

// ===================================
// TRACK COMPLAINT VALIDATION
// ===================================
const trackComplaintValidation = [
  param('complaintId')
    .trim()
    .notEmpty()
    .withMessage('Complaint ID is required')
    .matches(/^JV\d{8}$/)
    .withMessage('Invalid complaint ID format (e.g., JV20260001)')
]

module.exports = {
  createComplaintValidation,
  updateStatusValidation,
  requestReassignmentValidation,
  escalateCaseValidation,
  uploadActionEvidenceValidation,
  listComplaintsValidation,
  complaintIdValidation,
  trackComplaintValidation
}