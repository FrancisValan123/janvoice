/* ===================================
   JANVOICE — ESCALATION SERVICE
   Handles automatic + manual escalations
   =================================== */

const Complaint = require('../models/Complaint')
const Escalation = require('../models/Escalation')
const User = require('../models/User')
const Notification = require('../models/Notification')
const logger = require('../utils/logger')

// ===================================
// LEVEL HIERARCHY
// ===================================
const LEVELS = {
  officer: { next: 'department_admin', level: 1 },
  department_admin: { next: 'higher_authority', level: 2 },
  higher_authority: { next: null, level: 3 }
}

// ===================================
// CHECK IF ESCALATION NEEDED
// ===================================
const checkEscalationNeeded = (complaint) => {
  // Already resolved
  if (['resolved', 'closed', 'rejected'].includes(complaint.status)) {
    return null
  }

  // Already escalated
  if (complaint.status === 'escalated') return null

  const now = new Date()
  const deadline = complaint.deadline ? new Date(complaint.deadline) : null
  const createdAt = new Date(complaint.createdAt)

  if (!deadline) return null

  const hoursOverdue = (now - deadline) / (1000 * 60 * 60)

  // Emergency: escalate if overdue
  if (complaint.priority === 'emergency' && hoursOverdue > 0) {
    return { reason: 'Emergency case overdue', hoursOverdue }
  }

  // High: escalate if 6+ hours overdue
  if (complaint.priority === 'high' && hoursOverdue > 6) {
    return { reason: 'High-priority case overdue by 6+ hours', hoursOverdue }
  }

  // Normal: escalate if 24+ hours overdue
  if (complaint.priority === 'normal' && hoursOverdue > 24) {
    return { reason: 'Case overdue by 24+ hours', hoursOverdue }
  }

  // Low: escalate if 72+ hours overdue
  if (complaint.priority === 'low' && hoursOverdue > 72) {
    return { reason: 'Case overdue by 72+ hours', hoursOverdue }
  }

  return null
}

// ===================================
// ESCALATE COMPLAINT
// ===================================
const escalateComplaint = async ({
  complaint,
  escalatedBy = null,
  reason,
  category = 'auto',
  urgency = 'high'
}) => {
  try {
    const currentStatus = complaint.status

    // Update complaint
    complaint.status = 'escalated'
    complaint.escalatedAt = new Date()
    complaint.escalationReason = reason

    // Find escalation target
    const currentRole = escalatedBy
      ? (await User.findById(escalatedBy))?.role
      : 'officer'
    const nextLevel = LEVELS[currentRole]?.next || 'higher_authority'

    // Find authority in that role
    const targetUser = await User.findOne({
      role: nextLevel,
      isActive: true
    })

    if (targetUser) {
      complaint.escalatedTo = targetUser._id
    }

    // Add to status history
    complaint.statusHistory.push({
      status: 'escalated',
      note: reason,
      updatedBy: escalatedBy,
      updatedAt: new Date()
    })

    await complaint.save()

    // Create escalation record
    const escalation = await Escalation.create({
      complaint: complaint._id,
      escalatedBy: escalatedBy || complaint.assignedTo || complaint.citizen,
      escalatedTo: targetUser?._id || null,
      fromLevel: currentRole,
      toLevel: nextLevel,
      category,
      reason,
      urgency,
      status: 'pending'
    })

    // Send notifications
    await notifyEscalation(complaint, escalation, targetUser)

    logger.info(`Escalated complaint ${complaint.complaintId}`, {
      reason,
      toLevel: nextLevel,
      targetUser: targetUser?._id
    })

    return { success: true, escalation }
  } catch (error) {
    logger.logError(error, 'escalationService.escalateComplaint')
    throw error
  }
}

// ===================================
// AUTO-ESCALATE OVERDUE CASES
// ===================================
const autoEscalateOverdue = async () => {
  const complaints = await Complaint.find({
    status: { $in: ['assigned', 'investigating', 'in-progress'] },
    deadline: { $lt: new Date() }
  })
    .populate('citizen', 'name')
    .populate('assignedTo', 'name')

  const results = []

  for (const complaint of complaints) {
    const check = checkEscalationNeeded(complaint)
    if (!check) continue

    try {
      const result = await escalateComplaint({
        complaint,
        escalatedBy: null,
        reason: check.reason,
        category: 'auto',
        urgency: 'high'
      })
      results.push({ complaintId: complaint.complaintId, ...result })
    } catch (error) {
      logger.logError(error, `autoEscalate: ${complaint.complaintId}`)
    }
  }

  return results
}

// ===================================
// NOTIFY ON ESCALATION
// ===================================
const notifyEscalation = async (complaint, escalation, targetUser) => {
  try {
    // Notify target (authority)
    if (targetUser) {
      await Notification.create({
        user: targetUser._id,
        type: 'warning',
        category: 'alert',
        title: '🚨 Case Escalated',
        message: `Case ${complaint.complaintId} has been escalated. Reason: ${escalation.reason}`,
        link: `/authority/escalated`,
        relatedId: complaint._id,
        relatedModel: 'Complaint',
        emailQueued: true
      })
    }

    // Notify citizen
    if (complaint.citizen) {
      await Notification.create({
        user: complaint.citizen._id,
        type: 'warning',
        category: 'status',
        title: 'Complaint Escalated',
        message: `Your complaint ${complaint.complaintId} has been escalated to a higher authority for faster resolution.`,
        link: `/citizen/complaints/${complaint._id}`,
        relatedId: complaint._id,
        relatedModel: 'Complaint'
      })
    }

    // Notify officer (if assigned)
    if (complaint.assignedTo) {
      await Notification.create({
        user: complaint.assignedTo._id,
        type: 'danger',
        category: 'alert',
        title: '⚠️ Case Escalated',
        message: `Your case ${complaint.complaintId} was escalated. Reason: ${escalation.reason}`,
        link: `/officer/case/${complaint._id}`,
        relatedId: complaint._id,
        relatedModel: 'Complaint'
      })
    }
  } catch (error) {
    logger.logError(error, 'escalationService.notifyEscalation')
  }
}

// ===================================
// ACKNOWLEDGE ESCALATION
// ===================================
const acknowledgeEscalation = async (escalationId, userId, note = '') => {
  try {
    const escalation = await Escalation.findByIdAndUpdate(
      escalationId,
      {
        status: 'acknowledged',
        acknowledgedAt: new Date(),
        acknowledgedBy: userId,
        resolutionNote: note
      },
      { new: true }
    )

    return escalation
  } catch (error) {
    logger.logError(error, 'escalationService.acknowledge')
    throw error
  }
}

// ===================================
// RESOLVE ESCALATION
// ===================================
const resolveEscalation = async (escalationId, userId, note) => {
  try {
    const escalation = await Escalation.findByIdAndUpdate(
      escalationId,
      {
        status: 'resolved',
        resolvedAt: new Date(),
        resolutionNote: note
      },
      { new: true }
    )

    if (escalation) {
      // Update complaint status
      await Complaint.findByIdAndUpdate(escalation.complaint, {
        status: 'in-progress',
        $push: {
          statusHistory: {
            status: 'in-progress',
            note: `Escalation resolved: ${note}`,
            updatedBy: userId,
            updatedAt: new Date()
          }
        }
      })
    }

    return escalation
  } catch (error) {
    logger.logError(error, 'escalationService.resolve')
    throw error
  }
}

// ===================================
// GET PENDING ESCALATIONS FOR USER
// ===================================
const getPendingEscalationsForUser = async (userId) => {
  return Escalation.find({
    escalatedTo: userId,
    status: 'pending'
  })
    .populate('complaint', 'complaintId title priority')
    .populate('escalatedBy', 'name role')
    .sort({ createdAt: -1 })
}

module.exports = {
  checkEscalationNeeded,
  escalateComplaint,
  autoEscalateOverdue,
  notifyEscalation,
  acknowledgeEscalation,
  resolveEscalation,
  getPendingEscalationsForUser,
  LEVELS
}