/* ===================================
   JANVOICE — CLOUDINARY CONFIG
   =================================== */

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️  Cloudinary is not configured. File uploads will fail.')
} else {
  console.log('☁️  Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME)
}

module.exports = cloudinary