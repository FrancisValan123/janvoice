/* ===================================
   JANVOICE — ANALYTICS CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')

exports.getOverview = async (req, res) => {
  try {
    const { range = '30d' } = req.query

    const now = new Date()
    let startDate = new Date()
    switch (range) {
      case '7d': startDate.setDate(now.getDate() - 7); break
      case '30d': startDate.setDate(now.getDate() - 30); break
      case '90d': startDate.setDate(now.getDate() - 90); break
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break
      default: startDate.setDate(now.getDate() - 30)
    }

    const rangeQuery = { createdAt: { $gte: startDate } }

    const [
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      emergencyComplaints,
      totalUsers,
      totalOfficers,
      overdueComplaints
    ] = await Promise.all([
      Complaint.countDocuments(rangeQuery),
      Complaint.countDocuments({
        ...rangeQuery,
        status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
      }),
      Complaint.countDocuments({ ...rangeQuery, status: 'resolved' }),
      Complaint.countDocuments({
        ...rangeQuery,
        priority: 'emergency',
        status: { $ne: 'resolved' }
      }),
      User.countDocuments({ role: 'citizen', isActive: true }),
      User.countDocuments({ role: 'officer', isActive: true }),
      Complaint.countDocuments({
        ...rangeQuery,
        status: { $ne: 'resolved' },
        deadline: { $lt: now }
      })
    ])

    const resolutionRate =
      totalComplaints > 0
        ? Math.round((resolvedComplaints / totalComplaints) * 100)
        : 0

    const byCategory = await Complaint.aggregate([
      { $match: rangeQuery },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    const byPriority = await Complaint.aggregate([
      { $match: rangeQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])

    const byStatus = await Complaint.aggregate([
      { $match: rangeQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const trendDays = range === '7d' ? 7 : range === '90d' ? 90 : 30
    const trendStart = new Date()
    trendStart.setDate(now.getDate() - trendDays)

    const trend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: trendStart } } },
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
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ])

    const trendFormatted = trend.map((t) => ({
      date: `${t._id.year}-${String(t._id.month).padStart(2, '0')}-${String(t._id.day).padStart(2, '0')}`,
      created: t.created,
      resolved: t.resolved
    }))

    res.status(HTTP_STATUS.OK).json({
      success: true,
      range,
      kpis: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        emergencyComplaints,
        totalUsers,
        totalOfficers,
        overdueComplaints,
        resolutionRate
      },
      byCategory,
      byPriority,
      byStatus,
      trend: trendFormatted
    })
  } catch (error) {
    console.error('Analytics overview error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load analytics'
    })
  }
}

exports.getDepartmentPerformance = async (req, res) => {
  try {
    const performance = await Complaint.aggregate([
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
          }
        }
      },
      {
        $project: {
          _id: 1,
          total: 1,
          resolved: 1,
          pending: 1,
          sla: {
            $cond: [
              { $gt: ['$total', 0] },
              {
                $round: [
                  {
                    $multiply: [{ $divide: ['$resolved', '$total'] }, 100]
                  },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { total: -1 } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      departments: performance
    })
  } catch (error) {
    console.error('Dept performance error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch data'
    })
  }
}

exports.getPriorityDistribution = async (req, res) => {
  try {
    const { range = '30d' } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(range.replace('d', '')))

    const distribution = await Complaint.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      distribution
    })
  } catch (error) {
    console.error('Priority distribution error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch distribution'
    })
  }
}

exports.getGeographicStats = async (req, res) => {
  try {
    const byCity = await Complaint.aggregate([
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

    const byState = await Complaint.aggregate([
      { $group: { _id: '$location.state', count: { $sum: 1 } } },
      { $match: { _id: { $ne: '' } } },
      { $sort: { count: -1 } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      byCity,
      byState
    })
  } catch (error) {
    console.error('Geographic stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch geographic stats'
    })
  }
}