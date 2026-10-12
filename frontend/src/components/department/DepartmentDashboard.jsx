import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import { useAuth } from '../../context/AuthContext'
import './DepartmentDashboard.css'

const DepartmentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [departments, setDepartments] = useState([])
  const [urgentCases, setUrgentCases] = useState([])

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines', badge: 5 },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' },
    { icon: '📄', label: 'SLA Reports', path: '/department/sla' },
    { icon: '👨‍💼', label: 'Officer Performance', path: '/department/officers' },
    { icon: '⚙️', label: 'Settings', path: '/department/settings' }
  ]

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalComplaints: 157,
        activeOfficers: 41,
        overdueCases: 8,
        avgSla: 86,
        resolved: 138,
        pending: 19,
        emergency: 4,
        avgResolution: 5.8
      })

      setDepartments([
        { name: 'Public Works', code: 'PW', color: '#FF6B35', officers: 12, complaints: 45, resolved: 38, sla: 84 },
        { name: 'Water Supply', code: 'WS', color: '#4299E1', officers: 8, complaints: 32, resolved: 28, sla: 88 },
        { name: 'Sanitation', code: 'SN', color: '#38A169', officers: 15, complaints: 58, resolved: 52, sla: 90 },
        { name: 'Electricity', code: 'EL', color: '#ED8936', officers: 6, complaints: 22, resolved: 18, sla: 82 }
      ])

      setUrgentCases([
        { id: 'JV2026089', title: 'Road collapse risk on NH-45', priority: 'emergency', deadline: '2 hours', officer: 'Ravi Kumar', location: 'NH-45, Chennai' },
        { id: 'JV2026090', title: 'Water contamination in Ward 12', priority: 'emergency', deadline: '4 hours', officer: 'Priya Sharma', location: 'Ward 12, Chennai' },
        { id: 'JV2026091', title: 'Illegal dumping at lake', priority: 'high', deadline: '12 hours', officer: 'Suresh', location: 'Porur Lake' }
      ])

      setLoading(false)
    }, 600)
  }, [])

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E' },
      high: { icon: '🟠', label: 'High', color: '#F7931E' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1' }
    }
    return map[p] || map.normal
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Dashboard">
        <div className="dd-loading">
          <div className="dd-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      role="department_admin"
      menuItems={menuItems}
      title="Department Dashboard"
    >
      <div className="dd-container">
        {/* Welcome Banner */}
        <div className="dd-welcome">
          <div className="dd-welcome-content">
            <div>
              <h2 className="dd-welcome-title">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 🏛️
              </h2>
              <p className="dd-welcome-sub">
                Managing <strong>{departments.length} departments</strong> with{' '}
                <strong>{stats.activeOfficers} officers</strong>. Currently{' '}
                <strong>{stats.overdueCases} cases</strong> need attention.
              </p>
            </div>
            <div className="dd-welcome-actions">
              <Link to="/department/assign" className="dd-btn-primary">
                👥 Assign Officers
              </Link>
              <Link to="/department/escalate" className="dd-btn-secondary">
                🚨 Escalate Cases
              </Link>
            </div>
          </div>
          <div className="dd-welcome-decoration">
            <div className="dd-circle dd-c1"></div>
            <div className="dd-circle dd-c2"></div>
          </div>
        </div>

        {/* Urgent Alert */}
        {stats.emergency > 0 && (
          <div className="dd-alert">
            <div className="dd-alert-icon">🚨</div>
            <div className="dd-alert-body">
              <div className="dd-alert-title">
                {stats.emergency} Emergency Cases Need Immediate Attention
              </div>
              <div className="dd-alert-desc">
                These cases are nearing or have exceeded their deadlines.
              </div>
            </div>
            <Link to="/department/escalate" className="dd-alert-link">
              View →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="dd-stats-grid">
          <StatCard
            icon="📋"
            label="Total Complaints"
            value={stats.totalComplaints}
            color="#FF6B35"
            trend={12}
          />
          <StatCard
            icon="👥"
            label="Active Officers"
            value={stats.activeOfficers}
            color="#805AD5"
          />
          <StatCard
            icon="⏰"
            label="Overdue Cases"
            value={stats.overdueCases}
            color="#E53E3E"
            trend={-15}
          />
          <StatCard
            icon="📈"
            label="Avg SLA"
            value={stats.avgSla}
            suffix="%"
            color="#38A169"
            trend={5}
          />
          <StatCard
            icon="✅"
            label="Resolved"
            value={stats.resolved}
            color="#38A169"
          />
          <StatCard
            icon="⏳"
            label="Pending"
            value={stats.pending}
            color="#ED8936"
          />
        </div>

        {/* Two Column Grid */}
        <div className="dd-two-col">
          {/* Department Overview */}
          <div className="dd-card">
            <div className="dd-card-header">
              <h3 className="dd-card-title">🏛️ Department Overview</h3>
              <Link to="/department/stats" className="dd-link">
                View Details →
              </Link>
            </div>
            <div className="dd-dept-grid">
              {departments.map((dept, i) => (
                <div key={i} className="dd-dept-item">
                  <div className="dd-dept-header">
                    <span
                      className="dd-dept-badge"
                      style={{ background: dept.color + '20', color: dept.color }}
                    >
                      {dept.code}
                    </span>
                    <span className="dd-dept-sla" style={{ color: dept.color }}>
                      {dept.sla}%
                    </span>
                  </div>
                  <div className="dd-dept-name">{dept.name}</div>
                  <div className="dd-dept-meta">
                    <span>👥 {dept.officers}</span>
                    <span>📋 {dept.complaints}</span>
                    <span>✅ {dept.resolved}</span>
                  </div>
                  <div className="dd-dept-bar">
                    <div
                      className="dd-dept-bar-fill"
                      style={{ width: `${dept.sla}%`, background: dept.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Cases */}
          <div className="dd-card">
            <div className="dd-card-header">
              <h3 className="dd-card-title">🚨 Urgent Cases</h3>
              <Link to="/department/deadlines" className="dd-link">
                View All →
              </Link>
            </div>
            <div className="dd-urgent-list">
              {urgentCases.map((c) => {
                const priority = getPriorityConfig(c.priority)
                return (
                  <div key={c.id} className="dd-urgent-item">
                    <div
                      className="dd-urgent-bar"
                      style={{ background: priority.color }}
                    ></div>
                    <div className="dd-urgent-body">
                      <div className="dd-urgent-meta">
                        <span className="dd-urgent-id">{c.id}</span>
                        <span className="dd-urgent-priority" style={{ color: priority.color }}>
                          {priority.icon} {priority.label}
                        </span>
                      </div>
                      <div className="dd-urgent-title">{c.title}</div>
                      <div className="dd-urgent-details">
                        <span>👤 {c.officer}</span>
                        <span>⏰ {c.deadline}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dd-card">
          <div className="dd-card-header">
            <h3 className="dd-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="dd-actions-grid">
            <Link to="/department/assign" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#FF6B35' }}>👥</div>
              <div className="dd-action-label">Assign Officers</div>
            </Link>
            <Link to="/department/deadlines" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#ED8936' }}>⏰</div>
              <div className="dd-action-label">Monitor Deadlines</div>
            </Link>
            <Link to="/department/escalate" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="dd-action-label">Escalate Cases</div>
            </Link>
            <Link to="/department/analytics" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#805AD5' }}>📈</div>
              <div className="dd-action-label">Analytics</div>
            </Link>
            <Link to="/department/sla" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#4299E1' }}>📄</div>
              <div className="dd-action-label">SLA Reports</div>
            </Link>
            <Link to="/department/officers" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#38A169' }}>👨‍💼</div>
              <div className="dd-action-label">Officer Performance</div>
            </Link>
            <Link to="/department/allocation" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#F7931E' }}>📦</div>
              <div className="dd-action-label">Resource Allocation</div>
            </Link>
            <Link to="/department/settings" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#4A5568' }}>⚙️</div>
              <div className="dd-action-label">Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentDashboard