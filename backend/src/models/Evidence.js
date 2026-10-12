/* ===================================
   JANVOICE — EVIDENCE MODEL
   File upload metadata
   =================================== */

const mongoose = require('mongoose')

const evidenceSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio'],
      required: true
    },
    mimeType: String,
    originalName: String,
    size: Number,
    note: String,
    category: {
      type: String,
      enum: ['citizen-upload', 'officer-action', 'system'],
      default: 'citizen-upload'
    },
    thumbnailUrl: String,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

evidenceSchema.index({ complaint: 1 })
evidenceSchema.index({ uploadedBy: 1 })

module.exports = mongoose.model('Evidence', evidenceSchema)