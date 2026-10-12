/* ===================================
   JANVOICE — LIVE TRACKING SOCKET HANDLERS
   Real-time status tracking & presence
   =================================== */

const Complaint = require('../models/Complaint')
const User = require('../models/User')
const {
  SOCKET_ROOMS,
  SOCKET_EVENTS,
  emitToUser,
  emitToAdmins
} = require('../config/socket')
const logger = require('../utils/logger')

// ===================================
// ACTIVE VIEWERS TRACKER
// ===================================
const activeViewers = new Map() // complaintId → Map(userId → userData)

// ===================================
// REGISTER LIVE TRACKING HANDLERS
// ===================================
const registerLiveTrackingHandlers = (io, socket) => {
  const user = socket.user

  // ===================================
  // START WATCHING A COMPLAINT
  // ===================================
  socket.on('track:start', async ({ complaintId }) => {
    try {
      if (!complaintId) return

      const complaint = await Complaint.findById(complaintId)
        .select('citizen assignedTo complaintId')
        .lean()

      if (!complaint) {
        socket.emit('track:error', { message: 'Complaint not found' })
        return
      }

      // Track viewer
      if (!activeViewers.has(complaintId)) {
        activeViewers.set(complaintId, new Map())
      }

      activeViewers.get(complaintId).set(user.id, {
        id: user.id,
        name: user.name,
        role: user.role,
        socketId: socket.id,
        joinedAt: new Date()
      })

      socket.join(`tracking:${complaintId}`)
      socket.trackingComplaintId = complaintId

      // Notify others watching
      io.to(`tracking:${complaintId}`).emit('track:viewers', {
        complaintId,
        viewers: Array.from(activeViewers.get(complaintId).values()),
        count: activeViewers.get(complaintId).size
      })

      logger.info(`👁️  ${user.name} started tracking ${complaintId}`)
      socket.emit('track:started', { complaintId })
    } catch (error) {
      logger.logError(error, 'liveTracking.start')
    }
  })

  // ===================================
  // STOP WATCHING
  // ===================================
  socket.on('track:stop', () => {
    const complaintId = socket.trackingComplaintId
    if (!complaintId) return

    removeViewer(complaintId, user.id)

    // Notify remaining viewers
    const viewers = activeViewers.get(complaintId)
    io.to(`tracking:${complaintId}`).emit('track:viewers', {
      complaintId,
      viewers: viewers ? Array.from(viewers.values()) : [],
      count: viewers ? viewers.size : 0
    })

    socket.leave(`tracking:${complaintId}`)
    delete socket.trackingComplaintId
    logger.info(`👋 ${user.name} stopped tracking ${complaintId}`)
  })

  // ===================================
  // HEARTBEAT (keep connection alive)
  // ===================================
  socket.on('track:heartbeat', ({ complaintId }) => {
    const viewers = activeViewers.get(complaintId)
    if (viewers && viewers.has(user.id)) {
      const viewer = viewers.get(user.id)
      viewer.lastSeen = new Date()
      socket.emit('track:heartbeat-ack', { timestamp: Date.now() })
    }
  })

  // ===================================
  // PRESENCE UPDATE
  // ===================================
  socket.on('presence:update', ({ status }) => {
    // status: 'available' | 'busy' | 'away'
    socket.broadcast.emit('presence:changed', {
      userId: user.id,
      userName: user.name,
      status,
      timestamp: new Date()
    })
  })

  // ===================================
  // CLEANUP ON DISCONNECT
  // ===================================
  socket.on('disconnect', () => {
    const complaintId = socket.trackingComplaintId
    if (complaintId) {
      removeViewer(complaintId, user.id)

      const viewers = activeViewers.get(complaintId)
      io.to(`tracking:${complaintId}`).emit('track:viewers', {
        complaintId,
        viewers: viewers ? Array.from(viewers.values()) : [],
        count: viewers ? viewers.size : 0
      })
    }
  })
}

// ===================================
// REMOVE VIEWER
// ===================================
const removeViewer = (complaintId, userId) => {
  const viewers = activeViewers.get(complaintId)
  if (!viewers) return

  viewers.delete(userId)

  // Clean up empty maps
  if (viewers.size === 0) {
    activeViewers.delete(complaintId)
  }
}

// ===================================
// GET ACTIVE VIEWERS FOR COMPLAINT
// ===================================
const getActiveViewers = (complaintId) => {
  const viewers = activeViewers.get(complaintId)
  return viewers ? Array.from(viewers.values()) : []
}

// ===================================
// GET TOTAL ACTIVE USERS
// ===================================
const getActiveUserCount = () => {
  const userIds = new Set()
  activeViewers.forEach((viewers) => {
    viewers.forEach((_, userId) => userIds.add(userId))
  })
  return userIds.size
}

// ===================================
// EMIT LIVE STATUS UPDATE
// ===================================
const emitLiveStatusUpdate = (complaintId, update) => {
  try {
    const io = require('../config/socket').getIO()
    if (!io) return

    io.to(`tracking:${complaintId}`).emit('track:status-update', {
      complaintId,
      ...update,
      timestamp: new Date()
    })
  } catch (error) {
    logger.logError(error, 'liveTracking.emitStatusUpdate')
  }
}

// ===================================
// EMIT LIVE LOCATION UPDATE
// (for officers en route)
// ===================================
const emitLiveLocation = (complaintId, location) => {
  try {
    const io = require('../config/socket').getIO()
    if (!io) return

    io.to(`tracking:${complaintId}`).emit('track:location', {
      complaintId,
      lat: location.lat,
      lng: location.lng,
      timestamp: new Date()
    })
  } catch (error) {
    logger.logError(error, 'liveTracking.emitLocation')
  }
}

// ===================================
// EMIT ESTIMATED TIME OF ARRIVAL
// ===================================
const emitETA = (complaintId, etaMinutes) => {
  try {
    const io = require('../config/socket').getIO()
    if (!io) return

    io.to(`tracking:${complaintId}`).emit('track:eta', {
      complaintId,
      etaMinutes,
      etaTime: new Date(Date.now() + etaMinutes * 60000),
      timestamp: new Date()
    })
  } catch (error) {
    logger.logError(error, 'liveTracking.emitETA')
  }
}

// ===================================
// EMIT VIEWER COUNT UPDATE
// ===================================
const emitViewerCount = (complaintId) => {
  try {
    const io = require('../config/socket').getIO()
    if (!io) return

    const viewers = getActiveViewers(complaintId)

    io.to(`tracking:${complaintId}`).emit('track:viewers', {
      complaintId,
      viewers,
      count: viewers.length
    })
  } catch (error) {
    logger.logError(error, 'liveTracking.emitViewerCount')
  }
}

// ===================================
// CLEANUP STALE VIEWERS (called by cron)
// ===================================
const cleanupStaleViewers = (maxIdleMs = 5 * 60 * 1000) => {
  const now = Date.now()
  let cleaned = 0

  activeViewers.forEach((viewers, complaintId) => {
    viewers.forEach((viewer, userId) => {
      const lastSeen = viewer.lastSeen || viewer.joinedAt
      if (now - new Date(lastSeen).getTime() > maxIdleMs) {
        viewers.delete(userId)
        cleaned++
      }
    })

    if (viewers.size === 0) {
      activeViewers.delete(complaintId)
    }
  })

  if (cleaned > 0) {
    logger.info(`🧹 Cleaned up ${cleaned} stale viewers`)
  }

  return cleaned
}

// ===================================
// EXPORT
// ===================================
module.exports = {
  registerLiveTrackingHandlers,
  getActiveViewers,
  getActiveUserCount,
  emitLiveStatusUpdate,
  emitLiveLocation,
  emitETA,
  emitViewerCount,
  cleanupStaleViewers
}