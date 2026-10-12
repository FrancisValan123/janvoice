/* ===================================
   JANVOICE — SOCKET.IO CONFIGURATION
   =================================== */

const { Server } = require('socket.io')
const { verifyToken } = require('./jwt')

let io = null

const SOCKET_ROOMS = {
  CITIZENS: 'room:citizens',
  OFFICERS: 'room:officers',
  ADMINS: 'room:admins',
  DEPARTMENT: (id) => `room:department:${id}`,
  USER: (id) => `room:user:${id}`,
  COMPLAINT: (id) => `room:complaint:${id}`
}

const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',
  NOTIFICATION_NEW: 'notification:new',
  COMPLAINT_NEW: 'complaint:new',
  COMPLAINT_UPDATED: 'complaint:updated',
  COMPLAINT_ASSIGNED: 'complaint:assigned',
  COMPLAINT_STATUS_CHANGED: 'complaint:status-changed',
  COMPLAINT_RESOLVED: 'complaint:resolved',
  COMPLAINT_ESCALATED: 'complaint:escalated',
  USER_TYPING: 'user:typing',
  TYPING_STOP: 'typing:stop',
  SYSTEM_ALERT: 'system:alert'
}

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000
  })

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1]

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = verifyToken(token)

      socket.user = {
        id: decoded.id,
        name: decoded.name || 'User',
        email: decoded.email,
        role: decoded.role
      }

      next()
    } catch (error) {
      next(new Error('Invalid or expired token'))
    }
  })

  // Connection
  io.on('connection', (socket) => {
    const { id, role, name } = socket.user
    console.log(`🔌 User connected: ${name} (${role}) — ${socket.id}`)

    if (role === 'citizen') socket.join(SOCKET_ROOMS.CITIZENS)
    if (role === 'officer') socket.join(SOCKET_ROOMS.OFFICERS)
    if (role === 'department_admin' || role === 'higher_authority') {
      socket.join(SOCKET_ROOMS.ADMINS)
    }
    socket.join(SOCKET_ROOMS.USER(id))

    socket.on('join:room', ({ room }) => socket.join(room))
    socket.on('leave:room', ({ room }) => socket.leave(room))

    socket.on('disconnect', (reason) => {
      console.log(`🔌 User disconnected: ${name} — ${reason}`)
    })
  })

  return io
}

const getIO = () => io

const emitToUser = (userId, event, data) => {
  if (io) io.to(SOCKET_ROOMS.USER(userId)).emit(event, data)
}

const emitToRoom = (room, event, data) => {
  if (io) io.to(room).emit(event, data)
}

const emitToOfficers = (event, data) => {
  if (io) io.to(SOCKET_ROOMS.OFFICERS).emit(event, data)
}

const emitToAdmins = (event, data) => {
  if (io) io.to(SOCKET_ROOMS.ADMINS).emit(event, data)
}

const emitToCitizens = (event, data) => {
  if (io) io.to(SOCKET_ROOMS.CITIZENS).emit(event, data)
}

module.exports = {
  initSocket,
  getIO,
  SOCKET_ROOMS,
  SOCKET_EVENTS,
  emitToUser,
  emitToRoom,
  emitToOfficers,
  emitToAdmins,
  emitToCitizens
}