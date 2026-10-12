import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import useAuth from './useAuth'

/**
 * useSocket - WebSocket (Socket.io) connection hook
 *
 * @param {string} namespace - Optional socket namespace (default: '/')
 * @returns {Object} {
 *   socket,          // Socket instance
 *   connected,       // Connection status
 *   connecting,      // Connecting status
 *   error,           // Connection error
 *   emit,            // Emit event to server
 *   on,              // Subscribe to event
 *   off,             // Unsubscribe from event
 *   disconnect,      // Manually disconnect
 *   reconnect        // Manually reconnect
 * }
 *
 * @example
 * const { emit, on, connected } = useSocket()
 *
 * useEffect(() => {
 *   const unsub = on('notification', (data) => {
 *     console.log('New notification:', data)
 *   })
 *   return unsub
 * }, [on])
 */
const useSocket = (namespace = '/') => {
  const { token, user } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  // Get socket URL from env
  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace('/api', '') ||
    'http://localhost:5000'

  // ============================================
  // Initialize socket connection
  // ============================================
  useEffect(() => {
    // Don't connect if not authenticated
    if (!token || !user) {
      // Cleanup existing
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setConnected(false)
      }
      return
    }

    setConnecting(true)
    setError(null)

    // Create socket instance
    const socket = io(`${SOCKET_URL}${namespace}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      autoConnect: true
    })

    socketRef.current = socket

    // ============================================
    // Connection events
    // ============================================
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id)
      setConnected(true)
      setConnecting(false)
      setError(null)

      // Join role-specific room
      socket.emit('join:room', { role: user.role, userId: user.id })
    })

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason)
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('🔌 Socket connection error:', err.message)
      setError(err.message)
      setConnected(false)
      setConnecting(false)
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Reconnected after ${attemptNumber} attempts`)
      setConnected(true)
      setError(null)
    })

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔌 Reconnect attempt ${attemptNumber}`)
    })

    socket.on('reconnect_failed', () => {
      console.error('🔌 Reconnection failed')
      setError('Failed to reconnect')
      setConnecting(false)
    })

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
      }
      socketRef.current = null
      setConnected(false)
    }
  }, [token, user, SOCKET_URL, namespace])

  // ============================================
  // Emit event to server
  // ============================================
  const emit = useCallback((event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn(`Cannot emit "${event}" — socket not connected`)
    }
  }, [])

  // ============================================
  // Subscribe to event
  // Returns unsubscribe function
  // ============================================
  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler)

      // Return cleanup function
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, handler)
        }
      }
    }
    return () => {}
  }, [])

  // ============================================
  // Unsubscribe from event
  // ============================================
  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler)
    }
  }, [])

  // ============================================
  // Manual disconnect
  // ============================================
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }, [])

  // ============================================
  // Manual reconnect
  // ============================================
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect()
    }
  }, [])

  return {
    socket: socketRef.current,
    connected,
    connecting,
    error,
    emit,
    on,
    off,
    disconnect,
    reconnect
  }
}

export default useSocket