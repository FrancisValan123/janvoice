import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen',
    rememberMe: false
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const remembered = localStorage.getItem('janvoice_remember')
    if (remembered) {
      setFormData((prev) => ({ ...prev, email: remembered, rememberMe: true }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
    setServerError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      if (result.success) {
        if (formData.rememberMe) {
          localStorage.setItem('janvoice_remember', formData.email)
        }

        const roleRoutes = {
          citizen: '/citizen/dashboard',
          officer: '/officer/dashboard',
          department_admin: '/department/dashboard',
          higher_authority: '/authority/dashboard',
          system_admin: '/admin/dashboard'
        }

        navigate(roleRoutes[formData.role] || '/dashboard')
      } else {
        setServerError(result.message || 'Invalid credentials')
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">JanVoice</h1>
          </div>
          <h2 className="branding-title">
            Your Voice, <br />
            Our Action
          </h2>
          <p className="branding-description">
            National Public Complaint & Action Platform. Report civic issues,
            track resolutions, and build a better India together.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">📢</span>
              <div>
                <h4>Voice Your Concern</h4>
                <p>Submit complaints with evidence</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <div>
                <h4>Track in Real-Time</h4>
                <p>Monitor complaint status live</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Priority Handling</h4>
                <p>Emergency complaints get instant attention</p>
              </div>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="form-header">
            <h2>Welcome Back 👋</h2>
            <p>Login to your JanVoice account</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${formData.role === 'citizen' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'citizen' })}
            >
              👤 Citizen
            </button>
            <button
              type="button"
              className={`role-tab ${formData.role === 'officer' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'officer' })}
            >
              👨‍💼 Officer
            </button>
            <button
              type="button"
              className={`role-tab ${formData.role === 'system_admin' ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'system_admin' })}
            >
              ⚙️ Admin
            </button>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{serverError}</span>
              <button
                className="alert-close"
                onClick={() => setServerError('')}
              >
                ×
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login to JanVoice
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="register-section">
            <p>Don't have an account?</p>
            <Link to="/register" className="btn-register">
              Create New Account
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

export default Login