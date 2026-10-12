/* ===================================
   JANVOICE — AUDIT SERVICE
   Centralized audit logging
   =================================== */

const AuditLog = require('../models/AuditLog')
const logger = require('../utils/logger')

// ===================================
// LOG ACTION
// ===================================
const logAction = async ({
  user,
  action,
  category = 'system',
  severity = 'info',
  description = '',
  targetUser = null,
  targetId = null,
  ip = null,
  userAgent = null,
  method = null,
  endpoint = null,
  metadata = {}
}) => {
  try {
    const log = await AuditLog.create({
      user,
      action,
      category,
      severity,
      description,
      targetUser,
      targetId,
      ip,
      userAgent,
      method,
      endpoint,
      metadata
    })

    return log
  } catch (error) {
    logger.logError(error, 'auditService.logAction')
    return null
  }
}

// ===================================
// LOG FROM REQUEST (auto-extract context)
// ===================================
const logFromRequest = (req, options = {}) => {
  return logAction({
    user: req.user?.id,
    action: options.action || req.method,
    category: options.category || 'system',
    severity: options.severity || 'info',
    description: options.description || `${req.method} ${req.originalUrl}`,
    targetId: options.targetId || req.params?.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    method: req.method,
    endpoint: req.originalUrl,
    metadata: options.metadata || {}
  })
}

// ===================================
// CONVENIENCE WRAPPERS
// ===================================
const audit = {
  // Auth events
  login: (userId, ip, userAgent) =>
    logAction({
      user: userId,
      action: 'LOGIN',
      category: 'auth',
      severity: 'info',
      description: 'User logged in',
      ip,
      userAgent
    }),

  loginFailed: (email, ip, userAgent) =>
    logAction({
      user: null,
      action: 'LOGIN_FAILED',
      category: 'auth',
      severity: 'warning',
      description: `Failed login attempt for ${email}`,
      ip,
      userAgent,
      metadata: { email }
    }),

  logout: (userId, ip) =>
    logAction({
      user: userId,
      action: 'LOGOUT',
      category: 'auth',
      severity: 'info',
      description: 'User logged out',
      ip
    }),

  register: (userId, ip) =>
    logAction({
      user: userId,
      action: 'REGISTER',
      category: 'auth',
      severity: 'success',
      description: 'New user registered',
      ip
    }),

  passwordReset: (userId, ip) =>
    logAction({
      user: userId,
      action: 'PASSWORD_RESET',
      category: 'auth',
      severity: 'warning',
      description: 'Password reset',
      ip
    }),

  // Complaint events
  complaintCreated: (userId, complaintId, ip) =>
    logAction({
      user: userId,
      action: 'COMPLAINT_CREATED',
      category: 'complaint',
      severity: 'info',
      description: `Complaint ${complaintId} created`,
      targetId: complaintId,
      ip
    }),

  complaintAssigned: (userId, complaintId, officerId) =>
    logAction({
      user: userId,
      action: 'COMPLAINT_ASSIGNED',
      category: 'complaint',
      severity: 'info',
      description: `Complaint assigned to officer`,
      targetId: complaintId,
      targetUser: officerId
    }),

  complaintEscalated: (userId, complaintId, reason) =>
    logAction({
      user: userId,
      action: 'COMPLAINT_ESCALATED',
      category: 'complaint',
      severity: 'warning',
      description: `Complaint escalated: ${reason}`,
      targetId: complaintId
    }),

  complaintResolved: (userId, complaintId) =>
    logAction({
      user: userId,
      action: 'COMPLAINT_RESOLVED',
      category: 'complaint',
      severity: 'success',
      description: `Complaint ${complaintId} resolved`,
      targetId: complaintId
    }),

  // User management
  userCreated: (adminId, newUserId) =>
    logAction({
      user: adminId,
      action: 'USER_CREATED',
      category: 'user',
      severity: 'success',
      description: 'New user created by admin',
      targetUser: newUserId
    }),

  userUpdated: (adminId, userId, changes) =>
    logAction({
      user: adminId,
      action: 'USER_UPDATED',
      category: 'user',
      severity: 'info',
      description: 'User updated',
      targetUser: userId,
      metadata: { changes }
    }),

  userDeactivated: (adminId, userId) =>
    logAction({
      user: adminId,
      action: 'USER_DEACTIVATED',
      category: 'user',
      severity: 'warning',
      description: 'User account deactivated',
      targetUser: userId
    }),

  userDeleted: (adminId, userId) =>
    logAction({
      user: adminId,
      action: 'USER_DELETED',
      category: 'user',
      severity: 'danger',
      description: 'User account deleted',
      targetUser: userId
    }),

  // System events
  systemError: (message, metadata = {}) =>
    logAction({
      user: null,
      action: 'SYSTEM_ERROR',
      category: 'system',
      severity: 'danger',
      description: message,
      metadata
    }),

  systemConfigChanged: (userId, key, value) =>
    logAction({
      user: userId,
      action: 'CONFIG_CHANGED',
      category: 'system',
      severity: 'warning',
      description: `Config changed: ${key}`,
      metadata: { key, value }
    })
}

// ===================================
// GET LOGS WITH FILTERS
// ===================================
const getLogs = async ({
  user,
  action,
  category,
  severity,
  startDate,
  endDate,
  page = 1,
  limit = 50
} = {}) => {
  const query = {}
  if (user) query.user = user
  if (action) query.action = action
  if (category) query.category = category
  if (severity) query.severity = severity
  if (startDate || endDate) {
    query.createdAt = {}
    if (startDate) query.createdAt.$gte = new Date(startDate)
    if (endDate) query.createdAt.$lte = new Date(endDate)
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('user', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    AuditLog.countDocuments(query)
  ])

  return {
    logs,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit))
  }
}

// ===================================
// GET STATISTICS
// ===================================
const getAuditStats = async (days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const byCategory = await AuditLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ])

  const bySeverity = await AuditLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$severity', count: { $sum: 1 } } }
  ])

  const byAction = await AuditLog.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$action', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
  ])

  const total = await AuditLog.countDocuments({ createdAt: { $gte: since } })

  return { total, byCategory, bySeverity, byAction }
}

// ===================================
// CLEAN OLD LOGS
// ===================================
const cleanOldLogs = async (daysToKeep = 90) => {
  const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
  const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoff } })
  return result.deletedCount
}

module.exports = {
  logAction,
  logFromRequest,
  audit,
  getLogs,
  getAuditStats,
  cleanOldLogs
}