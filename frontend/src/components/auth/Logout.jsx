import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Logout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    // Clear session
    logout()

    // Redirect after short delay
    const timer = setTimeout(() => {
      navigate('/login', { replace: true })
    }, 800)

    return () => clearTimeout(timer)
  }, [logout, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        color: 'white',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        gap: '20px'
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      >
        👋
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>
        Logging you out...
      </h2>

      <p style={{ opacity: 0.9, fontSize: '14px', margin: 0 }}>
        Thank you for using JanVoice
      </p>

      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginTop: '10px'
        }}
      ></div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  )
}

export default Logout