import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Unauthorized = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleRedirect = {
    citizen: '/citizen/dashboard',
    officer: '/officer/dashboard',
    department_admin: '/department/dashboard',
    higher_authority: '/authority/dashboard',
    system_admin: '/admin/dashboard'
  }

  const dashboardPath = user ? roleRedirect[user.role] || '/' : '/'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '100px', marginBottom: '20px' }}>🚫</div>

        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#742A2A', marginBottom: '12px', letterSpacing: '-1px' }}>
          Access Denied
        </h1>

        <p style={{ fontSize: '16px', color: '#9B2C2C', lineHeight: '1.7', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
          You don't have permission to access this page. This area is restricted to specific user roles.
        </p>

        {user && (
          <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Current Account
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  Role: {user.role?.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={dashboardPath}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}
          >
            📊 Go to My Dashboard
          </Link>
          <button
            onClick={handleLogout}
            style={{ padding: '14px 28px', background: 'white', color: '#c53030', border: '2px solid #FEB2B2', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            🚪 Logout
          </button>
        </div>

        <div style={{ marginTop: '32px', fontSize: '13px', color: '#742A2A' }}>
          Need help? <Link to="/contact" style={{ color: '#C53030', fontWeight: '700' }}>Contact support</Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized