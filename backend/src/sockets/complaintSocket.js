/* ===================================
   JANVOICE — COMPLAINT SOCKET HANDLERS
   Real-time complaint events
   =================================== */

const Complaint = require('../models/Complaint')
const {
  SOCKET_ROOMS,
  SOCKET_EVENTS,
  emitToUser,
  emitToOfficers,
  emitToAdmins,
  emitToRoom
} = require('../config/socket')
const logger = require('../utils/logger')

// ===================================
// REGISTER COMPLAINT HANDLERS
// ===================================
const registerComplaintHandlers = (io, socket) => {
  const user = socket.user

  // ===================================
  // JOIN COMPLAINT ROOM
  // User wants live updates for a specific complaint
  // ===================================
  socket.on('complaint:join', async ({ complaintId }) => {
    try {
      if (!complaintId) return

      const complaint = await Complaint.findById(complaintId)
      if (!complaint) return

      // Authorization check
      const isOwner = complaint.citizen.toString() === user.id
      const isOfficer =
        complaint.assignedTo &&
        complaint.assignedTo.toString() === user.id
      const isAdmin = ['system_admin', 'department_admin', 'higher_authority'].includes(
        user.role
      )

      if (!isOwner && !isOfficer && !isAdmin) {
        socket.emit('error', { message: 'Not authorized to view this complaint' })
        return
      }

      const room = SOCKET_ROOMS.COMPLAINT(complaintId)
      socket.join(room)

      logger.info(`👥 ${user.name} joined complaint room: ${complaintId}`)
      socket.emit('complaint:joined', { complaintId })
    } catch (error) {
      logger.logError(error, 'complaintSocket.join')
    }
  })

  // ===================================
  // LEAVE COMPLAINT ROOM
  // ===================================
  socket.on('complaint:leave', ({ complaintId }) => {
    const room = SOCKET_ROOMS.COMPLAINT(complaintId)
    socket.leave(room)
    logger.info(`👋 ${user.name} left complaint room: ${complaintId}`)
  })

  // ===================================
  // LIVE COMMENT/TYPING
  // ===================================
  socket.on('complaint:typing', ({ complaintId }) => {
    const room = SOCKET_ROOMS.COMPLAINT(complaintId)
    socket.to(room).emit('complaint:user-typing', {
      userId: user.id,
      userName: user.name,
      timestamp: new Date()
    })
  })

  socket.on('complaint:typing-stop', ({ complaintId }) => {
    const room = SOCKET_ROOMS.COMPLAINT(complaintId)
    socket.to(room).emit('complaint:user-stopped-typing', {
      userId: user.id
    })
  })

  // ===================================
  // REQUEST LIVE UPDATE
  // ===================================
  socket.on('complaint:request-update', async ({ complaintId }) => {
    try {
      const complaint = await Complaint.findById(complaintId)
        .populate('citizen', 'name')
        .populate('assignedTo', 'name role')
        .lean()

      if (!complaint) return

      // Authorization
      const isOwner = complaint.citizen._id.toString() === user.id
      const isOfficer =
        complaint.assignedTo && complaint.assignedTo._id.toString() === user.id
      const isAdmin = ['system_admin', 'department_admin', 'higher_authority'].includes(
        user.role
      )

      if (!isOwner && !isOfficer && !isAdmin) return

      socket.emit('complaint:update', { complaint })
    } catch (error) {
      logger.logError(error, 'complaintSocket.requestUpdate')
    }
  })
}

// ===================================
// EMIT HELPERS (called from controllers)
// ===================================

const emitComplaintCreated = (complaint) => {
  try {
    // Notify admins
    emitToAdmins(SOCKET_EVENTS.COMPLAINT_NEW, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      title: complaint.title,
      priority: complaint.priority,
      category: complaint.category,
      location: complaint.location,
      citizenName: complaint.citizen?.name,
      createdAt: complaint.createdAt
    })

    // Notify all officers (they may be interested)
    emitToOfficers(SOCKET_EVENTS.COMPLAINT_NEW, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      title: complaint.title,
      priority: complaint.priority,
      location: complaint.location
    })

    logger.info(`📢 Broadcast: complaint created ${complaint.complaintId}`)
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitCreated')
  }
}

const emitComplaintUpdated = (complaint) => {
  try {
    const room = SOCKET_ROOMS.COMPLAINT(complaint._id.toString())

    // Notify everyone in the complaint's room
    emitToRoom(room, SOCKET_EVENTS.COMPLAINT_UPDATED, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      status: complaint.status,
      priority: complaint.priority,
      updatedAt: complaint.updatedAt
    })

    // Notify citizen
    if (complaint.citizen?._id) {
      emitToUser(complaint.citizen._id, SOCKET_EVENTS.COMPLAINT_UPDATED, {
        complaintId: complaint._id,
        referenceId: complaint.complaintId,
        title: complaint.title,
        status: complaint.status,
        updatedAt: complaint.updatedAt
      })
    }

    logger.info(`📢 Broadcast: complaint updated ${complaint.complaintId}`)
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitUpdated')
  }
}

const emitComplaintAssigned = (complaint, officer) => {
  try {
    // Notify officer
    emitToUser(officer._id, SOCKET_EVENTS.COMPLAINT_ASSIGNED, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      title: complaint.title,
      priority: complaint.priority,
      location: complaint.location,
      message: `You have been assigned a new case`
    })

    // Notify citizen
    if (complaint.citizen?._id) {
      emitToUser(complaint.citizen._id, SOCKET_EVENTS.COMPLAINT_ASSIGNED, {
        complaintId: complaint._id,
        referenceId: complaint.complaintId,
        message: `An officer has been assigned to your complaint`,
        officerName: officer.name
      })
    }

    logger.info(`📢 Broadcast: complaint assigned ${complaint.complaintId}`)
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitAssigned')
  }
}

const emitComplaintStatusChanged = (complaint, oldStatus, newStatus) => {
  try {
    // Notify citizen
    if (complaint.citizen?._id) {
      emitToUser(complaint.citizen._id, SOCKET_EVENTS.COMPLAINT_STATUS_CHANGED, {
        complaintId: complaint._id,
        referenceId: complaint.complaintId,
        title: complaint.title,
        oldStatus,
        newStatus,
        changedAt: new Date()
      })
    }

    // Notify room
    const room = SOCKET_ROOMS.COMPLAINT(complaint._id.toString())
    emitToRoom(room, SOCKET_EVENTS.COMPLAINT_STATUS_CHANGED, {
      complaintId: complaint._id,
      newStatus
    })

    logger.info(
      `📢 Broadcast: status changed ${complaint.complaintId}: ${oldStatus} → ${newStatus}`
    )
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitStatusChanged')
  }
}

const emitComplaintResolved = (complaint) => {
  try {
    if (complaint.citizen?._id) {
      emitToUser(complaint.citizen._id, SOCKET_EVENTS.COMPLAINT_RESOLVED, {
        complaintId: complaint._id,
        referenceId: complaint.complaintId,
        title: complaint.title,
        resolvedAt: complaint.resolvedAt,
        message: 'Your complaint has been resolved!'
      })
    }

    emitToAdmins(SOCKET_EVENTS.COMPLAINT_RESOLVED, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      resolvedBy: complaint.assignedTo?.name,
      resolvedAt: complaint.resolvedAt
    })

    logger.info(`📢 Broadcast: complaint resolved ${complaint.complaintId}`)
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitResolved')
  }
}

const emitComplaintEscalated = (complaint, reason) => {
  try {
    // Notify admins
    emitToAdmins(SOCKET_EVENTS.COMPLAINT_ESCALATED, {
      complaintId: complaint._id,
      referenceId: complaint.complaintId,
      title: complaint.title,
      priority: complaint.priority,
      reason,
      escalatedAt: complaint.escalatedAt
    })

    // Notify citizen
    if (complaint.citizen?._id) {
      emitToUser(complaint.citizen._id, SOCKET_EVENTS.COMPLAINT_ESCALATED, {
        complaintId: complaint._id,
        referenceId: complaint.complaintId,
        message: 'Your complaint has been escalated to a higher authority'
      })
    }

    logger.info(`📢 Broadcast: complaint escalated ${complaint.complaintId}`)
  } catch (error) {
    logger.logError(error, 'complaintSocket.emitEscalated')
  }
}

module.exports = {
  registerComplaintHandlers,
  emitComplaintCreated,
  emitComplaintUpdated,
  emitComplaintAssigned,
  emitComplaintStatusChanged,
  emitComplaintResolved,
  emitComplaintEscalated
}