/* ===================================
   JANVOICE — COMPLAINT ROUTES
   Base: /api/complaints
   =================================== */

const express = require('express')
const router = express.Router()

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
  assignComplaint // ✅ ADDED
} = require('../controllers/complaintController')

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
  assignComplaint // ✅ ADDED
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
 * @access  Private (Officer, Dept Admin, System Admin)
 */
router.put(
  '/:id/status',
  authorize('officer', 'department_admin', 'system_admin'),
  updateStatus
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