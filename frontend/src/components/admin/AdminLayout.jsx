import React, { useState } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '👥', label: 'Users', path: '/admin/users', badge: 1245 },
    { icon: '🏛️', label: 'Departments', path: '/admin/departments' },
    { icon: '📂', label: 'Categories', path: '/admin/categories' },
    { icon: '📋', label: 'Audit Logs', path: '/admin/audit' },
    { icon: '⚙️', label: 'System Settings', path: '/admin/settings' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    const item = menuItems.find((m) => m.path === location.pathname)
    return item ? item.label : 'Admin Panel'
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🇮🇳</span>
            {sidebarOpen && (
              <div className="logo-text-group">
                <span className="logo-text">JanVoice</span>
                <span className="logo-subtitle">Admin Panel</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
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
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {item.badge && sidebarOpen && (
                <span className="nav-badge">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
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
                <div className="user-role">⚙️ System Admin</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div>
              <h1 className="page-title">{getPageTitle()}</h1>
              <p className="page-subtitle">
                Welcome back, {user?.name || 'Admin'}! 👋
              </p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search anything..." />
            </div>

            <button className="icon-btn" title="Notifications">
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="profile-dropdown">
              <button
                className="icon-btn profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </button>

              {profileOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user?.name || 'Admin'}</strong>
                    <small>{user?.email || 'admin@janvoice.gov.in'}</small>
                  </div>
                  <Link to="/admin/settings" className="dropdown-item">
                    ⚙️ Settings
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout