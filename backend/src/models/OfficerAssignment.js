/* ===================================
   JANVOICE — OFFICER ASSIGNMENT MODEL
   Tracks case-to-officer assignments
   =================================== */

const mongoose = require('mongoose')

const officerAssignmentSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    unassignedAt: Date,
    reason: {
      type: String,
      enum: ['initial-assignment', 'reassignment', 'leave', 'workload-balance', 'zone-change'],
      default: 'initial-assignment'
    },
    reassignmentReason: String,
    previousOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'reassigned', 'cancelled'],
      default: 'active'
    },
    notes: String
  },
  { timestamps: true }
)

officerAssignmentSchema.index({ complaint: 1, status: 1 })
officerAssignmentSchema.index({ officer: 1, status: 1 })
officerAssignmentSchema.index({ assignedAt: -1 })

module.exports = mongoose.model('OfficerAssignment', officerAssignmentSchema)