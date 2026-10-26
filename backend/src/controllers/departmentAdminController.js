/* ===================================
   JANVOICE — DEPARTMENT ADMIN CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')

exports.getDashboard = async (req, res) => {
  try {
    const [total, pending, active, resolved, overdue, emergency] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'pending' }),
        Complaint.countDocuments({
          status: { $in: ['assigned', 'investigating', 'in-progress'] }
        }),
        Complaint.countDocuments({ status: 'resolved' }),
        Complaint.countDocuments({
          status: { $ne: 'resolved' },
          deadline: { $lt: new Date() }
        }),
        Complaint.countDocuments({
          priority: 'emergency',
          status: { $ne: 'resolved' }
        })
      ])

    const officerCount = await User.countDocuments({
      role: 'officer',
      isActive: true
    })

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
          }
        }
      }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        total,
        pending,
        active,
        resolved,
        overdue,
        emergency,
        officerCount,
        avgSla: total > 0 ? Math.round((resolved / total) * 100) : 0
      },
      departments
    })
  } catch (error) {
    console.error('Dept dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getUnassigned = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: 'pending',
      assignedTo: null
    })
      .populate('citizen', 'name email phone')
      .sort({ priority: 1, createdAt: 1 })
      .limit(50)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: complaints.length,
      complaints
    })
  } catch (error) {
    console.error('Unassigned error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch unassigned complaints'
    })
  }
}

exports.assignOfficer = async (req, res) => {
  try {
    const { officerId } = req.body
    const { complaintId } = req.params

    if (!officerId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Officer ID is required'
      })
    }

    const officer = await User.findById(officerId)
    if (!officer || officer.role !== 'officer') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid officer'
      })
    }

    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    complaint.assignedTo = officerId
    complaint.assignedAt = new Date()
    complaint.status = 'assigned'
    complaint.statusHistory.push({
      status: 'assigned',
      note: `Assigned to ${officer.name}`,
      updatedBy: req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Complaint assigned to ${officer.name}`,
      complaint
    })
  } catch (error) {
    console.error('Assign officer error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to assign officer'
    })
  }
}

exports.getOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      role: 'officer',
      isActive: true
    }).select('name email phone department zone')

    const counts = await Complaint.aggregate([
      {
        $match: {
          assignedTo: { $in: officers.map((o) => o._id) },
          status: { $in: ['assigned', 'investigating', 'in-progress'] }
        }
      },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
    ])

    const countsMap = counts.reduce((acc, c) => {
      acc[c._id.toString()] = c.count
      return acc
    }, {})

    const officersWithLoad = officers.map((o) => ({
      ...o.toObject(),
      activeCases: countsMap[o._id.toString()] || 0
    }))

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: officersWithLoad.length,
      officers: officersWithLoad
    })
  } catch (error) {
    console.error('Get officers error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch officers'
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: overdue.length,
      cases: overdue
    })
  } catch (error) {
    console.error('Overdue error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch overdue cases'
    })
  }
}

// ===================================
// GET DEPARTMENT STATS (✅ REAL DATA)
// ===================================
exports.getDepartmentStats = async (req, res) => {
  try {
    const departmentName = req.user.department

    if (!departmentName) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You are not assigned to a department.'
      })
    }

    // --- Aggregate Overall Stats ---
    const stats = await Complaint.aggregate([
      { $match: { department: departmentName } },
      {
        $group: {
          _id: null,
          totalComplaints: { $sum: 1 },
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
      }
    ])

    const totals = stats[0] || { totalComplaints: 0, resolved: 0, pending: 0 }
    const officers = await User.countDocuments({
      department: departmentName,
      role: 'officer',
      isActive: true
    })

    const slaPercent = totals.totalComplaints > 0
      ? Math.round((totals.resolved / totals.totalComplaints) * 100)
      : 0

    // --- Aggregate Avg Resolution Days ---
    const avgResolution = await Complaint.aggregate([
      {
        $match: {
          department: departmentName,
          status: 'resolved',
          resolvedAt: { $ne: null }
        }
      },
      {
        $project: {
          duration: { $subtract: ['$resolvedAt', '$createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgMs: { $avg: '$duration' }
        }
      }
    ])
    const avgDays = avgResolution[0]
      ? Math.round((avgResolution[0].avgMs / (1000 * 60 * 60 * 24)) * 10) / 10
      : 0

    // --- Aggregate Breakdown by Category ---
    const categories = await Complaint.aggregate([
      { $match: { department: departmentName } },
      {
        $group: {
          _id: '$category',
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
      }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        departmentName,
        totalComplaints: totals.totalComplaints,
        resolved: totals.resolved,
        pending: totals.pending,
        officers,
        slaPercent,
        avgDays,
        categories: categories || []
      }
    })
  } catch (error) {
    console.error('Dept stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}

exports.escalateCase = async (req, res) => {
  try {
    const { reason } = req.body

    if (!reason) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Escalation reason is required'
      })
    }

    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Complaint not found'
      })
    }

    complaint.status = 'escalated'
    complaint.escalatedAt = new Date()
    complaint.statusHistory.push({
      status: 'escalated',
      note: `Escalated: ${reason}`,
      updatedBy: req.user.id,
      updatedAt: new Date()
    })

    await complaint.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Case escalated to higher authority',
      complaint
    })
  } catch (error) {
    console.error('Escalate error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to escalate case'
    })
  }
}