import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '👥', label: 'Users', path: '/admin/users' },
    { icon: '🏛️', label: 'Departments', path: '/admin/departments' },
    { icon: '📂', label: 'Categories', path: '/admin/categories' },
    { icon: '🔐', label: 'Roles', path: '/admin/roles' },
    { icon: '📋', label: 'Audit Log', path: '/admin/audit' },
    { icon: '💾', label: 'Backups', path: '/admin/backups' },
    { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
    { icon: '🖥️', label: 'System Health', path: '/admin/health' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' }
  ]

  // Fetch dashboard data (uses demo data — replace with real API later)
  useEffect(() => {
    setTimeout(() => {
      setData({
        totalUsers: 1247,
        totalComplaints: 12847,
        totalOfficers: 156,
        totalDepartments: 8,
        resolvedToday: 87,
        pendingComplaints: 1234,
        emergencyActive: 12,
        resolutionRate: 78,
        systemHealth: 99.8,
        storageUsed: 47,
        storageTotal: 100
      })

      setRecentActivities([
        { id: 1, user: 'Officer Ravi', action: 'Resolved complaint #JV2026088', time: '2 min ago', type: 'success', icon: '✅' },
        { id: 2, user: 'Admin Priya', action: 'Added new officer account', time: '15 min ago', type: 'info', icon: '👤' },
        { id: 3, user: 'Citizen Kumar', action: 'Submitted emergency complaint', time: '32 min ago', type: 'warning', icon: '🚨' },
        { id: 4, user: 'Dept Head Suresh', action: 'Escalated case #JV2026089', time: '1 hour ago', type: 'danger', icon: '⚠️' },
        { id: 5, user: 'System', action: 'Auto-backup completed', time: '2 hours ago', type: 'success', icon: '💾' },
        { id: 6, user: 'Officer Meena', action: 'Uploaded action evidence', time: '3 hours ago', type: 'info', icon: '📤' }
      ])

      setSystemAlerts([
        { icon: '✅', color: '#38A169', bg: '#c6f6d5', message: 'Database connection healthy', time: 'Live' },
        { icon: '✅', color: '#38A169', bg: '#c6f6d5', message: 'Email service operational', time: 'Live' },
        { icon: 'ℹ️', color: '#4299E1', bg: '#bee3f8', message: 'Next backup in 4 hours', time: 'Scheduled' }
      ])

      setLoading(false)
    }, 800)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-full">
          <div className="spinner-xlarge"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🇮🇳</span>
            {sidebarOpen && <span className="logo-text">JanVoice</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="admin-badge">
          <span className="badge-icon">⚙️</span>
          {sidebarOpen && <span className="badge-text">System Admin</span>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                window.location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-name">{user?.name || 'Admin'}</div>
                <div className="user-role">System Administrator</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="page-title">System Admin Dashboard</h1>
          <div className="topbar-right">
            <button className="icon-btn" title="Notifications">
              🔔
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn" title="Messages">✉️</button>
            <button className="icon-btn" title="Help">❓</button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h2>Welcome back, {user?.name || 'Admin'}! ⚙️</h2>
              <p>
                System is running smoothly. Managing{' '}
                <strong>{data.totalUsers.toLocaleString()} users</strong> across{' '}
                <strong>{data.totalDepartments} departments</strong>.
              </p>
            </div>
            <div className="banner-actions">
              <Link to="/admin/users" className="btn-banner-primary">
                👥 Manage Users
              </Link>
              <Link to="/admin/analytics" className="btn-banner-secondary">
                📊 View Analytics
              </Link>
            </div>
          </div>

          {/* KPI Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--accent': '#FF6B35' }}>
              <div className="stat-icon">👥</div>
              <div className="stat-body">
                <div className="stat-value">{data.totalUsers.toLocaleString()}</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-trend up">↑ 12% this month</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent': '#4299E1' }}>
              <div className="stat-icon">📋</div>
              <div className="stat-body">
                <div className="stat-value">{data.totalComplaints.toLocaleString()}</div>
                <div className="stat-label">Total Complaints</div>
                <div className="stat-trend up">↑ 8% this month</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent': '#805AD5' }}>
              <div className="stat-icon">👨‍💼</div>
              <div className="stat-body">
                <div className="stat-value">{data.totalOfficers}</div>
                <div className="stat-label">Active Officers</div>
                <div className="stat-trend">{data.totalDepartments} departments</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent': '#E53E3E' }}>
              <div className="stat-icon">🔴</div>
              <div className="stat-body">
                <div className="stat-value">{data.emergencyActive}</div>
                <div className="stat-label">Active Emergencies</div>
                <div className="stat-trend down">Needs attention</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent': '#38A169' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-body">
                <div className="stat-value">{data.resolvedToday}</div>
                <div className="stat-label">Resolved Today</div>
                <div className="stat-trend up">↑ 24%</div>
              </div>
            </div>

            <div className="stat-card" style={{ '--accent': '#F7931E' }}>
              <div className="stat-icon">⏳</div>
              <div className="stat-body">
                <div className="stat-value">{data.pendingComplaints.toLocaleString()}</div>
                <div className="stat-label">Pending</div>
                <div className="stat-trend">Across all depts</div>
              </div>
            </div>
          </div>

          {/* System Overview + Quick Actions */}
          <div className="two-col-grid">
            {/* System Health Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">🖥️ System Health</h3>
                <span className="status-badge operational">
                  🟢 Operational
                </span>
              </div>

              <div className="health-metrics">
                <div className="health-metric">
                  <div className="metric-header">
                    <span className="metric-name">System Uptime</span>
                    <span className="metric-value green">{data.systemHealth}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill green"
                      style={{ width: `${data.systemHealth}%` }}
                    ></div>
                  </div>
                </div>

                <div className="health-metric">
                  <div className="metric-header">
                    <span className="metric-name">Resolution Rate</span>
                    <span className="metric-value blue">{data.resolutionRate}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill blue"
                      style={{ width: `${data.resolutionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="health-metric">
                  <div className="metric-header">
                    <span className="metric-name">Storage Used</span>
                    <span className="metric-value orange">
                      {data.storageUsed} GB / {data.storageTotal} GB
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill orange"
                      style={{
                        width: `${(data.storageUsed / data.storageTotal) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* System Alerts */}
              <div className="alerts-section">
                {systemAlerts.map((alert, i) => (
                  <div key={i} className="alert-item">
                    <span
                      className="alert-icon-mini"
                      style={{ background: alert.bg, color: alert.color }}
                    >
                      {alert.icon}
                    </span>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">⚡ Quick Actions</h3>
              </div>

              <div className="quick-actions-grid">
                <Link to="/admin/users" className="quick-action">
                  <span className="qa-icon">👥</span>
                  <span className="qa-label">Manage Users</span>
                </Link>
                <Link to="/admin/departments" className="quick-action">
                  <span className="qa-icon">🏛️</span>
                  <span className="qa-label">Departments</span>
                </Link>
                <Link to="/admin/categories" className="quick-action">
                  <span className="qa-icon">📂</span>
                  <span className="qa-label">Categories</span>
                </Link>
                <Link to="/admin/audit" className="quick-action">
                  <span className="qa-icon">📋</span>
                  <span className="qa-label">Audit Log</span>
                </Link>
                <Link to="/admin/backups" className="quick-action">
                  <span className="qa-icon">💾</span>
                  <span className="qa-label">Backups</span>
                </Link>
                <Link to="/admin/analytics" className="quick-action">
                  <span className="qa-icon">📈</span>
                  <span className="qa-label">Analytics</span>
                </Link>
                <Link to="/admin/health" className="quick-action">
                  <span className="qa-icon">🖥️</span>
                  <span className="qa-label">Health</span>
                </Link>
                <Link to="/admin/settings" className="quick-action">
                  <span className="qa-icon">⚙️</span>
                  <span className="qa-label">Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">📋 Recent Activity</h3>
              <Link to="/admin/audit" className="btn-link">
                View All →
              </Link>
            </div>

            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.type}`}>
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-info">
                    <div className="activity-text">
                      <strong>{activity.user}</strong> — {activity.action}
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">🏛️ Department Overview</h3>
              <Link to="/admin/departments" className="btn-link">
                Manage →
              </Link>
            </div>

            <div className="dept-overview-grid">
              {[
                { name: 'Public Works', code: 'PW', color: '#FF6B35', officers: 12, complaints: 45, sla: 84 },
                { name: 'Water Supply', code: 'WS', color: '#4299E1', officers: 8, complaints: 32, sla: 88 },
                { name: 'Sanitation', code: 'SN', color: '#38A169', officers: 15, complaints: 58, sla: 90 },
                { name: 'Electricity', code: 'EL', color: '#ED8936', officers: 6, complaints: 22, sla: 82 }
              ].map((dept, i) => (
                <div key={i} className="dept-overview-card">
                  <div className="dept-header-row">
                    <span
                      className="dept-code"
                      style={{ background: dept.color + '20', color: dept.color }}
                    >
                      {dept.code}
                    </span>
                    <span className="dept-sla" style={{ color: dept.color }}>
                      {dept.sla}% SLA
                    </span>
                  </div>
                  <div className="dept-name">{dept.name}</div>
                  <div className="dept-stats">
                    <span>👥 {dept.officers} officers</span>
                    <span>📋 {dept.complaints} complaints</span>
                  </div>
                  <div className="progress-track small">
                    <div
                      className="progress-fill"
                      style={{ width: `${dept.sla}%`, background: dept.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard