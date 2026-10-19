import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import StatCard from '../common/StatCard'
import './CitizenDashboard.css'

// Helper function to map category names to emojis
const getCategoryIcon = (categoryName) => {
  const map = {
    'Roads & Infrastructure': '🛣️',
    'Sanitation & Waste': '🗑️',
    'Water Supply': '💧',
    'Public Safety': '🚨',
    'Environment': '🌳',
    'Electricity': '⚡',
    'General': '📋'
  }
  return map[categoryName] || '📋'
}

const CitizenDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    resolved: 0,
    emergency: 0,
    avgResolution: 0
  })
  const [recentComplaints, setRecentComplaints] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [complaintCount, setComplaintCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints', badge: complaintCount },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🚨', label: 'Emergency', path: '/citizen/emergency' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications', badge: notificationCount },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  // Fetch real dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch user's complaints
        const response = await api.get('/complaints/my')

        const rawData =
          response.data?.data ||
          response.data?.complaints ||
          (Array.isArray(response.data) ? response.data : [])

        // Calculate stats from real data
        const calculatedStats = {
          total: rawData.length,
          pending: rawData.filter((c) => c.status === 'pending').length,
          active: rawData.filter((c) =>
            ['assigned', 'investigating', 'in-progress'].includes(c.status)
          ).length,
          resolved: rawData.filter((c) => c.status === 'resolved').length,
          emergency: rawData.filter((c) => c.priority === 'emergency').length,
          avgResolution: 0
        }
        setStats(calculatedStats)
        setComplaintCount(calculatedStats.total)

        // Format the top 3 most recent complaints
        const sortedComplaints = [...rawData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        const formattedRecent = sortedComplaints.slice(0, 3).map((c) => ({
          _id: c._id, // ✅ Mongo _id for navigation
          id: c.complaintId || c._id || 'N/A',
          title:
            c.title ||
            (c.description ? c.description.substring(0, 50) + '...' : 'Untitled'),
          category: c.category?.name || c.category || 'General',
          categoryIcon: getCategoryIcon(c.category?.name || c.category),
          status: c.status || 'pending',
          priority: c.priority || 'normal',
          date: c.createdAt
            ? new Date(c.createdAt).toISOString().split('T')[0]
            : 'N/A',
          updated:
            c.updatedAt || c.createdAt
              ? new Date(c.updatedAt || c.createdAt).toISOString().split('T')[0]
              : 'N/A',
          assignedTo: c.assignedTo?.name || c.assignedTo || 'Not assigned yet'
        }))
        setRecentComplaints(formattedRecent)

        // Build activity from recent complaints
        const activityItems = formattedRecent.map((c) => ({
          icon: c.status === 'resolved' ? '✅' : '🚧',
          text: `Complaint ${c.id} is ${c.status.replace('-', ' ')}`,
          time: c.updated,
          color: c.status === 'resolved' ? '#38A169' : '#3182CE'
        }))
        setRecentActivity(activityItems)
        setNotificationCount(0)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        // Keep zeros on error, do not crash
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: '#E9D8FD', icon: '🔍' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' }
    }
    return map[status] || map.pending
  }

  const getPriorityConfig = (priority) => {
    const map = {
      emergency: { label: 'Emergency', icon: '🔴', color: '#E53E3E' },
      high: { label: 'High', icon: '🟠', color: '#F7931E' },
      normal: { label: 'Normal', icon: '🟡', color: '#ECC94B' },
      low: { label: 'Low', icon: '🔵', color: '#4299E1' }
    }
    return map[priority] || map.normal
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Dashboard">
        <div className="cd-loading">
          <div className="cd-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Citizen Dashboard">
      <div className="cd-container">

        {/* Welcome Banner */}
        <div className="cd-welcome">
          <div className="cd-welcome-content">
            <div className="cd-welcome-text">
              <h2 className="cd-welcome-title">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Citizen'}! 👋
              </h2>
              <p className="cd-welcome-sub">
                Track your complaints, submit new ones, and help build a better India.
              </p>
            </div>

            <div className="cd-welcome-actions">
              <Link to="/citizen/submit" className="cd-btn-primary">
                <span>📝</span> Submit Complaint
              </Link>
              <Link to="/citizen/track" className="cd-btn-secondary">
                <span>🔍</span> Track Complaint
              </Link>
            </div>
          </div>

          <div className="cd-welcome-decoration">
            <div className="cd-circle cd-circle-1"></div>
            <div className="cd-circle cd-circle-2"></div>
            <div className="cd-circle cd-circle-3"></div>
          </div>
        </div>

        {/* Emergency Alert */}
        {stats.emergency > 0 && (
          <div className="cd-emergency-alert">
            <div className="cd-emergency-icon">🚨</div>
            <div className="cd-emergency-body">
              <div className="cd-emergency-title">
                You have {stats.emergency} active emergency{' '}
                {stats.emergency === 1 ? 'complaint' : 'complaints'}
              </div>
              <div className="cd-emergency-desc">
                Our officers are prioritizing these issues. Expected response within 1 hour.
              </div>
            </div>
            <Link to="/citizen/complaints" className="cd-emergency-link">
              View →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="cd-stats-grid">
          <StatCard icon="📋" label="Total Complaints" value={stats.total} color="#FF6B35" />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#ED8936" />
          <StatCard icon="🚧" label="In Progress" value={stats.active} color="#3182CE" />
          <StatCard icon="✅" label="Resolved" value={stats.resolved} color="#38A169" />
        </div>

        {/* Quick Actions */}
        <div className="cd-section">
          <h3 className="cd-section-title">⚡ Quick Actions</h3>
          <div className="cd-actions-grid">
            <Link to="/citizen/submit" className="cd-action-card">
              <div className="cd-action-icon" style={{ background: '#FF6B35' }}>📝</div>
              <div className="cd-action-label">New Complaint</div>
              <div className="cd-action-desc">Report a civic issue</div>
            </Link>

            <Link to="/citizen/track" className="cd-action-card">
              <div className="cd-action-icon" style={{ background: '#4299E1' }}>🔍</div>
              <div className="cd-action-label">Track Status</div>
              <div className="cd-action-desc">Check complaint status</div>
            </Link>

            <Link to="/citizen/emergency" className="cd-action-card cd-action-emergency">
              <div className="cd-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="cd-action-label">Emergency</div>
              <div className="cd-action-desc">Report urgent issue</div>
            </Link>

            <Link to="/citizen/history" className="cd-action-card">
              <div className="cd-action-icon" style={{ background: '#805AD5' }}>📜</div>
              <div className="cd-action-label">History</div>
              <div className="cd-action-desc">Past complaints</div>
            </Link>
          </div>
        </div>

        {/* Two-column: Recent Complaints + Activity */}
        <div className="cd-two-col">
          {/* Recent Complaints */}
          <div className="cd-card cd-card-large">
            <div className="cd-card-header">
              <h3 className="cd-card-title">📋 Recent Complaints</h3>
              <Link to="/citizen/complaints" className="cd-link">View All →</Link>
            </div>

            {recentComplaints.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">📭</div>
                <p>No complaints yet</p>
                <Link to="/citizen/submit" className="cd-empty-btn">Submit First Complaint</Link>
              </div>
            ) : (
              <div className="cd-complaints-list">
                {recentComplaints.map((c) => {
                  const status = getStatusConfig(c.status)
                  const priority = getPriorityConfig(c.priority)
                  return (
                    <div
                      key={c._id}
                      className="cd-complaint-row"
                      onClick={() => navigate(`/citizen/complaints/${c._id}`)} // ✅ FIXED
                    >
                      <div className="cd-complaint-left">
                        <div
                          className="cd-complaint-priority"
                          style={{ background: priority.color }}
                        ></div>
                        <div className="cd-complaint-info">
                          <div className="cd-complaint-meta-top">
                            <span className="cd-complaint-id">{c.id}</span>
                            <span className="cd-complaint-category">
                              {c.categoryIcon} {c.category}
                            </span>
                          </div>
                          <div className="cd-complaint-title">{c.title}</div>
                          <div className="cd-complaint-details">
                            <span>👤 {c.assignedTo}</span>
                            <span>📅 {c.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="cd-complaint-right">
                        <span
                          className="cd-complaint-status"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="cd-card">
            <div className="cd-card-header">
              <h3 className="cd-card-title">🔔 Recent Activity</h3>
              <Link to="/citizen/notifications" className="cd-link">View All →</Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="cd-empty" style={{ padding: '30px 20px' }}>
                <div className="cd-empty-icon" style={{ fontSize: '32px' }}>📭</div>
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="cd-activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="cd-activity-item">
                    <div
                      className="cd-activity-icon"
                      style={{ background: a.color + '20', color: a.color }}
                    >
                      {a.icon}
                    </div>
                    <div className="cd-activity-body">
                      <div className="cd-activity-text">{a.text}</div>
                      <div className="cd-activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="cd-help">
          <div className="cd-help-icon">🆘</div>
          <div className="cd-help-content">
            <h4>Need Help?</h4>
            <p>Our support team is available 24/7 to assist you with your complaints.</p>
          </div>
          <div className="cd-help-actions">
            <a href="tel:1800-XXX-XXXX" className="cd-help-btn">📞 Call 1800-XXX-XXXX</a>
            <a href="mailto:support@janvoice.gov.in" className="cd-help-btn secondary">✉️ Email Support</a>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default CitizenDashboard