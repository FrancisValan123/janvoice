import React from 'react'
import { Outlet, Link } from 'react-router-dom'

/**
 * AuthLayout - Wrapper for authentication pages
 * Used for: Login, Register, Forgot Password, Reset Password, OTP
 * No sidebar, centered form layout
 */
const AuthLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f7fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Top Bar - Minimal */}
      <header
        style={{
          padding: '16px 40px',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
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
              fontSize: '22px',
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

        <Link
          to="/"
          style={{
            padding: '10px 20px',
            color: '#4a5568',
            fontWeight: '700',
            fontSize: '13px',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}
        >
          ← Back to Home
        </Link>
      </header>

      {/* Auth Pages Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Outlet />
      </main>

      {/* Bottom Footer */}
      <footer
        style={{
          padding: '16px 40px',
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          fontSize: '12px',
          color: '#718096'
        }}
      >
        © 2026 JanVoice | Government of India Initiative
      </footer>
    </div>
  )
}

export default AuthLayout