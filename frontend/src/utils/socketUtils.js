/* ===================================
   JANVOICE — SOCKET UTILITIES
   =================================== */

/**
 * Socket event names (must match backend)
 */
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Rooms
  JOIN_ROOM: 'join:room',
  LEAVE_ROOM: 'leave:room',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
  NOTIFICATION_READ: 'notification:read',

  // Complaints
  COMPLAINT_NEW: 'complaint:new',
  COMPLAINT_UPDATED: 'complaint:updated',
  COMPLAINT_ASSIGNED: 'complaint:assigned',
  COMPLAINT_STATUS_CHANGED: 'complaint:status-changed',
  COMPLAINT_RESOLVED: 'complaint:resolved',
  COMPLAINT_ESCALATED: 'complaint:escalated',

  // Live updates
  USER_TYPING: 'user:typing',
  TYPING_STOP: 'typing:stop',

  // System
  SYSTEM_ALERT: 'system:alert',
  MAINTENANCE_MODE: 'system:maintenance'
}

/**
 * Room names for socket channels
 */
export const SOCKET_ROOMS = {
  CITIZENS: 'room:citizens',
  OFFICERS: 'room:officers',
  ADMINS: 'room:admins',
  DEPARTMENT: (id) => `room:department:${id}`,
  USER: (id) => `room:user:${id}`,
  COMPLAINT: (id) => `room:complaint:${id}`
}

/**
 * Get the socket server URL from environment
 */
export const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '')
  }
  return 'http://localhost:5000'
}

/**
 * Socket connection options
 */
export const getSocketOptions = (token) => ({
  auth: { token },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  autoConnect: true
})

/**
 * Format socket event for logging
 */
export const logSocketEvent = (event, data) => {
  const timestamp = new Date().toLocaleTimeString()
  console.log(`🔌 [${timestamp}] Socket Event: ${event}`, data || '')
}

/**
 * Detect if socket is ready
 */
export const isSocketReady = (socket) => {
  return socket && socket.connected
}

/**
 * Wait for socket to connect (with timeout)
 */
export const waitForConnection = (socket, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    if (socket.connected) return resolve(true)

    const timer = setTimeout(() => {
      reject(new Error('Socket connection timeout'))
    }, timeoutMs)

    socket.once('connect', () => {
      clearTimeout(timer)
      resolve(true)
    })

    socket.once('connect_error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
  })
}

/**
 * Emit with acknowledgment (with timeout)
 */
export const emitWithAck = (socket, event, data, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Ack timeout for "${event}"`))
    }, timeoutMs)

    socket.emit(event, data, (response) => {
      clearTimeout(timer)
      resolve(response)
    })
  })
}

/**
 * Subscribe to multiple events
 * Returns a cleanup function
 */
export const subscribeToEvents = (socket, handlers) => {
  if (!socket) return () => {}

  Object.entries(handlers).forEach(([event, handler]) => {
    socket.on(event, handler)
  })

  return () => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.off(event, handler)
    })
  }
}

/**
 * Standard event handlers for common notification types
 */
export const createNotificationHandler = (callback) => ({
  [SOCKET_EVENTS.NOTIFICATION_NEW]: (data) => {
    logSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, data)
    callback('notification', data)
  },
  [SOCKET_EVENTS.COMPLAINT_NEW]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_NEW, data)
    callback('complaint:new', data)
  },
  [SOCKET_EVENTS.COMPLAINT_UPDATED]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_UPDATED, data)
    callback('complaint:updated', data)
  },
  [SOCKET_EVENTS.COMPLAINT_STATUS_CHANGED]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_STATUS_CHANGED, data)
    callback('complaint:status', data)
  },
  [SOCKET_EVENTS.COMPLAINT_ASSIGNED]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_ASSIGNED, data)
    callback('complaint:assigned', data)
  },
  [SOCKET_EVENTS.COMPLAINT_RESOLVED]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_RESOLVED, data)
    callback('complaint:resolved', data)
  },
  [SOCKET_EVENTS.COMPLAINT_ESCALATED]: (data) => {
    logSocketEvent(SOCKET_EVENTS.COMPLAINT_ESCALATED, data)
    callback('complaint:escalated', data)
  },
  [SOCKET_EVENTS.SYSTEM_ALERT]: (data) => {
    logSocketEvent(SOCKET_EVENTS.SYSTEM_ALERT, data)
    callback('system', data)
  }
})