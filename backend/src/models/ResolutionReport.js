const mongoose = require('mongoose')

const resolutionReportSchema = new mongoose.Schema(
  {
    complaint: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Complaint', 
      required: true, 
      unique: true 
    },
    officer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    department: { 
      type: String, 
      required: true 
    },
    resolutionSummary: { 
      type: String, 
      required: true 
    },
    actionTaken: { 
      type: String, 
      required: true 
    },
    resourcesUsed: String,
    followUpRequired: { 
      type: Boolean, 
      default: false 
    },
    followUpDate: Date,
    citizenSatisfied: { 
      type: String, 
      enum: ['yes', 'partial', 'no'], 
      default: 'yes' 
    },
    additionalNotes: String,
    status: { 
      type: String, 
      enum: ['submitted', 'acknowledged', 'reviewed'], 
      default: 'submitted' 
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('ResolutionReport', resolutionReportSchema)