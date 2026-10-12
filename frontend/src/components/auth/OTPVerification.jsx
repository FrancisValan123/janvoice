import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './OTPVerification.css'

const OTPVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'your email'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pasted)) return

    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''))
    setOtp(newOtp)

    const lastIndex = Math.min(pasted.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    // DEMO MODE: Accept any 6-digit OTP
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }, 1200)
  }

  const handleResend = () => {
    if (!canResend) return
    setResendTimer(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    alert('New OTP has been sent to your email')
  }

  if (success) {
    return (
      <div className="otp-container">
        <div className="otp-card">
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Verification Successful!</h2>
            <p>Your email has been verified.</p>
            <p className="success-hint">Redirecting to login...</p>
            <Link to="/login" className="btn-primary">
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="otp-container">
      {/* Left Branding */}
      <div className="otp-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">🇮🇳</div>
            <h1 className="logo-text">JanVoice</h1>
          </div>
          <h2 className="branding-title">Verify Your Email</h2>
          <p className="branding-description">
            Enter the 6-digit code we sent to your email to complete the
            verification.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <div>
                <h4>Secure Verification</h4>
                <p>Your data is protected</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <h4>Quick Process</h4>
                <p>Takes only a few seconds</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📧</span>
              <div>
                <h4>Email Verified</h4>
                <p>Confirms your identity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 JanVoice | Government of India Initiative</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="otp-form-section">
        <div className="otp-form-container">
          <div className="form-header">
            <div className="icon-circle">📧</div>
            <h2>Enter OTP</h2>
            <p>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="otp-input"
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="resend-section">
            {canResend ? (
              <button className="link-btn" onClick={handleResend}>
                Didn't receive the code? Resend
              </button>
            ) : (
              <p className="resend-timer">
                Resend code in <strong>{resendTimer}s</strong>
              </p>
            )}
          </div>

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

export default OTPVerification