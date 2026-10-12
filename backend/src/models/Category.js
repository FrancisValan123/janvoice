/* ===================================
   JANVOICE — CATEGORY MODEL
   =================================== */

const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      default: '📁'
    },
    color: {
      type: String,
      default: '#718096'
    },
    description: String,
    department: {
      type: String,
      default: null
    },
    severityWeight: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    complaintsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

categorySchema.index({ slug: 1 })
categorySchema.index({ isActive: 1, displayOrder: 1 })

// Auto-generate slug from name
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
  }
  next()
})

module.exports = mongoose.model('Category', categorySchema)