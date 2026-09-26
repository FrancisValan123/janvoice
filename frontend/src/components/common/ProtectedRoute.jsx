import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontSize: '18px',
          color: '#FF6B35',
          fontWeight: '600'
        }}
      >
        Loading...
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but wrong role → redirect to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes = {
      citizen: '/citizen/dashboard',
      officer: '/officer/dashboard',
      department_admin: '/department/dashboard',
      higher_authority: '/authority/dashboard',
      system_admin: '/admin/dashboard'
    }
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />
  }

  // Authorized!
  return children
}

export default ProtectedRoute