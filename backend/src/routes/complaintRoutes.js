/* ===================================
   JANVOICE — COMPLAINT ROUTES
   Base: /api/complaints
   =================================== */

const express = require('express')
const router = express.Router()

// ✅ Imports for complaint controllers
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  getAssignedComplaints,
  updateStatus,
  uploadActionEvidence,
  requestReassignment,
  getOfficerStats,
  deleteComplaint,
  addNote,
  assignComplaint
} = require('../controllers/complaintController')

// ✅ Imports for resolution report controllers
const {
  submitReport,
  getMyReports,
  getReportByComplaint
} = require('../controllers/resolutionController')

// ✅ NEW IMPORT: Citizen Feedback Controller
const { giveFeedback } = require('../controllers/citizenController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')
const {
  complaintLimiter,
  uploadLimiter
} = require('../middleware/rateLimiter')

// ===================================
// ALL ROUTES BELOW REQUIRE AUTHENTICATION
// ===================================
router.use(protect)

// ===================================
// SPECIFIC ROUTES FIRST
// (IMPORTANT: Must be before /:id to avoid conflicts)
// ===================================

/**
 * @route   GET /api/complaints/my
 * @desc    Get all complaints submitted by the logged-in citizen
 * @access  Private
 */
router.get('/my', getMyComplaints)

/**
 * @route   GET /api/complaints/assigned
 * @desc    Get all complaints assigned to the logged-in officer
 * @access  Private (Officer, Dept Admin, System Admin)
 */
router.get(
  '/assigned',
  authorize('officer', 'department_admin', 'system_admin'),
  getAssignedComplaints
)

/**
 * @route   GET /api/complaints/officer-stats
 * @desc    Get performance metrics for the logged-in officer
 * @access  Private (Officer only)
 */
router.get(
  '/officer-stats',
  authorize('officer'),
  getOfficerStats
)

// ===================================
// RESOLUTION REPORT ROUTES
// ===================================

/**
 * @route   GET /api/complaints/reports/my
 * @desc    Get all resolution reports submitted by the logged-in officer
 * @access  Private (Officer only)
 */
router.get(
  '/reports/my',
  authorize('officer'),
  getMyReports
)

/**
 * @route   GET /api/complaints/reports/:id
 * @desc    Get the resolution report for a specific complaint
 * @access  Private (Officer only)
 */
router.get(
  '/reports/:id',
  authorize('officer'),
  getReportByComplaint
)

/**
 * @route   POST /api/complaints/reports/:id
 * @desc    Submit a resolution report for a specific complaint
 * @access  Private (Officer only)
 */
router.post(
  '/reports/:id',
  authorize('officer'),
  submitReport
)

// ===================================
// GENERAL ROUTES
// ===================================

/**
 * @route   POST /api/complaints
 * @desc    Submit a new complaint
 * @access  Private (Citizen only)
 */
router.post(
  '/',
  authorize('citizen'),
  complaintLimiter,
  createComplaint
)

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints in the system (with filters)
 * @access  Private (Dept Admin, Higher Authority, System Admin)
 */
router.get(
  '/',
  authorize('department_admin', 'higher_authority', 'system_admin'),
  getAllComplaints
)

// ===================================
// PARAMETERIZED ROUTES LAST
// ===================================

/**
 * @route   PUT /api/complaints/:id/assign
 * @desc    Assign a complaint to an officer
 * @access  Private (Dept Admin, System Admin)
 */
router.put(
  '/:id/assign',
  authorize('department_admin', 'system_admin'),
  assignComplaint
)

/**
 * @route   GET /api/complaints/:id
 * @desc    Get details of a single complaint by ID
 * @access  Private
 */
router.get('/:id', getComplaintById)

/**
 * @route   PUT /api/complaints/:id/status
 * @desc    Update the status of a complaint
 * @access  Private (Officer, Dept Admin, System Admin, Higher Authority) ✅ FIXED
 */
router.put(
  '/:id/status',
  authorize('officer', 'department_admin', 'system_admin', 'higher_authority'),
  updateStatus
)

/**
 * @route   PUT /api/complaints/:id/feedback
 * @desc    Submit feedback for a resolved complaint
 * @access  Private (Citizen only)
 */
router.put(
  '/:id/feedback',
  authorize('citizen'),
  giveFeedback
)

/**
 * @route   POST /api/complaints/:id/action-evidence
 * @desc    Upload evidence of action taken for a complaint
 * @access  Private (Officer only)
 */
router.post(
  '/:id/action-evidence',
  authorize('officer'),
  uploadLimiter,
  uploadActionEvidence
)

/**
 * @route   POST /api/complaints/:id/request-reassign
 * @desc    Request reassignment of a complaint to another officer/department
 * @access  Private (Officer only)
 */
router.post(
  '/:id/request-reassign',
  authorize('officer'),
  requestReassignment
)

/**
 * @route   POST /api/complaints/:id/notes
 * @desc    Add a note to a complaint
 * @access  Private (Officer, Dept Admin, System Admin)
 */
router.post(
  '/:id/notes',
  authorize('officer', 'department_admin', 'system_admin'),
  addNote
)

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a complaint
 * @access  Private
 */
router.delete('/:id', deleteComplaint)

module.exports = router