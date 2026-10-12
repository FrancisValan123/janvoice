/* ===================================
   JANVOICE — CLOUDINARY CONFIGURATION
   =================================== */

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

const verifyCloudinary = async () => {
  try {
    await cloudinary.api.ping()
    console.log('✅ Cloudinary connected')
    return true
  } catch (error) {
    console.warn('⚠️  Cloudinary error:', error.message)
    return false
  }
}

const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
  } catch (error) {
    console.error('❌ Delete failed:', error.message)
    throw error
  }
}

const deleteFiles = async (files = []) => {
  if (!files.length) return { deleted: 0 }

  const promises = files.map((f) =>
    deleteFile(f.publicId, f.type || 'image')
  )

  const results = await Promise.all(promises)
  return {
    deleted: results.filter((r) => r.result === 'ok').length,
    total: files.length
  }
}

const getFileUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, { secure: true, ...options })
}

const getThumbnail = (publicId) => {
  return cloudinary.url(publicId, {
    secure: true,
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  })
}

module.exports = {
  cloudinary,
  verifyCloudinary,
  deleteFile,
  deleteFiles,
  getFileUrl,
  getThumbnail
}