import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComplaints } from '../../context/ComplaintContext'
import './NotificationBell.css'

const NotificationBell = () => {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    updateNotification,
    updateAllNotifications
  } = useComplaints()

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      danger: '🚨',
      update: '🔄'
    }
    return icons[type] || '🔔'
  }

  const getTimeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString()
  }

  const handleItemClick = (n) => {
    if (!n.read) updateNotification(n.id)
    setOpen(false)
    navigate('/citizen/notifications')
  }

  const preview = notifications.slice(0, 5)

  return (
    <div className="notif-bell-wrapper" ref={dropdownRef}>
      <button
        className="icon-btn notif-bell-btn"
        title="Notifications"
        onClick={() => setOpen((o) => !o)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-count">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button
                className="notif-mark-all"
                onClick={() => updateAllNotifications()}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-dropdown-body">
            {preview.length === 0 ? (
              <div className="notif-empty">
                <div className="notif-empty-icon">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              preview.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.read ? 'read' : 'unread'}`}
                  onClick={() => handleItemClick(n)}
                >
                  <div className="notif-icon">{getIcon(n.type)}</div>
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-message">{n.message}</div>
                    <div className="notif-time">{getTimeAgo(n.createdAt)}</div>
                  </div>
                  {!n.read && <div className="notif-dot"></div>}
                </div>
              ))
            )}
          </div>

          <div className="notif-dropdown-footer">
            <button
              className="notif-view-all"
              onClick={() => {
                setOpen(false)
                navigate('/citizen/notifications')
              }}
            >
              View All Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell