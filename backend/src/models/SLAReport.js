/* ===================================
   JANVOICE — SLA REPORT MODEL
   SLA compliance tracking snapshots
   =================================== */

const slaReportSchema = new mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      required: true
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },

    department: {
      type: String,
      default: 'all'
    },

    // Overall metrics
    totalComplaints: { type: Number, default: 0 },
    resolvedComplaints: { type: Number, default: 0 },
    overdueComplaints: { type: Number, default: 0 },
    avgResolutionDays: { type: Number, default: 0 },

    // SLA compliance
    slaCompliance: { type: Number, default: 0 }, // percentage

    // By priority
    byPriority: [
      {
        priority: String,
        total: Number,
        resolved: Number,
        slaCompliance: Number,
        avgResolutionHours: Number
      }
    ],

    // By category
    byCategory: [
      {
        category: String,
        total: Number,
        resolved: Number,
        avgResolutionDays: Number
      }
    ],

    // By department
    byDepartment: [
      {
        department: String,
        total: Number,
        resolved: Number,
        overdue: Number,
        slaCompliance: Number
      }
    ],

    // Trends
    trend: [
      {
        date: Date,
        created: Number,
        resolved: Number
      }
    ],

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
)

slaReportSchema.index({ period: 1, periodStart: -1 })
slaReportSchema.index({ department: 1, reportDate: -1 })

module.exports = mongoose.model('SLAReport', slaReportSchema)