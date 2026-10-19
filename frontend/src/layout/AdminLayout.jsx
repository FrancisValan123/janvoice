import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

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

  const getInitials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const getPageTitle = () => {
    // Exact match first
    const exact = menuItems.find((item) => item.path === location.pathname)
    if (exact) return exact.label

    // Fallback: startsWith
    const startsWith = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    )
    return startsWith ? startsWith.label : 'Admin'
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-app)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
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

      {/* Sidebar */}
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
          zIndex: 50,
          flexShrink: 0,
          transform:
            window.innerWidth < 768 && !mobileOpen
              ? 'translateX(-100%)'
              : 'translateX(0)'
        }}
      >
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
            to="/admin/dashboard"
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
                  backgroundClip: 'text'
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
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
            }}
          >
            <span style={{ fontSize: '16px' }}>⚙️</span>
            <span>System Admin</span>
          </div>
        )}

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
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
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
                  overflow: 'hidden'
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    flexShrink: 0,
                    width: '24px',
                    textAlign: 'center'
                  }}
                >
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span
                    style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

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
                flexShrink: 0
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
                  {user?.name || 'Admin'}
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
                  System Administrator
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

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        <header
          style={{
            background: 'var(--bg-surface)',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: window.innerWidth < 768 ? 'flex' : 'none',
                width: '40px',
                height: '40px',
                background: 'var(--bg-surface-secondary)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--text-secondary)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ☰
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: window.innerWidth >= 768 ? 'flex' : 'none',
                width: '36px',
                height: '36px',
                background: 'var(--bg-surface-secondary)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>

            <h1
              style={{
                fontSize: '20px',
                fontWeight: '800',
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              {getPageTitle()}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--bg-surface-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                position: 'relative',
                color: 'var(--text-secondary)'
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
                  border: '2px solid var(--bg-surface)'
                }}
              ></span>
            </button>
            <button
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'var(--bg-surface-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'var(--text-secondary)'
              }}
            >
              ❓
            </button>
          </div>
        </header>

        <div
          style={{
            flex: 1,
            padding: window.innerWidth < 768 ? '16px' : '28px',
            overflowX: 'hidden'
          }}
        >
          <Outlet />
        </div>

        <footer
          style={{
            padding: '16px 28px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
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
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span>Admin v1.0.0</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default AdminLayout