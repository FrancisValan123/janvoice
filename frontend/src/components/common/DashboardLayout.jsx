import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DashboardLayout.css'

const DashboardLayout = ({ children, role, menuItems, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabels = {
    citizen: '👤 Citizen',
    officer: '👨‍💼 Officer',
    department_admin: '🏛️ Dept Admin',
    higher_authority: '⭐ Higher Authority',
    system_admin: '⚙️ System Admin'
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
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

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-name">{user?.name || 'User'}</div>
                <div className="user-role">{roleLabels[role]}</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="top-bar-right">
            <button className="icon-btn" title="Notifications">
              🔔
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn" title="Messages">✉️</button>
            <button className="icon-btn" title="Settings">⚙️</button>
          </div>
        </header>

        <div className="content-area">{children}</div>
      </main>
    </div>
  )
}

export default DashboardLayout