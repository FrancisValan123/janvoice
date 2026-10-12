import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './NotificationBell.css'

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'success',
    title: 'Complaint Resolved',
    message: 'Your complaint JV2026002 has been resolved.',
    time: '2 min ago',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Officer Assigned',
    message: 'Officer Ravi Kumar has been assigned to JV2026004.',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: 'Action Required',
    message: 'Please provide feedback for your resolved complaint.',
    time: '3 hours ago',
    read: false
  }
]

const NotificationBell = ({
  notifications = DEFAULT_NOTIFICATIONS,
  viewAllPath = '/citizen/notifications'
}) => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const ref = useRef(null)

  // Keep items in sync when prop changes
  useEffect(() => {
    setItems(Array.isArray(notifications) ? notifications : [])
  }, [notifications])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  // Safely compute unread count
  const unreadCount = items.filter((n) => n && !n.read).length

  const markAllRead = () => {
    setItems((prev) =>
      prev.map((n) => (n ? { ...n, read: true } : n))
    )
  }

  const markAsRead = (id) => {
    setItems((prev) =>
      prev.map((n) => (n && n.id === id ? { ...n, read: true } : n))
    )
  }

  // Safe color getter
  const getTypeColor = (type) => {
    const colors = {
      info: '#4299E1',
      success: '#38A169',
      warning: '#ED8936',
      danger: '#E53E3E',
      emergency: '#C53030'
    }
    return colors[type] || colors.info
  }

  // Safe icon getter
  const getTypeIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      danger: '❌',
      emergency: '🚨'
    }
    return icons[type] || '🔔'
  }

  return (
    <div className="notification-bell" ref={ref}>
      {/* Bell Button */}
      <button
        type="button"
        className="bell-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="bell-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="notification-dropdown" role="menu">
          {/* Header */}
          <div className="dropdown-header">
            <div className="dropdown-title">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="unread-pill">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-mark-all"
                onClick={markAllRead}
              >
                ✓ Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="dropdown-body">
            {items.length === 0 ? (
              <div className="empty-notifications">
                <div className="empty-icon">🔕</div>
                <div className="empty-text">No notifications yet</div>
              </div>
            ) : (
              items.slice(0, 5).map((n) => {
                if (!n || !n.id) return null
                return (
                  <div
                    key={n.id}
                    className={`notification-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(n.id)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <div
                      className="notification-icon"
                      style={{
                        background: `${getTypeColor(n.type)}20`,
                        color: getTypeColor(n.type)
                      }}
                    >
                      {getTypeIcon(n.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{n.title}</div>
                      <div className="notification-message">{n.message}</div>
                      <div className="notification-time">{n.time}</div>
                    </div>
                    {!n.read && <span className="unread-dot"></span>}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <Link
            to={viewAllPath}
            className="dropdown-footer"
            onClick={() => setOpen(false)}
          >
            View All Notifications →
          </Link>
        </div>
      )}
    </div>
  )
}

export default NotificationBell