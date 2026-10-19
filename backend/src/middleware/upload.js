/* ===================================
   JANVOICE — FILE UPLOAD MIDDLEWARE
   Uses Multer + Cloudinary
   =================================== */

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = 'auto'
    if (file.mimetype.startsWith('image/')) resourceType = 'image'
    else if (file.mimetype.startsWith('video/')) resourceType = 'video'
    else resourceType = 'raw'

    return {
      folder: 'janvoice/evidence',
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'pdf', 'doc', 'docx'],
      public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
      transformation:
        resourceType === 'image'
          ? [{ width: 1600, height: 1600, crop: 'limit', quality: 'auto' }]
          : undefined
    }
  }
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 5
  }
})

module.exports = { upload }