/* ===================================
   JANVOICE — HIGHER AUTHORITY CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')

exports.getDashboard = async (req, res) => {
  try {
    const [total, escalated, overdue, resolved, pending, emergency] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'escalated' }),
        Complaint.countDocuments({
          status: { $ne: 'resolved' },
          deadline: { $lt: new Date() }
        }),
        Complaint.countDocuments({ status: 'resolved' }),
        Complaint.countDocuments({
          status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
        }),
        Complaint.countDocuments({
          priority: 'emergency',
          status: { $ne: 'resolved' }
        })
      ])

    const avgResolution = await Complaint.aggregate([
      { $match: { status: 'resolved', resolvedAt: { $ne: null } } },
      { $project: { duration: { $subtract: ['$resolvedAt', '$createdAt'] } } },
      { $group: { _id: null, avgMs: { $avg: '$duration' } } }
    ])

    const avgDays = avgResolution[0]
      ? Math.round((avgResolution[0].avgMs / (1000 * 60 * 60 * 24)) * 10) / 10
      : 0

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        totalComplaints: total,
        escalated,
        overdue,
        resolved,
        pending,
        emergency,
        avgPerformance: total > 0 ? Math.round((resolved / total) * 100) : 0,
        avgDays
      }
    })
  } catch (error) {
    console.error('Authority dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getEscalatedComplaints = async (req, res) => {
  try {
    const { severity, page = 1, limit = 20 } = req.query

    const query = { status: 'escalated' }
    if (severity && severity !== 'all') query.priority = severity

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name email phone')
        .populate('assignedTo', 'name email')
        .sort({ escalatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query)
    ])

    const withDays = complaints.map((c) => {
      const days = Math.floor(
        (Date.now() - new Date(c.deadline).getTime()) / (1000 * 60 * 60 * 24)
      )
      return { ...c.toObject(), daysOverdue: Math.max(0, days) }
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: withDays.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      complaints: withDays
    })
  } catch (error) {
    console.error('Escalated error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch escalated complaints'
    })
  }
}

exports.getOverdueCases = async (req, res) => {
  try {
    const overdue = await Complaint.find({
      status: { $ne: 'resolved' },
      deadline: { $lt: new Date() }
    })
      .populate('citizen', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ deadline: 1 })

    const withDays = overdue.map((c) => ({
      ...c.toObject(),
      daysOverdue: Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(c.deadline).getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    }))

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: withDays.length,
      cases: withDays
    })
  } catch (error) {
    console.error('Overdue error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch overdue'
    })
  }
}

exports.getDepartmentComparison = async (req, res) => {
  try {
    const departments = await Complaint.aggregate([
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
          escalated: {
            $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] }
          },
          avgResolutionMs: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }
        }
      },
      {
        $project: {
          // ✅ Crucial: The frontend expects `name`, not `_id`
          name: '$_id',
          total: 1,
          resolved: 1,
          pending: 1,
          overdue: 1,
          escalated: 1,
          avgDays: {
            $round: [{ $divide: ['$avgResolutionMs', 1000 * 60 * 60 * 24] }, 1]
          },
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
          },
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      departments
    })
  } catch (error) {
    console.error('Dept comparison error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch comparison'
    })
  }
}

exports.getMonthlyStatistics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthly = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
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
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const formatted = monthly.map((m) => ({
      month: months[m._id.month - 1],
      year: m._id.year,
      created: m.created,
      resolved: m.resolved,
      escalated: m.escalated,
      rate: m.created > 0 ? Math.round((m.resolved / m.created) * 100) : 0
    }))

    res.status(HTTP_STATUS.OK).json({
      success: true,
      statistics: formatted
    })
  } catch (error) {
    console.error('Monthly stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}

exports.getPerformanceMonitor = async (req, res) => {
  try {
    const officers = await User.find({ role: 'officer', isActive: true }).select(
      'name email department'
    )

    const officerIds = officers.map((o) => o._id)

    const performance = await Complaint.aggregate([
      { $match: { assignedTo: { $in: officerIds } } },
      {
        $group: {
          _id: '$assignedTo',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          avgMs: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } }
        }
      }
    ])

    const perfMap = performance.reduce((acc, p) => {
      acc[p._id.toString()] = {
        total: p.total,
        resolved: p.resolved,
        avgDays:
          p.avgMs != null
            ? Math.round((p.avgMs / (1000 * 60 * 60 * 24)) * 10) / 10
            : 0,
        sla: p.total > 0 ? Math.round((p.resolved / p.total) * 100) : 0
      }
      return acc
    }, {})

    const officersWithPerf = officers.map((o) => ({
      ...o.toObject(),
      ...(perfMap[o._id.toString()] || {
        total: 0,
        resolved: 0,
        avgDays: 0,
        sla: 0
      })
    }))

    officersWithPerf.sort((a, b) => b.sla - a.sla)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      officers: officersWithPerf
    })
  } catch (error) {
    console.error('Performance monitor error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch performance'
    })
  }
}

exports.getActionTakenReport = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      'statusHistory.0': { $exists: true }
    })
      .populate('citizen', 'name')
      .populate('assignedTo', 'name')
      .sort({ updatedAt: -1 })
      .limit(100)

    const reports = complaints.map((c) => {
      const lastAction = c.statusHistory[c.statusHistory.length - 1]
      return {
        complaintId: c.complaintId,
        title: c.title,
        department: c.department,
        priority: c.priority,
        status: c.status,
        action: lastAction?.note || 'No action recorded',
        date: c.updatedAt
      }
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: reports.length,
      reports
    })
  } catch (error) {
    console.error('Action report error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch reports'
    })
  }
}

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = []

    const deptStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          department: '$_id',
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
          },
          _id: 0
        }
      }
    ])

    deptStats.forEach((d) => {
      if (d.sla < 85) {
        recommendations.push({
          id: `sla_${d.department}`,
          priority: d.sla < 75 ? 'high' : 'medium',
          icon: '📈',
          title: `Improve ${d.department} SLA`,
          description: `Current SLA is ${d.sla}%, below the 90% target.`,
          impact: 'Achieve 90%+ SLA compliance',
          action: `Reassign more officers to ${d.department}`
        })
      }
    })

    const officers = await Complaint.aggregate([
      {
        $match: { status: { $in: ['assigned', 'investigating', 'in-progress'] } }
      },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $match: { count: { $gte: 8 } } }
    ])

    if (officers.length > 0) {
      recommendations.push({
        id: 'workload_balance',
        priority: 'high',
        icon: '⚖️',
        title: 'Balance Officer Workload',
        description: `${officers.length} officers have 8+ active cases.`,
        impact: 'Prevent burnout and improve response',
        action: 'Redistribute cases to less busy officers'
      })
    }

    const overdueCount = await Complaint.countDocuments({
      status: { $ne: 'resolved' },
      deadline: { $lt: new Date() }
    })

    if (overdueCount > 5) {
      recommendations.push({
        id: 'overdue_action',
        priority: 'critical',
        icon: '🚨',
        title: 'Address Overdue Cases',
        description: `${overdueCount} cases are overdue.`,
        impact: 'Improve citizen satisfaction',
        action: 'Escalate overdue cases to department admins'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: recommendations.length,
      recommendations
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate recommendations'
    })
  }
}