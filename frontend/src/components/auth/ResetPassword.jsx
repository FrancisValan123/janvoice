import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './ResetPassword.css'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState('')

  // Check token on mount
  useEffect(() => {
    if (!token) {
      setTokenError('Invalid or missing reset token')
      return
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify-reset-token/${token}`
        )
        const data = await res.json()
        if (!data.success) {
          setTokenError(data.message || 'Invalid or expired token')
        }
      } catch (err) {
        console.warn('Token verification skipped (backend not reachable)')
      }
    }
    verifyToken()
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain letters and numbers'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    try {
      const res = await fetch(
        'http://localhost:5000/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            newPassword: formData.password
          })
        }
      )

      const data = await res.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setErrors({ general: data.message || 'Reset failed' })
      }
    } catch (err) {
      setErrors({ general: 'Cannot connect to server' })
    } finally {
      setLoading(false)
    }
  }

  // Invalid token view
  if (tokenError) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Invalid Reset Link</h2>
            <p>{tokenError}</p>
            <Link to="/forgot-password" className="btn-primary">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success view
  if (success) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Password Reset Successful!</h2>
            <p>Your password has been changed.</p>
            <p className="hint">Redirecting to login...</p>
            <Link to="/login" className="btn-primary">
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Reset form view
  return (
    <div className="reset-container">
      {/* Left Branding */}
      <div className="reset-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">JanVoice</h1>
          </div>
          <h2 className="branding-title">Create New Password</h2>
          <p className="branding-description">
            Choose a strong password to secure your JanVoice account.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <h4>Strong Password</h4>
                <p>At least 6 characters with letters and numbers</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Encrypted Storage</h4>
                <p>Your password is securely hashed</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <div>
                <h4>Quick Access</h4>
                <p>Login immediately after reset</p>
              </div>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="reset-form-section">
        <div className="reset-form-container">
          <div className="form-header">
            <div className="icon-circle">🔑</div>
            <h2>Reset Password</h2>
            <p>Enter your new password below</p>
          </div>

          {errors.general && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-form" noValidate>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="password-hint">
              <strong>Password Requirements:</strong>
              <ul>
                <li className={formData.password.length >= 6 ? 'met' : ''}>
                  ✓ At least 6 characters
                </li>
                <li className={/(?=.*[a-zA-Z])/.test(formData.password) ? 'met' : ''}>
                  ✓ Contains letters
                </li>
                <li className={/(?=.*\d)/.test(formData.password) ? 'met' : ''}>
                  ✓ Contains numbers
                </li>
              </ul>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="back-section">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword