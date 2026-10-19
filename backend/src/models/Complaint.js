/* ===================================
   JANVOICE — COMPLAINT MODEL
   =================================== */

const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'roads',
        'water',
        'sanitation',
        'electricity',
        'safety',
        'transport',
        'health',
        'education',
        'environment',
        'other'
      ]
    },
    priority: {
      type: String,
      enum: ['emergency', 'high', 'normal', 'low'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: [
        'pending',
        'assigned',
        'investigating',
        'in-progress',
        'resolved',
        'rejected',
        'escalated',
        'closed'
      ],
      default: 'pending'
    },
    department: {
      type: String,
      default: 'General'
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedAt: Date,
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
      }
    },
    affectedPeople: {
      type: Number,
      default: 1,
      min: 1
    },
    evidence: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video', 'document'] },
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    actionEvidence: [
      {
        url: String,
        publicId: String,
        type: { type: String, enum: ['image', 'video', 'document'] },
        note: String,
        uploadedAt: { type: Date, default: Date.now },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now }
      }
    ],

    // ✅ NEW: Notes added by officers or admins
    notes: [
      {
        text: { type: String, required: true, trim: true, maxlength: 1000 },
        type: {
          type: String,
          enum: ['observation', 'action', 'issue', 'update', 'internal'],
          default: 'observation'
        },
        isPrivate: { type: Boolean, default: false },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        time: { type: Date, default: Date.now }
      }
    ],

    deadline: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    escalatedAt: Date,
    escalationReason: String,
    alerts: {
      deadlineWarned: { type: Boolean, default: false },
      deadlineWarnedAt: Date,
      autoEscalated: { type: Boolean, default: false },
      autoEscalatedAt: Date
    },
    statusNotified: { type: Boolean, default: false }
  },
  { timestamps: true }
)

complaintSchema.index({ status: 1 })
complaintSchema.index({ priority: 1 })
complaintSchema.index({ assignedTo: 1 })
complaintSchema.index({ citizen: 1 })
complaintSchema.index({ department: 1 })
complaintSchema.index({ createdAt: -1 })
complaintSchema.index({ deadline: 1 })
complaintSchema.index({ complaintId: 1 })

complaintSchema.virtual('isOverdue').get(function () {
  if (!this.deadline) return false
  if (['resolved', 'closed'].includes(this.status)) return false
  return new Date(this.deadline) < new Date()
})

complaintSchema.virtual('daysOpen').get(function () {
  const end = this.resolvedAt || new Date()
  return Math.floor((end - this.createdAt) / (1000 * 60 * 60 * 24))
})

complaintSchema.pre('save', async function (next) {
  if (!this.complaintId) {
    const year = new Date().getFullYear()
    const count = await mongoose.model('Complaint').countDocuments()
    this.complaintId = `JV${year}${String(count + 1).padStart(4, '0')}`
  }
  next()
})

complaintSchema.statics.countByStatus = function (filter = {}) {
  return this.aggregate([
    { $match: filter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])
}

complaintSchema.statics.countByPriority = function (filter = {}) {
  return this.aggregate([
    { $match: filter },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ])
}

module.exports = mongoose.model('Complaint', complaintSchema)