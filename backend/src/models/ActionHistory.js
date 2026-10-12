/* ===================================
   JANVOICE — ACTION HISTORY MODEL
   Detailed timeline of all actions
   =================================== */

const mongoose = require('mongoose')

const actionHistorySchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'assigned',
        'reassigned',
        'investigating',
        'status-updated',
        'evidence-uploaded',
        'action-evidence-uploaded',
        'note-added',
        'escalated',
        'resolved',
        'rejected',
        'closed',
        'reopened',
        'feedback-given'
      ]
    },
    fromStatus: String,
    toStatus: String,
    note: {
      type: String,
      maxlength: 1000
    },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
)

actionHistorySchema.index({ complaint: 1, createdAt: -1 })
actionHistorySchema.index({ performedBy: 1 })
actionHistorySchema.index({ action: 1 })

module.exports = mongoose.model('ActionHistory', actionHistorySchema)