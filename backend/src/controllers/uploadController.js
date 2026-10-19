/* ===================================
   JANVOICE — UPLOAD CONTROLLER
   =================================== */

const cloudinary = require('../config/cloudinary')

exports.uploadEvidence = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      })
    }

    const uploadedFiles = req.files.map((file) => {
      let type = 'document'
      if (file.mimetype.startsWith('image/')) type = 'image'
      else if (file.mimetype.startsWith('video/')) type = 'video'

      return {
        url: file.path,
        publicId: file.filename,
        type,
        name: file.originalname,
        size: file.size
      }
    })

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'File upload failed'
    })
  }
}

exports.deleteEvidence = async (req, res) => {
  try {
    const { publicId } = req.params

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'publicId is required'
      })
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })

    res.status(200).json({
      success: true,
      message: 'File deleted'
    })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    })
  }
}