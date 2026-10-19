import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './DashboardLayout.css'

const DashboardLayout = ({ children, role, menuItems = [], title = 'Dashboard' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  
  const [notifications, setNotifications] = useState([])

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

  // Fetch real notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications')
        const raw = res.data?.notifications || res.data?.data || []
        setNotifications(Array.isArray(raw) ? raw : [])
      } catch (err) {
        setNotifications([])
      }
    }
    fetchNotifications()
  }, [])

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

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  // ✅ Hardcoded paths to prevent 404s
  const getProfilePath = () => {
    if (role === 'citizen') return '/citizen/profile'
    if (role === 'department_admin') return '/department/profile'
    if (role === 'higher_authority') return '/authority/profile'
    if (role === 'system_admin') return '/admin/profile'
    if (role === 'officer') return '/officer/profile'
    return '/'
  }

  const getSettingsPath = () => {
    if (role === 'citizen') return '/citizen/profile'
    if (role === 'department_admin') return '/department/settings'
    if (role === 'higher_authority') return '/authority/settings'
    if (role === 'system_admin') return '/admin/settings'
    if (role === 'officer') return '/officer/dashboard'
    return '/'
  }

  const getNotificationsPath = () => {
    if (role === 'citizen') return '/citizen/notifications'
    if (role === 'department_admin') return '/department/notifications'
    if (role === 'higher_authority') return '/authority/notifications'
    if (role === 'system_admin') return '/admin/notifications'
    if (role === 'officer') return '/officer/notifications'
    return '/'
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

      {/* SIDEBAR */}
      <aside
        className={`dl-sidebar ${sidebarOpen ? 'open' : 'closed'} ${
          mobileOpen ? 'mobile-open' : ''
        }`}
      >
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

        {sidebarOpen && (
          <div className="dl-role-badge">
            <span className="dl-role-icon">{roleLabels[role]?.split(' ')[0]}</span>
            <span className="dl-role-text">{roleBadges[role] || 'User'}</span>
          </div>
        )}

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

      {/* MAIN CONTENT */}
      <main className="dl-main">
        <header className="dl-topbar">
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

          <div className="dl-topbar-right">
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
                {unreadCount > 0 && (
                  <span className="dl-notification-dot"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="dl-dropdown dl-notif-dropdown">
                  <div className="dl-dropdown-header">
                    <span className="dl-dropdown-title">🔔 Notifications</span>
                    {unreadCount > 0 && (
                      <span className="dl-dropdown-badge">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="dl-dropdown-body">
                    {notifications.length === 0 ? (
                      <div
                        style={{
                          padding: '32px 20px',
                          textAlign: 'center',
                          color: 'var(--text-tertiary)'
                        }}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                          📭
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: '4px'
                          }}
                        >
                          No notifications yet
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>
                          You're all caught up!
                        </div>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n, i) => (
                        <div key={n._id || i} className="dl-notif-item">
                          <div className="dl-notif-icon">
                            {n.icon || '🔔'}
                          </div>
                          <div className="dl-notif-content">
                            <div className="dl-notif-title">
                              {n.title || 'Notification'}
                            </div>
                            <div className="dl-notif-msg">
                              {n.message || ''}
                            </div>
                            <div className="dl-notif-time">
                              {n.time || ''}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    to={getNotificationsPath()}
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
                    { icon: '👤', label: 'My Profile', path: getProfilePath() },
                    { icon: '⚙️', label: 'Settings', path: getSettingsPath() },
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

        <div className="dl-content">
          {children}
        </div>

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