/* ===================================
   JANVOICE — NOTIFICATION MODEL
   =================================== */

const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'danger', 'emergency'],
      default: 'info'
    },
    category: {
      type: String,
      enum: ['complaint', 'assignment', 'status', 'feedback', 'system', 'alert'],
      default: 'system'
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000
    },
    link: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    read: {
      type: Boolean,
      default: false
    },
    readAt: Date,

    // Reference to related entity
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
      default: null
    },
    relatedModel: {
      type: String,
      enum: ['Complaint', 'User', 'Feedback'],
      default: null
    },

    // Email tracking
    emailQueued: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    emailSentAt: Date,
    emailFailed: { type: Boolean, default: false },
    emailAttempts: { type: Number, default: 0 },
    emailError: String,

    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, read: 1, createdAt: -1 })
notificationSchema.index({ user: 1, createdAt: -1 })
notificationSchema.index({ emailSent: 1, emailQueued: 1 })
notificationSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)