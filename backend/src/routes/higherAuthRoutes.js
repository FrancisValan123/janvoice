/* ===================================
   JANVOICE — HIGHER AUTHORITY ROUTES
   Base: /api/authority
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getDashboard,
  getEscalatedComplaints,
  getOverdueCases,
  getDepartmentComparison,
  getMonthlyStatistics,
  getPerformanceMonitor,
  getActionTakenReport,
  getRecommendations
} = require('../controllers/higherAuthorityController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

router.use(protect)
router.use(authorize('higher_authority', 'system_admin'))

router.get('/dashboard', getDashboard)
router.get('/escalated', getEscalatedComplaints)
router.get('/overdue', getOverdueCases)
router.get('/departments', getDepartmentComparison)
router.get('/statistics', getMonthlyStatistics)
router.get('/performance', getPerformanceMonitor)
router.get('/reports', getActionTakenReport)
router.get('/recommendations', getRecommendations)

module.exports = router