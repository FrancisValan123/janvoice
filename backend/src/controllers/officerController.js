/* ===================================
   JANVOICE — OFFICER CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const { HTTP_STATUS } = require('../config/constants')

exports.getDashboardStats = async (req, res) => {
  try {
    const officerId = req.user._id
    const today = new Date(new Date().setHours(0, 0, 0, 0))

    const [total, active, emergency, resolvedToday, resolved] =
      await Promise.all([
        Complaint.countDocuments({ assignedTo: officerId }),
        Complaint.countDocuments({
          assignedTo: officerId,
          status: { $in: ['assigned', 'investigating', 'in-progress'] }
        }),
        Complaint.countDocuments({
          assignedTo: officerId,
          priority: 'emergency',
          status: { $ne: 'resolved' }
        }),
        Complaint.countDocuments({
          assignedTo: officerId,
          status: 'resolved',
          resolvedAt: { $gte: today }
        }),
        Complaint.countDocuments({
          assignedTo: officerId,
          status: 'resolved'
        })
      ])

    const avgResolution = await Complaint.aggregate([
      {
        $match: {
          assignedTo: officerId,
          status: 'resolved',
          resolvedAt: { $ne: null }
        }
      },
      { $project: { duration: { $subtract: ['$resolvedAt', '$createdAt'] } } },
      { $group: { _id: null, avgMs: { $avg: '$duration' } } }
    ])

    const avgDays = avgResolution[0]
      ? Math.round((avgResolution[0].avgMs / (1000 * 60 * 60 * 24)) * 10) / 10
      : 0

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        total,
        active,
        emergency,
        resolvedToday,
        resolved,
        avgDays,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
      }
    })
  } catch (error) {
    console.error('Officer dashboard stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}

exports.getPriorityCases = async (req, res) => {
  try {
    const cases = await Complaint.find({
      assignedTo: req.user.id,
      status: { $ne: 'resolved' }
    })
      .populate('citizen', 'name phone')
      .sort({ priority: 1, deadline: 1 })
      .limit(10)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: cases.length,
      cases
    })
  } catch (error) {
    console.error('Priority cases error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch priority cases'
    })
  }
}

exports.getRecentActivity = async (req, res) => {
  try {
    const recent = await Complaint.find({ assignedTo: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('complaintId title status updatedAt statusHistory')

    const activities = recent.map((c) => {
      const lastUpdate = c.statusHistory[c.statusHistory.length - 1]
      return {
        id: c._id,
        complaintId: c.complaintId,
        title: c.title,
        status: c.status,
        action: lastUpdate?.note || 'Updated',
        time: c.updatedAt
      }
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      activities
    })
  } catch (error) {
    console.error('Recent activity error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch activity'
    })
  }
}

exports.getPerformanceMetrics = async (req, res) => {
  try {
    const officerId = req.user._id

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthly = await Complaint.aggregate([
      {
        $match: {
          assignedTo: officerId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const categories = await Complaint.aggregate([
      { $match: { assignedTo: officerId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      }
    ])

    const slaStats = await Complaint.aggregate([
      {
        $match: {
          assignedTo: officerId,
          status: 'resolved',
          resolvedAt: { $ne: null },
          deadline: { $ne: null }
        }
      },
      { $project: { onTime: { $lte: ['$resolvedAt', '$deadline'] } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          onTime: { $sum: { $cond: ['$onTime', 1, 0] } }
        }
      }
    ])

    const sla =
      slaStats[0] && slaStats[0].total > 0
        ? Math.round((slaStats[0].onTime / slaStats[0].total) * 100)
        : 100

    res.status(HTTP_STATUS.OK).json({
      success: true,
      performance: {
        monthly,
        categories,
        sla
      }
    })
  } catch (error) {
    console.error('Performance metrics error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch performance'
    })
  }
}