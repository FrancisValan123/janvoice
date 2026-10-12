/* ===================================
   JANVOICE — ANALYTICS SERVICE
   Complex aggregation & data processing
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const Feedback = require('../models/Feedback')

// ===================================
// DATE RANGE HELPER
// ===================================
const getDateRange = (range) => {
  const now = new Date()
  const startDate = new Date()

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 30)
  }

  return { startDate, endDate: now }
}

// ===================================
// COMPLAINT TREND
// ===================================
const getComplaintTrend = async (range = '30d') => {
  const { startDate } = getDateRange(range)

  const trend = await Complaint.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        created: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        escalated: {
          $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ])

  return trend.map((t) => ({
    date: `${t._id.year}-${String(t._id.month).padStart(2, '0')}-${String(
      t._id.day
    ).padStart(2, '0')}`,
    created: t.created,
    resolved: t.resolved,
    escalated: t.escalated
  }))
}

// ===================================
// PEAK HOURS ANALYSIS
// ===================================
const getPeakHours = async () => {
  return Complaint.aggregate([
    {
      $group: {
        _id: { $hour: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        hour: '$_id',
        count: 1,
        _id: 0
      }
    }
  ])
}

// ===================================
// DAY OF WEEK ANALYSIS
// ===================================
const getDayOfWeekStats = async () => {
  return Complaint.aggregate([
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])
}

// ===================================
// RESOLUTION TIME DISTRIBUTION
// ===================================
const getResolutionTimeDistribution = async () => {
  return Complaint.aggregate([
    {
      $match: {
        status: 'resolved',
        resolvedAt: { $ne: null }
      }
    },
    {
      $project: {
        hours: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60
          ]
        }
      }
    },
    {
      $bucket: {
        groupBy: '$hours',
        boundaries: [0, 1, 4, 12, 24, 48, 72, 168, 720],
        default: 'over-720',
        output: { count: { $sum: 1 } }
      }
    }
  ])
}

// ===================================
// OFFICER LEADERBOARD
// ===================================
const getOfficerLeaderboard = async (range = '30d', limit = 10) => {
  const { startDate } = getDateRange(range)

  return Complaint.aggregate([
    {
      $match: {
        assignedTo: { $ne: null },
        status: 'resolved',
        resolvedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$assignedTo',
        resolved: { $sum: 1 },
        avgMs: {
          $avg: { $subtract: ['$resolvedAt', '$createdAt'] }
        }
      }
    },
    { $sort: { resolved: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'officer'
      }
    },
    { $unwind: '$officer' },
    {
      $lookup: {
        from: 'feedbacks',
        localField: '_id',
        foreignField: 'officer',
        as: 'feedback'
      }
    },
    {
      $project: {
        _id: 1,
        name: '$officer.name',
        email: '$officer.email',
        department: '$officer.department',
        resolved: 1,
        avgDays: {
          $round: [{ $divide: ['$avgMs', 1000 * 60 * 60 * 24] }, 1]
        },
        avgRating: {
          $cond: [
            { $gt: [{ $size: '$feedback' }, 0] },
            { $round: [{ $avg: '$feedback.rating' }, 1] },
            null
          ]
        }
      }
    }
  ])
}

// ===================================
// SATISFACTION METRICS
// ===================================
const getSatisfactionMetrics = async (range = '30d') => {
  const { startDate } = getDateRange(range)

  const stats = await Feedback.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        total: { $sum: 1 },
        distribution: {
          $push: '$rating'
        }
      }
    }
  ])

  const result = stats[0] || { avgRating: 0, total: 0, distribution: [] }

  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  result.distribution.forEach((r) => {
    distribution[r] = (distribution[r] || 0) + 1
  })

  return {
    avgRating: result.avgRating ? Math.round(result.avgRating * 10) / 10 : 0,
    totalFeedback: result.total,
    distribution
  }
}

// ===================================
// GEOGRAPHIC DISTRIBUTION
// ===================================
const getGeographicDistribution = async (range = '30d') => {
  const { startDate } = getDateRange(range)

  return Complaint.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$location.city',
        count: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        }
      }
    },
    { $match: { _id: { $ne: '' } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ])
}

// ===================================
// DEPARTMENT COMPARISON
// ===================================
const getDepartmentComparison = async (range = '30d') => {
  const { startDate } = getDateRange(range)

  return Complaint.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        pending: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  ['pending', 'assigned', 'investigating', 'in-progress']
                ]
              },
              1,
              0
            ]
          }
        },
        overdue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$status', 'resolved'] },
                  { $lt: ['$deadline', new Date()] }
                ]
              },
              1,
              0
            ]
          }
        },
        avgMs: {
          $avg: { $subtract: ['$resolvedAt', '$createdAt'] }
        }
      }
    },
    {
      $project: {
        name: '$_id',
        total: 1,
        resolved: 1,
        pending: 1,
        overdue: 1,
        avgDays: {
          $round: [{ $divide: ['$avgMs', 1000 * 60 * 60 * 24] }, 1]
        },
        sla: {
          $cond: [
            { $gt: ['$total', 0] },
            {
              $round: [
                { $multiply: [{ $divide: ['$resolved', '$total'] }, 100] },
                0
              ]
            },
            0
          ]
        },
        _id: 0
      }
    },
    { $sort: { total: -1 } }
  ])
}

// ===================================
// KPI SUMMARY
// ===================================
const getKpiSummary = async (range = '30d') => {
  const { startDate } = getDateRange(range)

  const [total, resolved, pending, escalated, emergency, officers] =
    await Promise.all([
      Complaint.countDocuments({ createdAt: { $gte: startDate } }),
      Complaint.countDocuments({
        status: 'resolved',
        resolvedAt: { $gte: startDate }
      }),
      Complaint.countDocuments({
        status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
      }),
      Complaint.countDocuments({
        status: 'escalated',
        escalatedAt: { $gte: startDate }
      }),
      Complaint.countDocuments({
        priority: 'emergency',
        status: { $ne: 'resolved' }
      }),
      User.countDocuments({ role: 'officer', isActive: true })
    ])

  const avgResolution = await Complaint.aggregate([
    {
      $match: {
        status: 'resolved',
        resolvedAt: { $gte: startDate }
      }
    },
    {
      $project: {
        hours: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgHours: { $avg: '$hours' }
      }
    }
  ])

  return {
    total,
    resolved,
    pending,
    escalated,
    emergency,
    officers,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    avgResolutionDays: avgResolution[0]
      ? Math.round((avgResolution[0].avgHours / 24) * 10) / 10
      : 0
  }
}

module.exports = {
  getDateRange,
  getComplaintTrend,
  getPeakHours,
  getDayOfWeekStats,
  getResolutionTimeDistribution,
  getOfficerLeaderboard,
  getSatisfactionMetrics,
  getGeographicDistribution,
  getDepartmentComparison,
  getKpiSummary
}