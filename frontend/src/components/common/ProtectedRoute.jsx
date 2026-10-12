import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking auth
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f7fa'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#FF6B35',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        ></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Not authenticated → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          background: '#f5f7fa',
          padding: '20px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      >
        <div style={{ fontSize: '80px' }}>🚫</div>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#1a202c',
            margin: 0
          }}
        >
          Access Denied
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#718096',
            textAlign: 'center',
            maxWidth: '420px',
            lineHeight: '1.6',
            margin: 0
          }}
        >
          You don't have permission to access this page. This area is restricted to{' '}
          <strong>{allowedRoles.join(', ')}</strong>.
        </p>
        <button
          onClick={() => (window.location.href = '/login')}
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
          }}
        >
          🔙 Back to Login
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute