/* ===================================
   JANVOICE — DASHBOARD CONTROLLER
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')

exports.getCitizenDashboard = async (req, res) => {
  try {
    const userId = req.user._id

    const [total, pending, active, resolved, emergency] = await Promise.all([
      Complaint.countDocuments({ citizen: userId }),
      Complaint.countDocuments({ citizen: userId, status: 'pending' }),
      Complaint.countDocuments({
        citizen: userId,
        status: { $in: ['assigned', 'investigating', 'in-progress'] }
      }),
      Complaint.countDocuments({ citizen: userId, status: 'resolved' }),
      Complaint.countDocuments({
        citizen: userId,
        priority: 'emergency',
        status: { $ne: 'resolved' }
      })
    ])

    const recent = await Complaint.find({ citizen: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('complaintId title category priority status createdAt updatedAt')

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: { total, pending, active, resolved, emergency },
      recent
    })
  } catch (error) {
    console.error('Citizen dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getOfficerDashboard = async (req, res) => {
  try {
    const officerId = req.user._id
    const today = new Date(new Date().setHours(0, 0, 0, 0))

    const [total, active, emergency, resolvedToday] = await Promise.all([
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
      })
    ])

    const priorityCases = await Complaint.find({
      assignedTo: officerId,
      status: { $ne: 'resolved' }
    })
      .populate('citizen', 'name phone')
      .sort({ priority: 1, deadline: 1 })
      .limit(5)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: { total, active, emergency, resolvedToday },
      priorityCases
    })
  } catch (error) {
    console.error('Officer dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getDepartmentDashboard = async (req, res) => {
  try {
    const [total, pending, active, resolved, overdue] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({
        status: { $in: ['assigned', 'investigating', 'in-progress'] }
      }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({
        status: { $ne: 'resolved' },
        deadline: { $lt: new Date() }
      })
    ])

    const departmentBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ])

    const officerCount = await User.countDocuments({
      role: 'officer',
      isActive: true
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        total,
        pending,
        active,
        resolved,
        overdue,
        officerCount,
        avgSla: total > 0 ? Math.round((resolved / total) * 100) : 0
      },
      departmentBreakdown
    })
  } catch (error) {
    console.error('Department dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getAuthorityDashboard = async (req, res) => {
  try {
    const [total, escalated, overdue, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'escalated' }),
      Complaint.countDocuments({
        status: { $ne: 'resolved' },
        deadline: { $lt: new Date() }
      }),
      Complaint.countDocuments({ status: 'resolved' })
    ])

    const escalations = await Complaint.find({ status: 'escalated' })
      .populate('citizen', 'name')
      .populate('assignedTo', 'name')
      .sort({ escalatedAt: -1 })
      .limit(5)

    const departmentPerformance = await Complaint.aggregate([
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
          name: '$_id',
          total: 1,
          resolved: 1,
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

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        total,
        escalated,
        overdue,
        resolved,
        avgPerformance: total > 0 ? Math.round((resolved / total) * 100) : 0
      },
      escalations,
      departmentPerformance
    })
  } catch (error) {
    console.error('Authority dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalComplaints,
      totalOfficers,
      emergencyActive,
      resolvedToday,
      pendingComplaints
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Complaint.countDocuments(),
      User.countDocuments({ role: 'officer', isActive: true }),
      Complaint.countDocuments({
        priority: 'emergency',
        status: { $ne: 'resolved' }
      }),
      Complaint.countDocuments({
        status: 'resolved',
        resolvedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Complaint.countDocuments({
        status: { $in: ['pending', 'assigned', 'investigating', 'in-progress'] }
      })
    ])

    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])

    const recentComplaints = await Complaint.find()
      .populate('citizen', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        totalOfficers,
        emergencyActive,
        resolvedToday,
        pendingComplaints,
        systemHealth: 99.8
      },
      usersByRole,
      recentComplaints
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to load dashboard'
    })
  }
}

exports.getDashboard = async (req, res) => {
  const { role } = req.user

  switch (role) {
    case 'citizen':
      return exports.getCitizenDashboard(req, res)
    case 'officer':
      return exports.getOfficerDashboard(req, res)
    case 'department_admin':
      return exports.getDepartmentDashboard(req, res)
    case 'higher_authority':
      return exports.getAuthorityDashboard(req, res)
    case 'system_admin':
      return exports.getAdminDashboard(req, res)
    default:
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid role'
      })
  }
}