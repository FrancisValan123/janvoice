import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    agreeTerms: false
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms'
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      })

      if (result.success) {
        navigate('/citizen/dashboard')
      } else {
        setServerError(result.message || 'Registration failed')
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">JanVoice</h1>
          </div>
          <h2 className="branding-title">Join the Movement</h2>
          <p className="branding-description">
            Be part of a transparent, accountable governance system. Your voice
            matters.
          </p>
        </div>
        <div className="branding-footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>

      <div className="register-form-section">
        <div className="register-form-container">
          <div className="form-header">
            <h2>Create Account 🎉</h2>
            <p>Register to start using JanVoice</p>
          </div>

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

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

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
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Mobile Number (Optional)</label>
              <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  disabled={loading}
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
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
                  placeholder="Minimum 6 characters"
                  disabled={loading}
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
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div
                className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}
              >
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Register As</label>
              <div className="role-tabs">
                <button
                  type="button"
                  className={`role-tab ${
                    formData.role === 'citizen' ? 'active' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, role: 'citizen' })}
                >
                  👤 Citizen
                </button>
                <button
                  type="button"
                  className={`role-tab ${
                    formData.role === 'officer' ? 'active' : ''
                  }`}
                  onClick={() => setFormData({ ...formData, role: 'officer' })}
                >
                  👨‍💼 Officer
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="inline-link">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="inline-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="error-message">{errors.agreeTerms}</span>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-section">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register