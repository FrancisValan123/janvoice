/* ===================================
   JANVOICE — SYSTEM ADMIN CONTROLLER
   =================================== */

const User = require('../models/User')
const Complaint = require('../models/Complaint')
const AuditLog = require('../models/AuditLog')
const bcrypt = require('bcryptjs')
const { HTTP_STATUS } = require('../config/constants')

exports.getAdminStats = async (req, res) => {
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

    const totalDepartments = await Complaint.distinct('department').then(
      (arr) => arr.length
    )

    const byRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        totalOfficers,
        totalDepartments,
        emergencyActive,
        resolvedToday,
        pendingComplaints,
        systemHealth: 99.8,
        byRole
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch stats'
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const {
      role,
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const query = {}
    if (role && role !== 'all') query.role = role
    if (status === 'active') query.isActive = true
    if (status === 'inactive') query.isActive = false
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      users
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({ success: true, user })
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, department, zone } = req.body

    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Name, email, and password are required'
      })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Email already in use'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: role || 'citizen',
      department,
      zone,
      isActive: true,
      isVerified: true
    })

    await AuditLog.create({
      user: req.user.id,
      action: 'CREATE_USER',
      description: `Created new user: ${user.email} (${user.role})`,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to create user'
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, phone, role, department, zone, isActive } = req.body

    const updates = {}
    if (name) updates.name = name.trim()
    if (phone) updates.phone = phone
    if (role) updates.role = role
    if (department !== undefined) updates.department = department
    if (zone !== undefined) updates.zone = zone
    if (typeof isActive === 'boolean') updates.isActive = isActive

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password')

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to update user'
    })
  }
}

exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You cannot deactivate your own account'
      })
    }

    user.isActive = !user.isActive
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user
    })
  } catch (error) {
    console.error('Toggle user error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to toggle status'
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'You cannot delete your own account'
      })
    }

    await user.deleteOne()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}

exports.getAuditLogs = async (req, res) => {
  try {
    const { action, userId, page = 1, limit = 50 } = req.query

    const query = {}
    if (action && action !== 'all') query.action = action
    if (userId) query.user = userId

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      AuditLog.countDocuments(query)
    ])

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      logs
    })
  } catch (error) {
    console.error('Audit logs error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch logs'
    })
  }
}

exports.getSystemHealth = async (req, res) => {
  try {
    const mongoose = require('mongoose')

    const dbState = mongoose.connection.readyState
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    const memUsage = process.memoryUsage()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      health: {
        status: 'operational',
        uptime: process.uptime(),
        database: {
          status: dbStates[dbState],
          isHealthy: dbState === 1
        },
        memory: {
          used: Math.round(memUsage.heapUsed / 1024 / 1024),
          total: Math.round(memUsage.heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        environment: process.env.NODE_ENV,
        nodeVersion: process.version
      }
    })
  } catch (error) {
    console.error('System health error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch health'
    })
  }
}