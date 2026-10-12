import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
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

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
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

      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-page-title">{title}</h1>
          <div className="admin-topbar-right">
            <button className="icon-btn" title="Notifications">
              🔔
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn" title="Messages">✉️</button>
            <button className="icon-btn" title="Help">❓</button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout