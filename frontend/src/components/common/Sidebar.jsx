import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({
  menuItems = [],
  role = 'citizen',
  collapsed: initialCollapsed = false
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(initialCollapsed)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleLabels = {
    citizen: '👤 Citizen',
    officer: '👨‍💼 Officer',
    department_admin: '🏛️ Dept Admin',
    higher_authority: '⭐ Authority',
    system_admin: '⚙️ Admin'
  }

  return (
    <aside
      style={{
        width: collapsed ? '80px' : '260px',
        background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        height: '100vh',
        position: 'sticky',
        top: 0,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <span style={{ fontSize: '28px', flexShrink: 0 }}>🇮🇳</span>
          {!collapsed && (
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
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '28px',
            height: '28px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            flexShrink: 0
          }}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={i}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '8px',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.75)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px',
                background: isActive
                  ? 'linear-gradient(135deg, #FF6B35, #F7931E)'
                  : 'transparent',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0, width: '24px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        background: isActive ? 'white' : '#FF6B35',
                        color: isActive ? '#FF6B35' : 'white',
                        fontSize: '10px',
                        padding: '2px 7px',
                        borderRadius: '10px',
                        fontWeight: '800'
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

      {/* User */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            marginBottom: '10px'
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
              fontWeight: '700',
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                {roleLabels[role]}
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
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar