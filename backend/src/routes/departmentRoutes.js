/* ===================================
   JANVOICE — DEPARTMENT ROUTES
   Base: /api/department
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getDashboard,
  getUnassigned,
  assignOfficer,
  getOfficers,
  getOverdueCases,
  getDepartmentStats,
  escalateCase
} = require('../controllers/departmentAdminController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

// All routes require Dept Admin
router.use(protect)
router.use(authorize('department_admin', 'system_admin'))

router.get('/dashboard', getDashboard)
router.get('/unassigned', getUnassigned)
router.put('/assign/:complaintId', assignOfficer)
router.get('/officers', getOfficers)
router.get('/overdue', getOverdueCases)
router.get('/stats', getDepartmentStats)
router.put('/escalate/:id', escalateCase)

module.exports = router