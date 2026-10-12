/* ===================================
   JANVOICE — DEPARTMENT MODEL
   =================================== */

const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      maxlength: 4
    },
    description: String,
    head: {
      type: String,
      default: null
    },
    contactEmail: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    contactPhone: String,
    color: {
      type: String,
      default: '#FF6B35'
    },
    icon: {
      type: String,
      default: '🏛️'
    },
    officers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    categories: [String],
    zones: [String],
    slaTargets: {
      emergency: { type: Number, default: 1 },
      high: { type: Number, default: 4 },
      normal: { type: Number, default: 24 },
      low: { type: Number, default: 48 }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

departmentSchema.index({ isActive: 1 })

// ===================================
// VIRTUALS
// ===================================
departmentSchema.virtual('officerCount').get(function () {
  return this.officers?.length || 0
})

module.exports = mongoose.model('Department', departmentSchema)