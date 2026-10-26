import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login, completeTwoFALogin } = useAuth()

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

  // ✅ 2FA state
  const [twoFAState, setTwoFAState] = useState({
    required: false,
    userId: '',
    email: ''
  })
  const [twoFACode, setTwoFACode] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)

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

  // ===================================
  // STEP 1: LOGIN (email + password)
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')

    const currentEmail = emailInput ? emailInput.value : formData.email
    const currentPassword = passwordInput ? passwordInput.value : formData.password

    if (currentEmail !== formData.email || currentPassword !== formData.password) {
      setFormData((prev) => ({
        ...prev,
        email: currentEmail,
        password: currentPassword
      }))
    }

    const newErrors = {}
    if (!currentEmail || !currentEmail.trim()) newErrors.email = 'Email is required'
    if (!currentPassword) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const result = await login({
        email: currentEmail,
        password: currentPassword,
        role: formData.role // ✅ Passes the selected role
      })

      // ✅ If backend says 2FA is required, switch to code input
      if (result.success && result.requiresTwoFA) {
        setTwoFAState({
          required: true,
          userId: result.userId,
          email: result.email
        })
        setLoading(false)
        return
      }

      if (result.success) {
        if (formData.rememberMe) {
          localStorage.setItem('janvoice_remember', currentEmail)
        }

        const actualRole = result.user?.role || formData.role
        const roleRoutes = {
          citizen: '/citizen/dashboard',
          officer: '/officer/dashboard',
          department_admin: '/department/dashboard',
          higher_authority: '/authority/dashboard',
          system_admin: '/admin/dashboard'
        }
        navigate(roleRoutes[actualRole] || '/dashboard')
      } else {
        // ✅ This will now display the "Access denied..." message from the backend
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

  // ===================================
  // STEP 2: VERIFY 2FA CODE
  // ===================================
  const handleVerifyTwoFA = async (e) => {
    e.preventDefault()
    if (!twoFACode.trim()) return

    setLoading(true)
    setServerError('')

    try {
      const result = await completeTwoFALogin({
        userId: twoFAState.userId,
        token: useBackupCode ? undefined : twoFACode.trim(),
        backupCode: useBackupCode ? twoFACode.trim() : undefined
      })

      if (result.success) {
        const actualRole = result.user?.role || 'citizen'
        const roleRoutes = {
          citizen: '/citizen/dashboard',
          officer: '/officer/dashboard',
          department_admin: '/department/dashboard',
          higher_authority: '/authority/dashboard',
          system_admin: '/admin/dashboard'
        }
        navigate(roleRoutes[actualRole] || '/dashboard')
      } else {
        setServerError(result.message || 'Invalid 2FA code')
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Verification failed. Try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const cancelTwoFA = () => {
    setTwoFAState({ required: false, userId: '', email: '' })
    setTwoFACode('')
    setUseBackupCode(false)
    setServerError('')
  }

  const roles = [
    { id: 'citizen', label: 'Citizen', icon: '👤' },
    { id: 'officer', label: 'Officer', icon: '👨‍💼' },
    { id: 'department_admin', label: 'Dept Admin', icon: '🏛️' },
    { id: 'higher_authority', label: 'Authority', icon: '⭐' },
    { id: 'system_admin', label: 'Admin', icon: '⚙️' }
  ]

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
            <h2>
              {twoFAState.required ? 'Two-Factor Authentication 🔐' : 'Welcome Back 👋'}
            </h2>
            <p>
              {twoFAState.required
                ? `Enter the code for ${twoFAState.email}`
                : 'Login to your JanVoice account'}
            </p>
          </div>

          {/* Role tabs — hidden during 2FA step */}
          {!twoFAState.required && (
            <div className="role-tabs role-tabs-five">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`role-tab ${formData.role === r.id ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: r.id })}
                  title={r.label}
                >
                  <span className="role-tab-icon">{r.icon}</span>
                  <span className="role-tab-label">{r.label}</span>
                </button>
              ))}
            </div>
          )}

          {serverError && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{serverError}</span>
              <button className="alert-close" onClick={() => setServerError('')}>
                ×
              </button>
            </div>
          )}

          {/* ============ STEP 1: EMAIL + PASSWORD ============ */}
          {!twoFAState.required && (
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
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
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
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
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
          )}

          {/* ============ STEP 2: 2FA CODE ============ */}
          {twoFAState.required && (
            <form onSubmit={handleVerifyTwoFA} className="login-form" noValidate>
              <div
                style={{
                  background: '#FEFCBF',
                  border: '1px solid #ECC94B',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  color: '#744210'
                }}
              >
                📱 Open <strong>Google Authenticator</strong> and enter the
                6-digit code shown for JanVoice.
              </div>

              <div className="form-group">
                <label>
                  {useBackupCode
                    ? 'Enter a backup code'
                    : 'Enter 6-digit code'}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) =>
                      setTwoFACode(
                        useBackupCode
                          ? e.target.value.toUpperCase().slice(0, 12)
                          : e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    placeholder={useBackupCode ? 'ABCD1234' : '000000'}
                    maxLength={useBackupCode ? 12 : 6}
                    autoFocus
                    disabled={loading}
                    style={{
                      fontFamily: 'monospace',
                      letterSpacing: useBackupCode ? '2px' : '8px',
                      textAlign: 'center',
                      fontSize: '18px'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={loading || !twoFACode.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <span className="arrow">→</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode)
                  setTwoFACode('')
                  setServerError('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3182CE',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '13px',
                  padding: '8px',
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                {useBackupCode
                  ? 'Use authenticator code instead'
                  : 'Use a backup code instead'}
              </button>

              <button
                type="button"
                onClick={cancelTwoFA}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '8px',
                  width: '100%'
                }}
              >
                ← Back to login
              </button>
            </form>
          )}

          {!twoFAState.required && (
            <>
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
                  🆘 Need help?{' '}
                  <a href="tel:1800-XXX-XXXX">Call 1800-XXX-XXXX</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login