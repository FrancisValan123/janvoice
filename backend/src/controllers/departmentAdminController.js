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

exports.getDepartmentStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
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
          name: '$_id',
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
          },
          _id: 0
        }
      },
      { $sort: { total: -1 } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      departments: stats
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