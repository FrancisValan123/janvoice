/* ===================================
   JANVOICE — NOTIFICATION SOCKET HANDLERS
   Real-time notifications
   =================================== */

const Notification = require('../models/Notification')
const {
  SOCKET_ROOMS,
  SOCKET_EVENTS,
  emitToUser
} = require('../config/socket')
const logger = require('../utils/logger')

// ===================================
// REGISTER NOTIFICATION HANDLERS
// ===================================
const registerNotificationHandlers = (io, socket) => {
  const user = socket.user

  // ===================================
  // MARK AS READ
  // ===================================
  socket.on('notification:read', async ({ notificationId }) => {
    try {
      if (!notificationId) return

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: user.id },
        { read: true, readAt: new Date() },
        { new: true }
      )

      if (notification) {
        socket.emit('notification:read-ack', { notificationId })
      }
    } catch (error) {
      logger.logError(error, 'notificationSocket.read')
    }
  })

  // ===================================
  // MARK ALL AS READ
  // ===================================
  socket.on('notification:read-all', async () => {
    try {
      const result = await Notification.updateMany(
        { user: user.id, read: false },
        { $set: { read: true, readAt: new Date() } }
      )

      socket.emit('notification:read-all-ack', {
        count: result.modifiedCount
      })
    } catch (error) {
      logger.logError(error, 'notificationSocket.readAll')
    }
  })

  // ===================================
  // REQUEST UNREAD COUNT
  // ===================================
  socket.on('notification:get-count', async () => {
    try {
      const count = await Notification.countDocuments({
        user: user.id,
        read: false
      })

      socket.emit('notification:count', { count })
    } catch (error) {
      logger.logError(error, 'notificationSocket.getCount')
    }
  })

  // ===================================
  // SUBSCRIBE TO ALL NOTIFICATIONS
  // ===================================
  socket.on('notification:subscribe', () => {
    socket.join(SOCKET_ROOMS.USER(user.id))
    logger.info(`🔔 ${user.name} subscribed to notifications`)
  })

  // ===================================
  // UNSUBSCRIBE
  // ===================================
  socket.on('notification:unsubscribe', () => {
    socket.leave(SOCKET_ROOMS.USER(user.id))
  })
}

// ===================================
// EMIT HELPERS
// ===================================

// Send notification to single user
const emitNotification = (userId, notification) => {
  try {
    emitToUser(userId, SOCKET_EVENTS.NOTIFICATION_NEW, {
      id: notification._id,
      type: notification.type,
      category: notification.category,
      title: notification.title,
      message: notification.message,
      link: notification.link,
      createdAt: notification.createdAt
    })

    logger.info(`🔔 Notification sent to user ${userId}`)
  } catch (error) {
    logger.logError(error, 'notificationSocket.emit')
  }
}

// Send to multiple users
const emitBulkNotifications = (userIds = [], notification) => {
  userIds.forEach((userId) => emitNotification(userId, notification))
}

// Send complaint update notification
const emitComplaintNotification = (userId, complaint, action) => {
  const messages = {
    created: `Complaint ${complaint.complaintId} registered`,
    assigned: `Officer assigned to complaint ${complaint.complaintId}`,
    'in-progress': `Complaint ${complaint.complaintId} is being worked on`,
    resolved: `✅ Complaint ${complaint.complaintId} resolved!`,
    escalated: `Complaint ${complaint.complaintId} escalated`
  }

  emitNotification(userId, {
    _id: `temp-${Date.now()}`,
    type: action === 'resolved' ? 'success' : 'info',
    category: 'complaint',
    title: 'Complaint Update',
    message: messages[action] || `Complaint ${complaint.complaintId} updated`,
    link: `/citizen/complaints/${complaint._id}`,
    createdAt: new Date()
  })
}

// Broadcast to all users with a role
const broadcastNotification = (role, notification) => {
  const io = require('../config/socket').getIO()
  if (!io) return

  const room =
    role === 'citizen'
      ? SOCKET_ROOMS.CITIZENS
      : role === 'officer'
      ? SOCKET_ROOMS.OFFICERS
      : SOCKET_ROOMS.ADMINS

  io.to(room).emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification)

  logger.info(`📢 Broadcast notification to ${role}s`)
}

// System-wide alert
const emitSystemAlert = ({ title, message, severity = 'info' }) => {
  const io = require('../config/socket').getIO()
  if (!io) return

  io.emit(SOCKET_EVENTS.SYSTEM_ALERT, {
    title,
    message,
    severity,
    timestamp: new Date()
  })

  logger.info(`🚨 System alert broadcast: ${title}`)
}

module.exports = {
  registerNotificationHandlers,
  emitNotification,
  emitBulkNotifications,
  emitComplaintNotification,
  broadcastNotification,
  emitSystemAlert
}