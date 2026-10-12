/* ===================================
   JANVOICE — AUDIT LOG MODEL
   =================================== */

const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    category: {
      type: String,
      enum: ['auth', 'user', 'complaint', 'system', 'admin'],
      default: 'system'
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'danger', 'success'],
      default: 'info'
    },
    description: {
      type: String,
      default: ''
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    ip: String,
    userAgent: String,
    method: String,
    endpoint: String,
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
)

auditLogSchema.index({ user: 1 })
auditLogSchema.index({ action: 1 })
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ category: 1, createdAt: -1 })

// Auto-delete after 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

module.exports = mongoose.model('AuditLog', auditLogSchema)