const express = require('express')
const router = express.Router()
const { submitReport, getMyReports, getReportByComplaint } = require('../controllers/resolutionController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/roleCheck')

router.use(protect)
router.use(authorize('officer', 'department_admin', 'system_admin', 'higher_authority'))

router.get('/my', getMyReports)
router.get('/complaint/:id', getReportByComplaint)
router.post('/submit/:id', submitReport)

module.exports = router