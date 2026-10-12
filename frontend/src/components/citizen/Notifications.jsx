import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import './Notifications.css'

const Notifications = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications', badge: 5 },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'status', icon: '🚧', title: 'Complaint In Progress', message: 'Your complaint JV2026001 is now being worked on', time: '5 min ago', read: false, complaintId: 'JV2026001', color: '#3182CE' },
    { id: 2, type: 'assigned', icon: '👤', title: 'Officer Assigned', message: 'Officer Ravi Kumar has been assigned to JV2026004', time: '1 hour ago', read: false, complaintId: 'JV2026004', color: '#805AD5' },
    { id: 3, type: 'resolved', icon: '✅', title: 'Complaint Resolved', message: 'Your complaint JV2026002 has been resolved. Please give feedback!', time: '3 hours ago', read: false, complaintId: 'JV2026002', color: '#38A169' },
    { id: 4, type: 'urgent', icon: '🚨', title: 'Emergency Acknowledged', message: 'Your emergency report JV2026003 has been acknowledged', time: '5 hours ago', read: false, complaintId: 'JV2026003', color: '#E53E3E' },
    { id: 5, type: 'feedback', icon: '⭐', title: 'Feedback Request', message: 'How was your experience with complaint JV2025101?', time: '1 day ago', read: true, complaintId: 'JV2025101', color: '#F7931E' },
    { id: 6, type: 'system', icon: '🔔', title: 'Welcome to JanVoice!', message: 'Your account is set up. Start by submitting your first complaint.', time: '3 days ago', read: true, complaintId: null, color: '#4A5568' },
    { id: 7, type: 'status', icon: '🔍', title: 'Investigation Started', message: 'Officer has started investigating JV2026004', time: '4 days ago', read: true, complaintId: 'JV2026004', color: '#805AD5' }
  ])

  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClick = (n) => {
    markAsRead(n.id)
    if (n.complaintId) {
      navigate(`/citizen/complaint/${n.complaintId}`)
    }
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Notifications">
      <div className="notifications-container">
        {/* Header */}
        <div className="notif-header">
          <div>
            <h2 className="notif-title">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="unread-pill">{unreadCount} new</span>
              )}
            </h2>
            <p className="notif-subtitle">
              Stay updated on your complaints and system activity
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={markAllRead}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="notif-filters">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'status', label: 'Status', count: notifications.filter((n) => n.type === 'status').length },
            { id: 'resolved', label: 'Resolved', count: notifications.filter((n) => n.type === 'resolved').length },
            { id: 'urgent', label: 'Urgent', count: notifications.filter((n) => n.type === 'urgent').length }
          ].map((f) => (
            <button
              key={f.id}
              className={`notif-filter ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.count > 0 && <span className="filter-count">{f.count}</span>}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
          <div className="notif-empty">
            <div className="empty-icon">🔕</div>
            <h3>No Notifications</h3>
            <p>
              {filter === 'all'
                ? "You don't have any notifications yet."
                : `No ${filter} notifications.`}
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''}`}
                onClick={() => handleClick(n)}
              >
                <div className="notif-icon" style={{ background: n.color + '20', color: n.color }}>
                  {n.icon}
                </div>
                <div className="notif-body">
                  <div className="notif-item-header">
                    <div className="notif-item-title">
                      {!n.read && <span className="unread-dot" style={{ background: n.color }}></span>}
                      {n.title}
                    </div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                  <div className="notif-message">{n.message}</div>
                  {n.complaintId && (
                    <div className="notif-complaint-id">
                      📋 {n.complaintId}
                    </div>
                  )}
                </div>
                <button
                  className="notif-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(n.id)
                  }}
                  title="Delete"
                >
                  ✖
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