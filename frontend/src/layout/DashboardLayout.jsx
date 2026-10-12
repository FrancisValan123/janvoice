import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * DashboardLayout - Main layout for all role dashboards
 * Used for: Citizen, Officer, Department, Authority dashboards
 * Features: Collapsible sidebar, top bar, dropdowns, responsive
 */
const DashboardLayout = ({ role, menuItems = [], title = 'Dashboard' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Responsive sidebar
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

  // Close overlays on route change
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

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f5f7fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45
          }}
        ></div>
      )}

      {/* ================================
          SIDEBAR
          ================================ */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '80px',
          background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease, transform 0.3s ease',
          position: window.innerWidth < 768 ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 50,
          flexShrink: 0,
          transform:
            window.innerWidth < 768 && !mobileOpen
              ? 'translateX(-100%)'
              : 'translateX(0)'
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: 'white',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '28px', flexShrink: 0 }}>🇮🇳</span>
            {sidebarOpen && (
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px'
                }}
              >
                JanVoice
              </span>
            )}
          </Link>
          {sidebarOpen && window.innerWidth >= 768 && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '10px',
                flexShrink: 0
              }}
            >
              ◀
            </button>
          )}
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div
            style={{
              margin: '14px 16px 0',
              padding: '10px 14px',
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: '800',
              color: 'white',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            <span style={{ fontSize: '16px', flexShrink: 0 }}>
              {roleLabels[role]?.split(' ')[0]}
            </span>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: '0.3px'
              }}
            >
              {roleBadges[role] || 'User'}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            overflowY: 'auto'
          }}
        >
          {menuItems.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={index}
                to={item.path}
                title={!sidebarOpen ? item.label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? '700' : '500',
                  background: isActive
                    ? 'linear-gradient(135deg, #FF6B35, #F7931E)'
                    : 'transparent',
                  boxShadow: isActive
                    ? '0 4px 12px rgba(255, 107, 53, 0.35)'
                    : 'none',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    flexShrink: 0,
                    width: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <>
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          background: isActive
                            ? 'rgba(255, 255, 255, 0.3)'
                            : '#FF6B35',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          flexShrink: 0
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Card + Logout */}
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexShrink: 0
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '14px',
                flexShrink: 0,
                letterSpacing: '0.5px'
              }}
            >
              {getInitials(user?.name)}
            </div>
            {sidebarOpen && (
              <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: 'white',
                    marginBottom: '2px'
                  }}
                >
                  {user?.name || 'User'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {roleLabels[role] || 'User'}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              background: 'rgba(255, 107, 53, 0.15)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              color: '#FF6B35',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'inherit'
            }}
          >
            <span style={{ fontSize: '15px' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================================
          MAIN CONTENT
          ================================ */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            background: 'white',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flex: 1,
              minWidth: 0
            }}
          >
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: window.innerWidth < 768 ? 'flex' : 'none',
                width: '40px',
                height: '40px',
                background: '#f7fafc',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#4a5568',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ☰
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: window.innerWidth >= 768 ? 'flex' : 'none',
                width: '36px',
                height: '36px',
                background: '#f7fafc',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#4a5568',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>

            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#1a202c',
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}
          >
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileOpen(false)
                }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#f7fafc',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🔔
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    background: '#FF6B35',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }}
                ></span>
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '340px',
                    maxWidth: 'calc(100vw - 32px)',
                    background: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '14px 18px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#fafbfc'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: '#1a202c'
                      }}
                    >
                      🔔 Notifications
                    </span>
                    <span
                      style={{
                        padding: '3px 9px',
                        background: '#FF6B35',
                        color: 'white',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '800'
                      }}
                    >
                      3 new
                    </span>
                  </div>

                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {[
                      {
                        icon: '✅',
                        color: '#38A169',
                        title: 'Complaint resolved',
                        msg: 'JV2026002 has been resolved',
                        time: '2 min ago'
                      },
                      {
                        icon: '👤',
                        color: '#805AD5',
                        title: 'Officer assigned',
                        msg: 'Officer Ravi assigned to JV2026004',
                        time: '1 hour ago'
                      },
                      {
                        icon: '🚨',
                        color: '#E53E3E',
                        title: 'Emergency acknowledged',
                        msg: 'Your emergency report was received',
                        time: '3 hours ago'
                      }
                    ].map((n, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px 18px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            background: n.color + '20',
                            color: n.color,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            flexShrink: 0
                          }}
                        >
                          {n.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#1a202c',
                              marginBottom: '3px'
                            }}
                          >
                            {n.title}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#718096',
                              marginBottom: '3px'
                            }}
                          >
                            {n.msg}
                          </div>
                          <div
                            style={{ fontSize: '10px', color: '#a0aec0' }}
                          >
                            {n.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={
                      role === 'citizen'
                        ? '/citizen/notifications'
                        : `/${role.replace('_', '-')}/notifications`
                    }
                    onClick={() => setNotificationsOpen(false)}
                    style={{
                      display: 'block',
                      padding: '13px 18px',
                      background: '#fafbfc',
                      borderTop: '1px solid #e2e8f0',
                      textAlign: 'center',
                      color: '#FF6B35',
                      fontSize: '12px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    View All Notifications →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNotificationsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '5px 12px 5px 5px',
                  background: '#f7fafc',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {getInitials(user?.name)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    lineHeight: 1.2
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#1a202c',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#718096',
                      fontWeight: '600'
                    }}
                  >
                    {roleBadges[role] || 'User'}
                  </span>
                </div>
                <span style={{ fontSize: '9px', color: '#a0aec0' }}>▼</span>
              </button>

              {profileOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '280px',
                    maxWidth: 'calc(100vw - 32px)',
                    background: 'white',
                    borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e2e8f0',
                    zIndex: 100,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background:
                        'linear-gradient(135deg, #FFF5F0 0%, #FFE8D6 100%)'
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '16px',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                      }}
                    >
                      {getInitials(user?.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '800',
                          color: '#1a202c',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '3px'
                        }}
                      >
                        {user?.name || 'User'}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#718096',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {user?.email || 'user@example.com'}
                      </div>
                    </div>
                  </div>

                  <div style={{ height: '1px', background: '#e2e8f0' }}></div>

                  {[
                    {
                      icon: '👤',
                      label: 'My Profile',
                      path: `/${role.replace('_', '-')}/profile`
                    },
                    {
                      icon: '⚙️',
                      label: 'Settings',
                      path: `/${role.replace('_', '-')}/settings`
                    },
                    { icon: '🔒', label: 'Security', path: '/forgot-password' }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setProfileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '11px 18px',
                        color: '#4a5568',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '15px',
                          width: '20px',
                          textAlign: 'center'
                        }}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ height: '1px', background: '#e2e8f0' }}></div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 18px',
                      background: 'none',
                      border: 'none',
                      color: '#c53030',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        width: '20px',
                        textAlign: 'center'
                      }}
                    >
                      🚪
                    </span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            padding: window.innerWidth < 768 ? '16px' : '28px',
            overflowX: 'hidden'
          }}
        >
          <Outlet />
        </div>

        {/* Footer */}
        <footer
          style={{
            padding: window.innerWidth < 768 ? '12px 16px' : '16px 28px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '12px',
            color: '#718096',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontWeight: '600' }}>
            © {new Date().getFullYear()} JanVoice | Government of India Initiative
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '600'
            }}
          >
            <span>🇮🇳 Made in India</span>
            <span style={{ color: '#cbd5e0' }}>•</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default DashboardLayout