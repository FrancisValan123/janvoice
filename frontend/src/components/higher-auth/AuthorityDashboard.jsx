import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import { useAuth } from '../../context/AuthContext'
import './AuthorityDashboard.css'

const AuthorityDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [escalated, setEscalated] = useState([])
  const [departments, setDepartments] = useState([])

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated', badge: 12 },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue', badge: 5 },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalComplaints: 1247,
        escalated: 12,
        overdue: 5,
        avgPerformance: 78,
        resolved: 1089,
        pending: 158,
        emergency: 8,
        avgResolution: 6.4
      })

      setEscalated([
        { id: 'JV2026089', title: 'Road collapse risk on NH-45', dept: 'Public Works', officer: 'Ravi Kumar', days: 12, severity: 'critical' },
        { id: 'JV2026090', title: 'Water contamination Ward 12', dept: 'Water Supply', officer: 'Priya Sharma', days: 8, severity: 'high' },
        { id: 'JV2026091', title: 'Illegal dumping at lake', dept: 'Sanitation', officer: 'Suresh Rajan', days: 15, severity: 'critical' },
        { id: 'JV2026092', title: 'Streetlight outage main road', dept: 'Electricity', officer: 'Anand Verma', days: 6, severity: 'high' }
      ])

      setDepartments([
        { name: 'Public Works', sla: 84, resolved: 38, pending: 7, trend: 12 },
        { name: 'Water Supply', sla: 88, resolved: 28, pending: 4, trend: 8 },
        { name: 'Sanitation', sla: 90, resolved: 52, pending: 6, trend: 15 },
        { name: 'Electricity', sla: 82, resolved: 18, pending: 4, trend: -3 }
      ])

      setLoading(false)
    }, 600)
  }, [])

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Authority Dashboard">
        <div className="ad-loading">
          <div className="ad-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      role="higher_authority"
      menuItems={menuItems}
      title="Higher Authority Dashboard"
    >
      <div className="ad-container">
        {/* Welcome Banner */}
        <div className="ad-welcome">
          <div className="ad-welcome-content">
            <div>
              <h2 className="ad-welcome-title">
                Welcome back, {user?.name?.split(' ')[0] || 'Authority'}! ⭐
              </h2>
              <p className="ad-welcome-sub">
                Monitoring <strong>{stats.totalComplaints.toLocaleString()} complaints</strong>{' '}
                across all departments. <strong>{stats.escalated} escalated</strong> cases need
                your attention.
              </p>
            </div>
            <div className="ad-welcome-actions">
              <Link to="/authority/escalated" className="ad-btn-primary">
                🚨 Review Escalations
              </Link>
              <Link to="/authority/overdue" className="ad-btn-secondary">
                ⏰ Overdue Cases
              </Link>
            </div>
          </div>
          <div className="ad-welcome-decoration">
            <div className="ad-circle ad-c1"></div>
            <div className="ad-circle ad-c2"></div>
          </div>
        </div>

        {/* Alert */}
        {stats.escalated > 0 && (
          <div className="ad-alert">
            <div className="ad-alert-icon">🚨</div>
            <div className="ad-alert-body">
              <div className="ad-alert-title">
                {stats.escalated} Escalated Cases Require Immediate Action
              </div>
              <div className="ad-alert-desc">
                Cases have exceeded SLA or been escalated by department admins.
              </div>
            </div>
            <Link to="/authority/escalated" className="ad-alert-link">
              View →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="ad-stats-grid">
          <StatCard icon="🚨" label="Escalated" value={stats.escalated} color="#E53E3E" trend={20} />
          <StatCard icon="⏰" label="Overdue" value={stats.overdue} color="#F7931E" trend={-10} />
          <StatCard icon="🏛️" label="Departments" value={4} color="#805AD5" />
          <StatCard icon="⭐" label="Avg Performance" value={stats.avgPerformance} suffix="%" color="#38A169" trend={8} />
          <StatCard icon="✅" label="Resolved" value={stats.resolved} color="#38A169" />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#ED8936" />
        </div>

        {/* Two Column */}
        <div className="ad-two-col">
          {/* Escalated Cases */}
          <div className="ad-card">
            <div className="ad-card-header">
              <h3 className="ad-card-title">🚨 Recent Escalations</h3>
              <Link to="/authority/escalated" className="ad-link">
                View All →
              </Link>
            </div>
            <div className="ad-escalated-list">
              {escalated.map((e) => (
                <div key={e.id} className="ad-escalated-item">
                  <div className={`ad-escalated-bar severity-${e.severity}`}></div>
                  <div className="ad-escalated-body">
                    <div className="ad-escalated-meta">
                      <span className="ad-escalated-id">{e.id}</span>
                      <span className={`ad-severity-badge severity-${e.severity}`}>
                        {e.severity === 'critical' ? '🔴 Critical' : '🟠 High'}
                      </span>
                    </div>
                    <div className="ad-escalated-title">{e.title}</div>
                    <div className="ad-escalated-details">
                      <span>🏛️ {e.dept}</span>
                      <span>👤 {e.officer}</span>
                      <span className="ad-overdue">⏰ {e.days}d overdue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="ad-card">
            <div className="ad-card-header">
              <h3 className="ad-card-title">📊 Department Performance</h3>
              <Link to="/authority/departments" className="ad-link">
                Compare →
              </Link>
            </div>
            <div className="ad-dept-list">
              {departments.map((d, i) => (
                <div key={i} className="ad-dept-item">
                  <div className="ad-dept-header">
                    <span className="ad-dept-name">{d.name}</span>
                    <span className={`ad-dept-trend ${d.trend >= 0 ? 'up' : 'down'}`}>
                      {d.trend >= 0 ? '↑' : '↓'} {Math.abs(d.trend)}%
                    </span>
                  </div>
                  <div className="ad-dept-stats">
                    <span>✅ {d.resolved} resolved</span>
                    <span>⏳ {d.pending} pending</span>
                  </div>
                  <div className="ad-dept-bar-wrapper">
                    <div className="ad-dept-bar">
                      <div
                        className="ad-dept-bar-fill"
                        style={{
                          width: `${d.sla}%`,
                          background: d.sla >= 85 ? '#38A169' : d.sla >= 75 ? '#ED8936' : '#E53E3E'
                        }}
                      ></div>
                    </div>
                    <span className="ad-dept-sla">{d.sla}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h3 className="ad-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="ad-actions-grid">
            <Link to="/authority/escalated" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="ad-action-label">Review Escalations</div>
            </Link>
            <Link to="/authority/overdue" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#F7931E' }}>⏰</div>
              <div className="ad-action-label">Overdue Review</div>
            </Link>
            <Link to="/authority/performance" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#805AD5' }}>📈</div>
              <div className="ad-action-label">Performance</div>
            </Link>
            <Link to="/authority/departments" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#4299E1' }}>🏛️</div>
              <div className="ad-action-label">Departments</div>
            </Link>
            <Link to="/authority/reports" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#38A169' }}>📄</div>
              <div className="ad-action-label">Action Reports</div>
            </Link>
            <Link to="/authority/statistics" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#FF6B35' }}>📊</div>
              <div className="ad-action-label">Statistics</div>
            </Link>
            <Link to="/authority/recommendations" className="ad-action">
              <div className="ad-action-icon" style={{ background: '#ECC94B' }}>💡</div>
              <div className="ad-action-label">Recommendations</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AuthorityDashboard