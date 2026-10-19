import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './AuthorityDashboard.css'

const AuthorityDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  
  // Safe initial state
  const [stats, setStats] = useState({
    totalComplaints: 0,
    escalated: 0,
    overdue: 0,
    avgPerformance: 0,
    resolved: 0,
    pending: 0,
    emergency: 0,
    avgResolution: 0
  })
  const [escalated, setEscalated] = useState([])
  const [departments, setDepartments] = useState([])

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated', badge: stats.escalated > 0 ? stats.escalated : null },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue', badge: stats.overdue > 0 ? stats.overdue : null },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch real stats
        const statsRes = await api.get('/authority/dashboard')
        console.log("DASHBOARD API RESPONSE:", statsRes.data) // Debug log

        if (statsRes.data && statsRes.data.success) {
          setStats(prev => ({
            ...prev,
            ...statsRes.data.stats 
          }))
        }

        // 2. Fetch recent escalations
        try {
          const escRes = await api.get('/authority/escalated?limit=4')
          setEscalated(escRes.data?.complaints || [])
        } catch (e) { console.warn('Could not load escalations') }

        // 3. Fetch department comparison
        try {
          const deptRes = await api.get('/authority/departments')
          setDepartments(deptRes.data?.departments?.slice(0, 4) || [])
        } catch (e) { console.warn('Could not load departments') }

      } catch (err) {
        console.error('Failed to load authority dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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
        <div className="ad-welcome" style={{ background: 'linear-gradient(135deg, #742A2A 0%, #C53030 60%, #FC8181 100%)' }}>
          <div className="ad-welcome-content">
            <div>
              <h2 className="ad-welcome-title" style={{ color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Authority'}! ⭐
              </h2>
              <p className="ad-welcome-sub" style={{ color: '#FFFFFF', opacity: 1, fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                {/* ✅ SAFETY CHECK ADDED HERE: (stats.totalComplaints || 0) */}
                Monitoring <strong style={{ color: '#FFD700' }}>{(stats.totalComplaints || 0).toLocaleString()} complaints</strong>{' '}
                across all departments. <strong style={{ color: '#FFD700' }}>{stats.escalated || 0} escalated</strong> cases need
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
          <StatCard icon="🚨" label="Escalated" value={stats.escalated || 0} color="#E53E3E" />
          <StatCard icon="⏰" label="Overdue" value={stats.overdue || 0} color="#F7931E" />
          <StatCard icon="🏛️" label="Departments" value={departments.length} color="#805AD5" />
          <StatCard icon="⭐" label="Avg Performance" value={stats.avgPerformance || 0} suffix="%" color="#38A169" />
          <StatCard icon="✅" label="Resolved" value={stats.resolved || 0} color="#38A169" />
          <StatCard icon="⏳" label="Pending" value={stats.pending || 0} color="#ED8936" />
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
              {escalated.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '20px' }}>No escalations yet.</p>
              ) : (
                escalated.map((e) => (
                  <div key={e._id} className="ad-escalated-item">
                    <div className={`ad-escalated-bar severity-${e.priority === 'emergency' ? 'critical' : 'high'}`}></div>
                    <div className="ad-escalated-body">
                      <div className="ad-escalated-meta">
                        <span className="ad-escalated-id">{e.complaintId || e._id}</span>
                        <span className={`ad-severity-badge severity-${e.priority === 'emergency' ? 'critical' : 'high'}`}>
                          {e.priority === 'emergency' ? '🔴 Critical' : '🟠 High'}
                        </span>
                      </div>
                      <div className="ad-escalated-title">{e.title}</div>
                      <div className="ad-escalated-details">
                        <span>🏛️ {e.department}</span>
                        <span>👤 {e.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              {departments.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '20px' }}>No department data.</p>
              ) : (
                departments.map((d, i) => (
                  <div key={i} className="ad-dept-item">
                    <div className="ad-dept-header">
                      <span className="ad-dept-name">{d.name || d._id}</span>
                    </div>
                    <div className="ad-dept-stats">
                      <span>✅ {d.resolved || 0} resolved</span>
                      <span>⏳ {d.pending || 0} pending</span>
                    </div>
                    <div className="ad-dept-bar-wrapper">
                      <div className="ad-dept-bar">
                        <div
                          className="ad-dept-bar-fill"
                          style={{
                            width: `${d.sla || 0}%`,
                            background: (d.sla || 0) >= 85 ? '#38A169' : (d.sla || 0) >= 75 ? '#ED8936' : '#E53E3E'
                          }}
                        ></div>
                      </div>
                      <span className="ad-dept-sla">{d.sla || 0}%</span>
                    </div>
                  </div>
                ))
              )}
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