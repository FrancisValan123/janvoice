import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateEmail()) return

    setLoading(true)
    // DEMO MODE: Simulate API call (replace with real API when backend ready)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <div className="forgot-container">
      {/* Left Branding */}
      <div className="forgot-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">JanVoice</h1>
          </div>
          <h2 className="branding-title">Reset Your Password</h2>
          <p className="branding-description">
            Don't worry — we'll help you get back into your account.
            Enter your registered email and we'll send you a reset link.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <h4>Secure Reset</h4>
                <p>Bank-grade encryption</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Instant Delivery</h4>
                <p>Reset link sent in seconds</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Safe & Private</h4>
                <p>We never share your data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="forgot-form-section">
        <div className="forgot-form-container">
          {!success ? (
            <>
              <div className="form-header">
                <div className="icon-circle">🔑</div>
                <h2>Forgot Password?</h2>
                <p>Enter your email to receive a reset link</p>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <span>{error}</span>
                  <button className="alert-close" onClick={() => setError('')}>
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-form" noValidate>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className={`input-wrapper ${error ? 'error' : ''}`}>
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder="your.email@example.com"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <span className="arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon">✅</div>
              <h2>Check Your Email</h2>
              <p>
                We've sent a password reset link to <br />
                <strong>{email}</strong>
              </p>
              <p className="success-hint">
                Didn't receive it? Check your spam folder or{' '}
                <button
                  className="link-btn"
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="back-section">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>

          <div className="help-section">
            <p>
              🆘 Need help? <a href="tel:1800-XXX-XXXX">Call 1800-XXX-XXXX</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword