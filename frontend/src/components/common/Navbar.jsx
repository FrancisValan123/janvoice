import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      style={{
        background: 'white',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Left: Menu Button + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#f7fafc',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>
        )}

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '28px' }}>🇮🇳</span>
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
        </Link>
      </div>

      {/* Right: Actions + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link
          to="/citizen/notifications"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#f7fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            textDecoration: 'none',
            position: 'relative'
          }}
        >
          🔔
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#FF6B35',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          ></span>
        </Link>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: '#f7fafc',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '14px'
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#1a202c'
              }}
            >
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <span style={{ fontSize: '10px', color: '#718096' }}>▼</span>
          </button>

          {profileOpen && (
            <>
              <div
                onClick={() => setProfileOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 98
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  border: '1px solid #e2e8f0',
                  minWidth: '220px',
                  zIndex: 99,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}
                  >
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    {user?.email}
                  </div>
                </div>

                {[
                  { icon: '👤', label: 'My Profile', path: '/citizen/profile' },
                  { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
                  { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
                  { icon: '⚙️', label: 'Settings', path: '/citizen/profile' }
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 16px',
                      textDecoration: 'none',
                      color: '#4a5568',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f7fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 16px',
                    background: 'none',
                    border: 'none',
                    borderTop: '1px solid #e2e8f0',
                    color: '#c53030',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar