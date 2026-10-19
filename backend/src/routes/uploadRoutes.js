/* ===================================
   JANVOICE — UPLOAD ROUTES
   Base: /api/upload
   =================================== */

const express = require('express')
const router = express.Router()

const { upload } = require('../middleware/upload')
const { protect } = require('../middleware/auth')
const {
  uploadEvidence,
  deleteEvidence
} = require('../controllers/uploadController')

router.use(protect)

// @route   POST /api/upload/evidence
router.post('/evidence', upload.array('files', 5), uploadEvidence)

// @route   DELETE /api/upload/evidence/:publicId
router.delete('/evidence/:publicId', deleteEvidence)

module.exports = router