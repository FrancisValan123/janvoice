import { useState, useCallback } from 'react'
import notificationService from '../services/notificationService'

/**
 * useNotification - Manages notifications state and API calls
 *
 * @returns {Object} {
 *   notifications,      // List of notifications
 *   unreadCount,        // Number of unread notifications
 *   loading,            // Loading state
 *   error,              // Error message
 *   fetchNotifications, // Fetch all notifications
 *   markAsRead,         // Mark one as read
 *   markAllAsRead,      // Mark all as read
 *   deleteNotification, // Delete one
 *   clearAll            // Delete all
 * }
 */
const useNotification = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // Fetch notifications
  // ============================================
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificationService.getNotifications()
      setNotifications(response.data.notifications || [])
      return response.data
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to fetch notifications'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // Mark single notification as read
  // ============================================
  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )

    try {
      await notificationService.markAsRead(id)
    } catch (err) {
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n))
      )
      console.error('Failed to mark as read:', err)
    }
  }, [])

  // ============================================
  // Mark all as read
  // ============================================
  const markAllAsRead = useCallback(async () => {
    const previous = [...notifications]

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    try {
      await notificationService.markAllAsRead()
    } catch (err) {
      setNotifications(previous)
      console.error('Failed to mark all as read:', err)
    }
  }, [notifications])

  // ============================================
  // Delete notification
  // ============================================
  const deleteNotification = useCallback(async (id) => {
    const previous = [...notifications]

    setNotifications((prev) => prev.filter((n) => n._id !== id))

    try {
      await notificationService.deleteNotification(id)
    } catch (err) {
      setNotifications(previous)
      console.error('Failed to delete notification:', err)
    }
  }, [notifications])

  // ============================================
  // Clear all
  // ============================================
  const clearAll = useCallback(async () => {
    const previous = [...notifications]

    setNotifications([])

    try {
      await notificationService.clearAll()
    } catch (err) {
      setNotifications(previous)
      console.error('Failed to clear notifications:', err)
    }
  }, [notifications])

  // Compute unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }
}

export default useNotification