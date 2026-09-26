import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { useComplaints } from '../../context/ComplaintContext'
import './Notifications.css'

const Notifications = () => {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    updateNotification,
    updateAllNotifications,
    deleteNotification,
    clearAllNotifications
  } = useComplaints()

  const [filter, setFilter] = useState('all') // all | unread | read
  const [searchQuery, setSearchQuery] = useState('')

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    {
      icon: '🔔',
      label: 'Notifications',
      path: '/citizen/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const filtered = useMemo(() => {
    let list = [...notifications]

    if (filter === 'unread') list = list.filter((n) => !n.read)
    else if (filter === 'read') list = list.filter((n) => n.read)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          (n.complaintId && n.complaintId.toLowerCase().includes(q))
      )
    }

    return list
  }, [notifications, filter, searchQuery])

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

  const handleClick = (notif) => {
    if (!notif.read) updateNotification(notif.id)
    if (notif.complaintId) {
      navigate(`/citizen/complaint/${notif.complaintId}`)
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Delete all notifications? This cannot be undone.')) {
      clearAllNotifications()
    }
  }

  return (
    <DashboardLayout
      role="citizen"
      menuItems={menuItems}
      title="Notifications"
    >
      <div className="notif-page">
        {/* Header */}
        <div className="notif-header">
          <div>
            <h1>🔔 Notifications</h1>
            <p>
              You have <strong>{unreadCount}</strong> unread notification
              {unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="notif-header-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-all" onClick={updateAllNotifications}>
                ✓ Mark All as Read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn-clear-all" onClick={handleClearAll}>
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="notif-search-bar">
          <span className="notif-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="notif-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="notif-tabs">
          <button
            className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`notif-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔕</div>
            <h3>No notifications</h3>
            <p>
              {filter === 'unread'
                ? "You're all caught up!"
                : 'No notifications to show.'}
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => handleClick(notif)}
              >
                <div className={`notif-icon notif-${notif.type || 'info'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-title">{notif.title}</div>
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-meta">
                    <span className="notif-time">
                      {getTimeAgo(notif.createdAt)}
                    </span>
                    {notif.complaintId && (
                      <span className="notif-id">#{notif.complaintId}</span>
                    )}
                  </div>
                </div>
                {!notif.read && <div className="unread-dot"></div>}
                <button
                  className="notif-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notif.id)
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Notifications