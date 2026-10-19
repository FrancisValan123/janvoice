import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './Notifications.css'

const Notifications = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // ===================================
  // FETCH REAL NOTIFICATIONS
  // (Fallback to empty array if endpoint doesn't exist yet)
  // ===================================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const res = await api.get('/notifications')
        const raw = res.data?.notifications || res.data?.data || []
        setNotifications(raw)
      } catch (err) {
        // Endpoint may not exist yet — silently fall back to empty
        if (err.response?.status !== 404) {
          console.warn('Notifications fetch error:', err.message)
        }
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => n.unread).length

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return n.unread
    if (activeTab === 'resolved') return n.type === 'resolved'
    if (activeTab === 'urgent') return n.priority === 'emergency'
    return n.type === activeTab
  })

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTabCount = (tab) => {
    if (tab === 'all') return notifications.length
    if (tab === 'unread') return unreadCount
    if (tab === 'resolved') return notifications.filter((n) => n.type === 'resolved').length
    if (tab === 'urgent') return notifications.filter((n) => n.priority === 'emergency').length
    return 0
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Notifications">
      <div className="nf-container">
        {/* Header */}
        <div className="nf-header">
          <div className="nf-header-left">
            <div className="nf-header-icon">🔔</div>
            <div>
              <h1 className="nf-header-title">
                Notifications
                {unreadCount > 0 && (
                  <span className="nf-badge">{unreadCount} new</span>
                )}
              </h1>
              <p className="nf-header-sub">
                Stay updated on your complaints and system activity
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button className="nf-mark-all-btn" onClick={handleMarkAllRead}>
              ✓ Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="nf-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'urgent', label: 'Urgent' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nf-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="nf-tab-count">{getTabCount(tab.id)}</span>
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="nf-list">
          {loading ? (
            <div className="nf-empty">
              <div className="nf-empty-icon">⏳</div>
              <h3 className="nf-empty-title">Loading notifications...</h3>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="nf-empty">
              <div className="nf-empty-icon">📭</div>
              <h3 className="nf-empty-title">
                {activeTab === 'all'
                  ? "You're all caught up!"
                  : 'No notifications here'}
              </h3>
              <p className="nf-empty-sub">
                {activeTab === 'all'
                  ? 'Notifications will appear here when your complaints get updated.'
                  : 'Try switching to a different tab or check back later.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`nf-item ${notif.unread ? 'unread' : ''}`}
                onClick={() => handleMarkRead(notif.id)}
              >
                <div
                  className="nf-item-icon"
                  style={{ background: notif.iconBg, color: notif.iconColor }}
                >
                  {notif.icon}
                </div>

                <div className="nf-item-content">
                  <div className="nf-item-header">
                    <h3 className="nf-item-title">{notif.title}</h3>
                    {notif.unread && <span className="nf-dot"></span>}
                  </div>
                  <p className="nf-item-message">{notif.message}</p>
                  <div className="nf-item-meta">
                    <span className="nf-item-tag">📋 {notif.complaintId}</span>
                    <span className="nf-item-time">⏰ {notif.time}</span>
                  </div>
                </div>

                <button
                  className="nf-item-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(notif.id)
                  }}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Notifications