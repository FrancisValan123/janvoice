/* ===================================
   JANVOICE — SOCKET INDEX
   Initializes all socket event handlers
   =================================== */

const { getIO, SOCKET_ROOMS, SOCKET_EVENTS } = require('../config/socket')
const { registerComplaintHandlers } = require('./complaintSocket')
const { registerNotificationHandlers } = require('./notificationSocket')
const { registerLiveTrackingHandlers } = require('./liveTracking')
const logger = require('../utils/logger')

// ===================================
// INITIALIZE ALL SOCKET HANDLERS
// ===================================
const initializeSocketHandlers = () => {
  const io = getIO()

  if (!io) {
    console.warn('⚠️  Socket.io not initialized — handlers skipped')
    return null
  }

  // ===================================
  // GLOBAL CONNECTION HANDLER
  // ===================================
  io.on('connection', (socket) => {
    const user = socket.user
    logger.info(`🔌 Socket connected: ${user?.name} (${user?.role})`, {
      socketId: socket.id,
      userId: user?.id
    })

    // Register all event handler groups
    registerComplaintHandlers(io, socket)
    registerNotificationHandlers(io, socket)
    registerLiveTrackingHandlers(io, socket)

    // ===================================
    // DISCONNECT
    // ===================================
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 Socket disconnected: ${user?.name}`, {
        socketId: socket.id,
        reason
      })
    })

    // ===================================
    // ERROR HANDLING
    // ===================================
    socket.on('error', (error) => {
      logger.logError(error, 'socket.error')
    })
  })

  console.log('✅ Socket event handlers registered')
  return io
}

// ===================================
// BROADCAST HELPERS (Global)
// ===================================
const broadcast = {
  // Send to all connected users
  toAll: (event, data) => {
    const io = getIO()
    if (io) io.emit(event, data)
  },

  // Send to specific room
  toRoom: (room, event, data) => {
    const io = getIO()
    if (io) io.to(room).emit(event, data)
  },

  // Send to specific user
  toUser: (userId, event, data) => {
    const io = getIO()
    if (io) io.to(SOCKET_ROOMS.USER(userId)).emit(event, data)
  },

  // Send to role-based room
  toCitizens: (event, data) => {
    const io = getIO()
    if (io) io.to(SOCKET_ROOMS.CITIZENS).emit(event, data)
  },

  toOfficers: (event, data) => {
    const io = getIO()
    if (io) io.to(SOCKET_ROOMS.OFFICERS).emit(event, data)
  },

  toAdmins: (event, data) => {
    const io = getIO()
    if (io) io.to(SOCKET_ROOMS.ADMINS).emit(event, data)
  }
}

// ===================================
// STATS
// ===================================
const getSocketStats = () => {
  const io = getIO()
  if (!io) return { connected: 0, rooms: 0 }

  const sockets = io.sockets.sockets
  return {
    connected: sockets.size,
    rooms: io.sockets.adapter.rooms.size,
    socketsByRoom: Array.from(io.sockets.adapter.rooms.entries()).reduce(
      (acc, [room, set]) => {
        acc[room] = set.size
        return acc
      },
      {}
    )
  }
}

module.exports = {
  initializeSocketHandlers,
  broadcast,
  getSocketStats
}