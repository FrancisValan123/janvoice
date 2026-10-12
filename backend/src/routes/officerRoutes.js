/* ===================================
   JANVOICE — OFFICER ROUTES
   Base: /api/officer
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getDashboardStats,
  getPriorityCases,
  getRecentActivity,
  getPerformanceMetrics
} = require('../controllers/officerController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

router.use(protect)
router.use(authorize('officer'))

router.get('/stats', getDashboardStats)
router.get('/priority-cases', getPriorityCases)
router.get('/activity', getRecentActivity)
router.get('/performance', getPerformanceMetrics)

module.exports = router