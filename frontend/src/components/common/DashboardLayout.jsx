import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './DashboardLayout.css'

const DashboardLayout = ({ children, role, menuItems = [], title = 'Dashboard' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Detect mobile on load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
    setNotificationsOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

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

  const roleBadges = {
    citizen: 'Citizen Portal',
    officer: 'Officer Portal',
    department_admin: 'Department Admin',
    higher_authority: 'Higher Authority',
    system_admin: 'System Admin'
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div className="dl-wrapper">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="dl-overlay"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* ================================
          SIDEBAR
          ================================ */}
      <aside
        className={`dl-sidebar ${sidebarOpen ? 'open' : 'closed'} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Logo */}
        <div className="dl-sidebar-header">
          <Link to="/" className="dl-logo">
            <span className="dl-logo-icon">🇮🇳</span>
            {sidebarOpen && <span className="dl-logo-text">JanVoice</span>}
          </Link>
          <button
            className="dl-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="dl-role-badge">
            <span className="dl-role-icon">{roleLabels[role]?.split(' ')[0]}</span>
            <span className="dl-role-text">{roleBadges[role] || 'User'}</span>
          </div>
        )}

        {/* Navigation */}
        <nav className="dl-nav">
          {menuItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={index}
                to={item.path}
                className={`dl-nav-item ${isActive ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="dl-nav-icon">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="dl-nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="dl-nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="dl-sidebar-footer">
          <div className="dl-user-card">
            <div className="dl-user-avatar">
              {getInitials(user?.name)}
            </div>
            {sidebarOpen && (
              <div className="dl-user-info">
                <div className="dl-user-name">
                  {user?.name || 'User'}
                </div>
                <div className="dl-user-role">
                  {roleLabels[role] || 'User'}
                </div>
              </div>
            )}
          </div>

          <button className="dl-logout-btn" onClick={handleLogout}>
            <span className="dl-logout-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================================
          MAIN CONTENT
          ================================ */}
      <main className="dl-main">
        {/* Top Bar */}
        <header className="dl-topbar">
          {/* Left: Mobile menu + Title */}
          <div className="dl-topbar-left">
            <button
              className="dl-mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>

            <div className="dl-title-block">
              <h1 className="dl-page-title">{title}</h1>
              <div className="dl-breadcrumb">
                <span>Home</span>
                <span className="dl-sep">/</span>
                <span className="dl-current">
                  {title.split(' ').slice(-1)[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions + Profile */}
          <div className="dl-topbar-right">
            {/* Search (hidden on mobile) */}
            <div className="dl-search-wrapper">
              <span className="dl-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                className="dl-search-input"
              />
            </div>

            {/* Notifications */}
            <div className="dl-dropdown-wrapper">
              <button
                className="dl-icon-btn"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileOpen(false)
                }}
                title="Notifications"
              >
                🔔
                <span className="dl-notification-dot"></span>
              </button>

              {notificationsOpen && (
                <div className="dl-dropdown dl-notif-dropdown">
                  <div className="dl-dropdown-header">
                    <span className="dl-dropdown-title">🔔 Notifications</span>
                    <span className="dl-dropdown-badge">3 new</span>
                  </div>
                  <div className="dl-dropdown-body">
                    {[
                      { icon: '✅', title: 'Complaint resolved', msg: 'JV2026002 has been resolved', time: '2 min ago' },
                      { icon: '👤', title: 'Officer assigned', msg: 'Officer Ravi assigned to JV2026004', time: '1 hour ago' },
                      { icon: '🚨', title: 'Emergency acknowledged', msg: 'Your emergency report was received', time: '3 hours ago' }
                    ].map((n, i) => (
                      <div key={i} className="dl-notif-item">
                        <div className="dl-notif-icon">{n.icon}</div>
                        <div className="dl-notif-content">
                          <div className="dl-notif-title">{n.title}</div>
                          <div className="dl-notif-msg">{n.msg}</div>
                          <div className="dl-notif-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={
                      role === 'citizen'
                        ? '/citizen/notifications'
                        : `/${role}/notifications`
                    }
                    className="dl-dropdown-footer"
                  >
                    View All →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="dl-dropdown-wrapper">
              <button
                className="dl-profile-btn"
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNotificationsOpen(false)
                }}
              >
                <div className="dl-profile-avatar">
                  {getInitials(user?.name)}
                </div>
                <div className="dl-profile-info">
                  <span className="dl-profile-name">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="dl-profile-role">
                    {roleBadges[role] || 'User'}
                  </span>
                </div>
                <span className="dl-profile-arrow">
                  {profileOpen ? '▲' : '▼'}
                </span>
              </button>

              {profileOpen && (
                <div className="dl-dropdown dl-profile-dropdown">
                  <div className="dl-dropdown-profile-header">
                    <div className="dl-dropdown-avatar">
                      {getInitials(user?.name)}
                    </div>
                    <div className="dl-dropdown-info">
                      <div className="dl-dropdown-name">
                        {user?.name || 'User'}
                      </div>
                      <div className="dl-dropdown-email">
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>

                  <div className="dl-dropdown-divider"></div>

                  {[
                    { icon: '👤', label: 'My Profile', path: `/${role.replace('_', '-')}/profile` },
                    { icon: '⚙️', label: 'Settings', path: `/${role.replace('_', '-')}/settings` },
                    { icon: '🔒', label: 'Security', path: '/forgot-password' }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      className="dl-dropdown-item"
                    >
                      <span className="dl-dropdown-item-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  <div className="dl-dropdown-divider"></div>

                  <button
                    className="dl-dropdown-item dl-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <span className="dl-dropdown-item-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dl-content">
          {children}
        </div>

        {/* Footer */}
        <footer className="dl-footer">
          <div className="dl-footer-left">
            © {new Date().getFullYear()} JanVoice | Government of India Initiative
          </div>
          <div className="dl-footer-right">
            <span>🇮🇳 Made in India</span>
            <span className="dl-footer-sep">•</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default DashboardLayout