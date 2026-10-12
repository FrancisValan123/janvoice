import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8D6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '140px', fontWeight: '900', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, letterSpacing: '-5px', marginBottom: '20px' }}>
          404
        </div>

        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1a202c', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Page Not Found
        </h1>

        <p style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.7', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ padding: '14px 28px', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Go Back
          </button>
          <Link
            to="/"
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '12px', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}
          >
            🏠 Go Home
          </Link>
        </div>

        <div style={{ marginTop: '48px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'inline-block' }}>
          <div style={{ fontSize: '12px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Looking for something?
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700', textDecoration: 'none' }}>Register</Link>
            <Link to="/faq" style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700', textDecoration: 'none' }}>FAQ</Link>
            <Link to="/contact" style={{ fontSize: '13px', color: '#FF6B35', fontWeight: '700', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound