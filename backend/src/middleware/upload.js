/* ===================================
   JANVOICE — UPLOAD MIDDLEWARE
   =================================== */

const multer = require('multer')
const { FILE_LIMITS, HTTP_STATUS } = require('../config/constants')

// Memory storage (temp)
const memoryStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowed = [
    ...FILE_LIMITS.ALLOWED_IMAGE_TYPES,
    ...FILE_LIMITS.ALLOWED_VIDEO_TYPES,
    ...FILE_LIMITS.ALLOWED_DOC_TYPES
  ]

  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false)
  }
}

const uploadEvidence = multer({
  storage: memoryStorage,
  limits: {
    fileSize: FILE_LIMITS.MAX_SIZE_BYTES,
    files: FILE_LIMITS.MAX_FILES
  },
  fileFilter
}).array('files', FILE_LIMITS.MAX_FILES)

const uploadSingle = multer({
  storage: memoryStorage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter
}).single('image')

const uploadToMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: FILE_LIMITS.MAX_SIZE_BYTES, files: 1 }
}).single('file')

const handleUploadError = (err, res) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `File too large. Max ${FILE_LIMITS.MAX_SIZE_MB}MB.`
      })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Too many files. Max ${FILE_LIMITS.MAX_FILES}.`
      })
    }
  }
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: err.message || 'Upload failed'
  })
}

module.exports = {
  uploadEvidence,
  uploadSingle,
  uploadToMemory,
  handleUploadError
}