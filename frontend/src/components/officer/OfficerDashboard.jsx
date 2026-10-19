import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './OfficerDashboard.css'

const OfficerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // ✅ FIXED: Removed "Investigate" — it navigates from Assigned Cases instead
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📊', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    emergency: 0,
    resolvedToday: 0,
    avgResolution: 0
  })
  const [priorityCases, setPriorityCases] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)

        const complaintsRes = await api.get('/complaints/assigned')
        const rawData =
          complaintsRes.data?.data ||
          complaintsRes.data?.complaints ||
          (Array.isArray(complaintsRes.data) ? complaintsRes.data : [])

        let officialStats = null
        try {
          const statsRes = await api.get('/complaints/officer-stats')
          officialStats = statsRes.data?.stats
        } catch (err) {
          // Compute from complaints
        }

        const activeStatuses = ['pending', 'assigned', 'investigating', 'in-progress']
        const emergencyCount = rawData.filter(
          (c) => c.priority === 'emergency' && c.status !== 'resolved'
        ).length
        const resolvedTodayCount = rawData.filter((c) => {
          if (c.status !== 'resolved' || !c.resolvedAt) return false
          const resolved = new Date(c.resolvedAt)
          const today = new Date()
          return (
            resolved.getDate() === today.getDate() &&
            resolved.getMonth() === today.getMonth() &&
            resolved.getFullYear() === today.getFullYear()
          )
        }).length

        const resolvedCases = rawData.filter(
          (c) => c.status === 'resolved' && c.resolvedAt && c.createdAt
        )
        const avgDays =
          resolvedCases.length > 0
            ? Math.round(
                (resolvedCases.reduce((sum, c) => {
                  const created = new Date(c.createdAt)
                  const resolved = new Date(c.resolvedAt)
                  return sum + (resolved - created) / (1000 * 60 * 60 * 24)
                }, 0) /
                  resolvedCases.length) *
                  10
              ) / 10
            : 0

        setStats({
          total: officialStats?.total || rawData.length,
          active: officialStats?.pending || rawData.filter((c) => activeStatuses.includes(c.status)).length,
          emergency: officialStats?.emergency || emergencyCount,
          resolvedToday: officialStats?.resolvedToday || resolvedTodayCount,
          avgResolution: avgDays
        })

        const priority = rawData
          .filter((c) => {
            if (c.status === 'resolved' || c.status === 'rejected') return false
            if (c.priority === 'emergency' || c.priority === 'high') return true
            if (c.deadline && new Date(c.deadline) < new Date()) return true
            return false
          })
          .sort((a, b) => {
            const priorityOrder = { emergency: 0, high: 1, normal: 2, low: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          })
          .slice(0, 3)
          .map((c) => {
            const deadline = c.deadline ? new Date(c.deadline) : null
            const hoursLeft = deadline
              ? Math.round((deadline - Date.now()) / (1000 * 60 * 60))
              : null
            return {
              _id: c._id,
              id: c.complaintId || c._id,
              title: c.title || 'Untitled',
              location: c.location?.address || c.location || 'Not specified',
              priority: c.priority || 'normal',
              affectedPeople: c.affectedPeople || 1,
              hoursLeft
            }
          })
        setPriorityCases(priority)

        const activity = [...rawData]
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 5)
          .map((c) => {
            const statusIcons = {
              resolved: '✅',
              'in-progress': '🚧',
              investigating: '🔍',
              assigned: '👤',
              pending: '⏳'
            }
            const statusText = {
              resolved: 'Resolved',
              'in-progress': 'Work in progress',
              investigating: 'Started investigation',
              assigned: 'Assigned',
              pending: 'New case'
            }
            const colors = {
              resolved: '#38A169',
              'in-progress': '#3182CE',
              investigating: '#805AD5',
              assigned: '#4299E1',
              pending: '#ED8936'
            }
            return {
              icon: statusIcons[c.status] || '📋',
              color: colors[c.status] || '#718096',
              text: `${statusText[c.status] || 'Updated'}: ${c.complaintId || c._id}`,
              time: timeAgo(c.updatedAt || c.createdAt),
              _id: c._id
            }
          })
        setRecentActivity(activity)
      } catch (err) {
        console.error('Failed to fetch dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (mins > 0) return `${mins}m ago`
    return 'Just now'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getPriorityConfig = (priority) => {
    const map = {
      emergency: { label: 'Emergency', color: '#E53E3E', icon: '🔴' },
      high: { label: 'High', color: '#F7931E', icon: '🟠' },
      normal: { label: 'Normal', color: '#ECC94B', icon: '🟡' },
      low: { label: 'Low', color: '#4299E1', icon: '🔵' }
    }
    return map[priority] || map.normal
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Dashboard">
        <div className="od-loading">
          <div className="od-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Officer Dashboard">
      <div className="od-container">
        {/* Welcome Banner */}
        <div className="od-welcome">
          <div className="od-welcome-content">
            <div>
              <h1 className="od-welcome-title">
                {getGreeting()}, Officer {user?.name?.split(' ')[0] || 'Officer'}! 🏅
              </h1>
              <p className="od-welcome-sub">
                You have <strong>{stats.active}</strong> active cases
                {stats.emergency > 0 && (
                  <> and <strong>{stats.emergency}</strong> {stats.emergency === 1 ? 'emergency' : 'emergencies'}</>
                )}{' '}
                today.
              </p>
            </div>
            <div className="od-welcome-actions">
              <Link to="/officer/assigned" className="od-btn-primary">
                📋 View Assigned Cases
              </Link>
              <Link to="/officer/performance" className="od-btn-secondary">
                📈 My Performance
              </Link>
            </div>
          </div>
          <div className="od-welcome-decoration">
            <div className="od-circle od-c1"></div>
            <div className="od-circle od-c2"></div>
          </div>
        </div>

        {/* Emergency Alert */}
        {stats.emergency > 0 && (
          <div className="od-alert">
            <div className="od-alert-icon">🚨</div>
            <div className="od-alert-body">
              <div className="od-alert-title">
                {stats.emergency} Emergency {stats.emergency === 1 ? 'Case Needs' : 'Cases Need'} Immediate Action
              </div>
              <div className="od-alert-desc">
                These cases have very short SLA deadlines. Prioritize them now.
              </div>
            </div>
            <Link to="/officer/assigned" className="od-alert-link">
              View →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="od-stats-grid">
          <div className="od-stat-card" style={{ '--c': '#4299E1' }}>
            <div className="od-stat-value">{stats.total}</div>
            <div className="od-stat-label">Total Assigned</div>
          </div>
          <div className="od-stat-card" style={{ '--c': '#3182CE' }}>
            <div className="od-stat-value">{stats.active}</div>
            <div className="od-stat-label">Active Cases</div>
          </div>
          <div className="od-stat-card" style={{ '--c': '#E53E3E' }}>
            <div className="od-stat-value">{stats.emergency}</div>
            <div className="od-stat-label">Emergency</div>
          </div>
          <div className="od-stat-card" style={{ '--c': '#38A169' }}>
            <div className="od-stat-value">{stats.resolvedToday}</div>
            <div className="od-stat-label">Resolved Today</div>
          </div>
          <div className="od-stat-card" style={{ '--c': '#805AD5' }}>
            <div className="od-stat-value">{stats.avgResolution}d</div>
            <div className="od-stat-label">Avg Resolution</div>
          </div>
        </div>

        {/* Priority + Activity */}
        <div className="od-two-col">
          <div className="od-card">
            <div className="od-card-header">
              <h3 className="od-card-title">🎯 Priority Cases</h3>
              <Link to="/officer/assigned" className="od-link">
                View All →
              </Link>
            </div>

            {priorityCases.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>✨</div>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>No priority cases</p>
                <p style={{ fontSize: '12px' }}>You're all caught up on urgent cases.</p>
              </div>
            ) : (
              <div className="od-cases-list">
                {priorityCases.map((c) => {
                  const priority = getPriorityConfig(c.priority)
                  return (
                    <div
                      key={c._id}
                      className="od-case-item"
                      onClick={() => navigate(`/officer/investigate/${c._id}`)}
                    >
                      <div className="od-case-bar" style={{ background: priority.color }}></div>
                      <div className="od-case-body">
                        <div className="od-case-meta">
                          <span className="od-case-id">{c.id}</span>
                          <span className="od-case-priority" style={{ color: priority.color }}>
                            {priority.icon} {priority.label}
                          </span>
                        </div>
                        <div className="od-case-title">{c.title}</div>
                        <div className="od-case-details">
                          <span>📍 {c.location}</span>
                          <span>👥 {c.affectedPeople} affected</span>
                          {c.hoursLeft !== null && (
                            <span className={c.hoursLeft < 0 || c.hoursLeft < 24 ? 'od-case-deadline' : ''}>
                              ⏰ {c.hoursLeft < 0
                                ? `Overdue ${Math.abs(c.hoursLeft)}h`
                                : `${c.hoursLeft}h left`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="od-card">
            <div className="od-card-header">
              <h3 className="od-card-title">📋 Recent Activity</h3>
            </div>

            {recentActivity.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📭</div>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>No recent activity</p>
                <p style={{ fontSize: '12px' }}>Activity on your assigned cases will appear here.</p>
              </div>
            ) : (
              <div className="od-activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="od-activity-item">
                    <div
                      className="od-activity-icon"
                      style={{ background: a.color + '20', color: a.color }}
                    >
                      {a.icon}
                    </div>
                    <div className="od-activity-body">
                      <div className="od-activity-text">{a.text}</div>
                      <div className="od-activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="od-card">
          <div className="od-card-header">
            <h3 className="od-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="od-actions-grid">
            <Link to="/officer/assigned" className="od-action">
              <div className="od-action-icon" style={{ background: '#4299E1' }}>📋</div>
              <div className="od-action-label">Assigned Cases</div>
            </Link>
            {/* ✅ FIXED: Removed "Investigate" quick action since no dedicated page exists */}
            <Link to="/officer/evidence" className="od-action">
              <div className="od-action-icon" style={{ background: '#38A169' }}>📤</div>
              <div className="od-action-label">Upload Evidence</div>
            </Link>
            <Link to="/officer/notes" className="od-action">
              <div className="od-action-icon" style={{ background: '#ED8936' }}>📝</div>
              <div className="od-action-label">Notes</div>
            </Link>
            <Link to="/officer/escalate" className="od-action">
              <div className="od-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="od-action-label">Escalate</div>
            </Link>
            <Link to="/officer/performance" className="od-action">
              <div className="od-action-icon" style={{ background: '#805AD5' }}>📊</div>
              <div className="od-action-label">Performance</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OfficerDashboard