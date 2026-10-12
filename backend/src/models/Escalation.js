/* ===================================
   JANVOICE — ESCALATION MODEL
   =================================== */

const mongoose = require('mongoose')

const escalationSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    fromLevel: {
      type: String,
      enum: ['officer', 'department_admin', 'higher_authority', 'auto'],
      required: true
    },
    toLevel: {
      type: String,
      enum: ['department_admin', 'higher_authority', 'state_authority'],
      required: true
    },
    category: {
      type: String,
      enum: ['authority', 'resource', 'jurisdiction', 'political', 'safety', 'other'],
      default: 'other'
    },
    reason: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1000
    },
    urgency: {
      type: String,
      enum: ['high', 'critical', 'emergency'],
      default: 'high'
    },
    requestedAction: String,
    status: {
      type: String,
      enum: ['pending', 'acknowledged', 'action-taken', 'resolved', 'rejected'],
      default: 'pending'
    },
    acknowledgedAt: Date,
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolutionNote: String,
    resolvedAt: Date
  },
  { timestamps: true }
)

escalationSchema.index({ complaint: 1 })
escalationSchema.index({ status: 1 })
escalationSchema.index({ escalatedTo: 1 })

module.exports = mongoose.model('Escalation', escalationSchema)