/* ===================================
   JANVOICE — FEEDBACK MODEL
   =================================== */

const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
      unique: true
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    department: {
      type: String,
      default: null
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: 500,
      default: ''
    },
    tags: [String],
    wouldRecommend: {
      type: Boolean,
      default: null
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

feedbackSchema.index({ officer: 1 })
feedbackSchema.index({ rating: -1 })
feedbackSchema.index({ department: 1 })

module.exports = mongoose.model('Feedback', feedbackSchema)