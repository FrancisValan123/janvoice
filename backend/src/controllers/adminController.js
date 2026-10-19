/* ===================================
   JANVOICE — ADMIN CONTROLLER
   Handles privileged user creation with hierarchy rules
   =================================== */

const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { HTTP_STATUS } = require('../config/constants')
const { sendEmail } = require('../config/email')

// ===================================
// ROLE HIERARCHY
// ===================================
const CAN_CREATE = {
  system_admin: ['officer', 'department_admin', 'higher_authority', 'system_admin'],
  higher_authority: ['officer', 'department_admin'],
  department_admin: ['officer'],
  officer: [],
  citizen: []
}

const ROLES_REQUIRING_DEPARTMENT = ['officer', 'department_admin']
const CREATABLE_ROLES = ['officer', 'department_admin', 'higher_authority', 'system_admin']

// ===================================
// CREATE USER
// POST /api/admin/users
// ===================================
exports.createUser = async (req, res) => {
  try {
    const creatorRole = req.user.role
    const { name, email, password, phone, role, department, zone } = req.body

    // 1. Validate role
    if (!role || !CREATABLE_ROLES.includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: `Role must be one of: ${CREATABLE_ROLES.join(', ')}`
      })
    }

    // 2. Check hierarchy permission
    const allowedRoles = CAN_CREATE[creatorRole] || []
    if (!allowedRoles.includes(role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: `Your role cannot create users with role "${role}".`
      })
    }

    // 3. Validate required fields
    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Name, email, and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    // 4. Department required for certain roles
    if (ROLES_REQUIRING_DEPARTMENT.includes(role) && !department) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Department is required for this role'
      })
    }

    // 5. Check for existing user
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'A user with this email already exists'
      })
    }

    // 6. Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 7. Build payload
    const userPayload = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      isActive: true,
      isVerified: true
    }

    if (phone && phone.toString().trim().length === 10) {
      userPayload.phone = phone.toString().trim()
    }
    if (department) userPayload.department = department
    if (zone) userPayload.zone = zone

    // 8. Create user
    const newUser = await User.create(userPayload)

    // 9. Send welcome email
    if (typeof sendEmail === 'function') {
      sendEmail({
        to: newUser.email,
        subject: `Welcome to JanVoice — Your ${role.replace('_', ' ')} account is ready`,
        html: `<p>Welcome ${newUser.name}! Your account is ready.</p>`
      }).catch((err) => console.error('Welcome email failed:', err.message))
    }

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: `${role.replace('_', ' ')} user created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        phone: newUser.phone,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt
      }
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create user'
    })
  }
}

// ===================================
// LIST USERS
// GET /api/admin/users
// ===================================
exports.getUsers = async (req, res) => {
  try {
    const creatorRole = req.user.role
    const manageableRoles = CAN_CREATE[creatorRole] || []

    const { role, department, search, page = 1, limit = 20 } = req.query

    const query = {}

    if (manageableRoles.length > 0) {
      query.role = { $in: manageableRoles }
    } else {
      return res.status(HTTP_STATUS.OK).json({ success: true, count: 0, total: 0, page: 1, totalPages: 0, users: [] })
    }

    if (role && role !== 'all') query.role = role
    if (department && department !== 'all') query.department = department
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [users, total] = await Promise.all([
      User.find(query).select('-password -twoFactorSecret -twoFactorBackupCodes').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
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
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to fetch users' })
  }
}

// ===================================
// TOGGLE USER ACTIVE STATUS
// PATCH /api/admin/users/:id/toggle-active
// ===================================
exports.toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' })
    }

    const creatorRole = req.user.role
    const manageableRoles = CAN_CREATE[creatorRole] || []
    if (!manageableRoles.includes(user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: 'You do not have authority over this user' })
    }

    const currentUserId = (req.user._id || req.user.id).toString()
    if (user._id.toString() === currentUserId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'You cannot deactivate your own account' })
    }

    user.isActive = !user.isActive
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user: { id: user._id, name: user.name, email: user.email, isActive: user.isActive }
    })
  } catch (error) {
    console.error('Toggle active error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to toggle user status' })
  }
}

// ===================================
// RESET USER PASSWORD
// PATCH /api/admin/users/:id/reset-password
// ===================================
exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' })
    }

    const creatorRole = req.user.role
    const manageableRoles = CAN_CREATE[creatorRole] || []
    if (!manageableRoles.includes(user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: 'You do not have authority over this user' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.status(HTTP_STATUS.OK).json({ success: true, message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: 'Failed to reset password' })
  }
}

// ===================================
// UPDATE USER DEPARTMENT (NEW)
// PATCH /api/admin/users/:id/department
// ===================================
exports.updateUserDepartment = async (req, res) => {
  try {
    const { department } = req.body

    // System Admin can assign any department. 
    // Dept Admin can only assign their own department.
    if (req.user.role === 'department_admin' && department !== req.user.department) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You can only assign users to your own department'
      })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    user.department = department
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `User assigned to ${department} department`,
      user: { id: user._id, name: user.name, department: user.department }
    })
  } catch (error) {
    console.error('Update department error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to update user department'
    })
  }
}