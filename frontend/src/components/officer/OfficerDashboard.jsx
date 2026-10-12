import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import { useAuth } from '../../context/AuthContext'
import './OfficerDashboard.css'

const OfficerDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [priorityCases, setPriorityCases] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned', badge: 8 },
    { icon: '🔍', label: 'Investigate', path: '/officer/investigate' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  useEffect(() => {
    setTimeout(() => {
      setStats({
        total: 24,
        active: 8,
        emergency: 2,
        resolvedToday: 5,
        resolved: 16,
        avgDays: 3.8,
        sla: 92,
        rating: 4.7
      })

      setPriorityCases([
        { id: 'JV2026100', title: 'Road collapse risk on NH-45', priority: 'emergency', deadline: '2 hours', location: 'NH-45', citizens: 340, status: 'urgent' },
        { id: 'JV2026101', title: 'Water contamination Ward 12', priority: 'emergency', deadline: '4 hours', location: 'Ward 12', citizens: 220, status: 'urgent' },
        { id: 'JV2026102', title: 'Streetlight outage main road', priority: 'high', deadline: '12 hours', location: 'MG Road', citizens: 95, status: 'investigate' }
      ])

      setRecentActivity([
        { icon: '✅', text: 'Resolved JV2026099 — Drainage blockage', time: '10 min ago', color: '#38A169' },
        { icon: '📤', text: 'Uploaded evidence for JV2026098', time: '45 min ago', color: '#4299E1' },
        { icon: '🔍', text: 'Started investigation for JV2026100', time: '2 hours ago', color: '#805AD5' },
        { icon: '🔄', text: 'Requested reassignment for JV2026097', time: '5 hours ago', color: '#ED8936' }
      ])

      setLoading(false)
    }, 600)
  }, [])

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E', bg: '#FED7D7' },
      high: { icon: '🟠', label: 'High', color: '#F7931E', bg: '#FEEBC8' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B', bg: '#FEFCBF' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1', bg: '#BEE3F8' }
    }
    return map[p] || map.normal
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Officer Dashboard">
        <div className="od-loading">
          <div className="od-spinner"></div>
          <p>Loading dashboard...</p>
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
              <h2 className="od-welcome-title">
                {getGreeting()}, Officer {user?.name?.split(' ')[0] || ''}! 🎖️
              </h2>
              <p className="od-welcome-sub">
                You have <strong>{stats.active} active cases</strong> and{' '}
                <strong>{stats.emergency} emergencies</strong> today.
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
                {stats.emergency} Emergency Cases Need Immediate Action
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
          <StatCard icon="📋" label="Total Assigned" value={stats.total} color="#FF6B35" />
          <StatCard icon="🚧" label="Active Cases" value={stats.active} color="#3182CE" />
          <StatCard icon="🔴" label="Emergency" value={stats.emergency} color="#E53E3E" trend={-15} />
          <StatCard icon="✅" label="Resolved Today" value={stats.resolvedToday} color="#38A169" trend={25} />
          <StatCard icon="⏱️" label="Avg Resolution" value={stats.avgDays} suffix="d" color="#4299E1" />
          <StatCard icon="📈" label="SLA Compliance" value={stats.sla} suffix="%" color="#805AD5" trend={8} />
        </div>

        {/* Two Column Grid */}
        <div className="od-two-col">
          {/* Priority Cases */}
          <div className="od-card">
            <div className="od-card-header">
              <h3 className="od-card-title">🎯 Priority Cases</h3>
              <Link to="/officer/assigned" className="od-link">
                View All →
              </Link>
            </div>
            <div className="od-cases-list">
              {priorityCases.map((c) => {
                const priority = getPriorityConfig(c.priority)
                return (
                  <div
                    key={c.id}
                    className="od-case-item"
                    onClick={() => navigate(`/officer/case/${c.id}`)}
                  >
                    <div
                      className="od-case-bar"
                      style={{ background: priority.color }}
                    ></div>
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
                        <span>👥 {c.citizens}</span>
                        <span className="od-case-deadline">⏰ {c.deadline}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="od-card">
            <div className="od-card-header">
              <h3 className="od-card-title">📋 Recent Activity</h3>
            </div>
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="od-card">
          <div className="od-card-header">
            <h3 className="od-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="od-actions-grid">
            <Link to="/officer/investigate" className="od-action">
              <div className="od-action-icon" style={{ background: '#805AD5' }}>🔍</div>
              <div className="od-action-label">Investigate</div>
            </Link>
            <Link to="/officer/evidence" className="od-action">
              <div className="od-action-icon" style={{ background: '#4299E1' }}>📤</div>
              <div className="od-action-label">Upload Evidence</div>
            </Link>
            <Link to="/officer/notes" className="od-action">
              <div className="od-action-icon" style={{ background: '#38A169' }}>📝</div>
              <div className="od-action-label">Add Notes</div>
            </Link>
            <Link to="/officer/reassign" className="od-action">
              <div className="od-action-icon" style={{ background: '#ED8936' }}>🔄</div>
              <div className="od-action-label">Request Reassign</div>
            </Link>
            <Link to="/officer/escalate" className="od-action">
              <div className="od-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="od-action-label">Escalate</div>
            </Link>
            <Link to="/officer/report" className="od-action">
              <div className="od-action-icon" style={{ background: '#FF6B35' }}>📄</div>
              <div className="od-action-label">Resolution Report</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OfficerDashboard