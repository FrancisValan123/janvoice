/* ===================================
   JANVOICE — ANALYTICS ROUTES
   Base: /api/analytics
   =================================== */

const express = require('express')
const router = express.Router()

const {
  getOverview,
  getDepartmentPerformance,
  getPriorityDistribution,
  getGeographicStats
} = require('../controllers/analyticsController')

const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

router.use(protect)
router.use(
  authorize('department_admin', 'higher_authority', 'system_admin')
)

router.get('/overview', getOverview)
router.get('/departments', getDepartmentPerformance)
router.get('/priority', getPriorityDistribution)
router.get('/geographic', getGeographicStats)

module.exports = router