import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [activeTab, setActiveTab] = useState('info')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // ✅ Preferences state (loaded from localStorage)
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('janvoice_preferences')
    return saved
      ? JSON.parse(saved)
      : {
          language: 'en',
          theme: 'light',
          emailNotifications: true,
          smsNotifications: false,
          complaintUpdates: true
        }
  })

  // ✅ Real 2FA state
  const [showTwoFA, setShowTwoFA] = useState(false)
  const [showSessions, setShowSessions] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false)
  const [qrCode, setQrCode] = useState('')
  const [twoFACode, setTwoFACode] = useState('')
  const [twoFALoading, setTwoFALoading] = useState(false)
  const [twoFAError, setTwoFAError] = useState('')
  const [backupCodes, setBackupCodes] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhar: ''
  })

  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolved: 0,
    pending: 0,
    emergency: 0,
    avgRating: 0
  })

  const [activities, setActivities] = useState([])

  // ===================================
  // APPLY THEME WHENEVER IT CHANGES
  // ===================================
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.classList.add('dark-mode')
        body.classList.add('dark-mode')
      } else if (theme === 'light') {
        root.classList.remove('dark-mode')
        body.classList.remove('dark-mode')
      } else {
        // auto — follow system
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark-mode', isDark)
        body.classList.toggle('dark-mode', isDark)
      }
    }

    applyTheme(preferences.theme)

    // If "auto", listen for OS theme changes
    if (preferences.theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (e) => {
        root.classList.toggle('dark-mode', e.matches)
        body.classList.toggle('dark-mode', e.matches)
      }
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
  }, [preferences.theme])

  // ===================================
  // SYNC USER DATA + FETCH STATS
  // ===================================
  useEffect(() => {
    if (user) {
      setTwoFAEnabled(user.twoFactorEnabled || false)
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || user.address || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        aadhar: user.aadhar || ''
      })
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/complaints/my')
        const rawData =
          response.data?.data ||
          response.data?.complaints ||
          (Array.isArray(response.data) ? response.data : [])

        const total = rawData.length
        const resolved = rawData.filter((c) => c.status === 'resolved').length
        const pending = rawData.filter((c) =>
          ['pending', 'assigned', 'investigating', 'in-progress'].includes(c.status)
        ).length
        const emergency = rawData.filter(
          (c) => c.priority === 'emergency' && c.status !== 'resolved'
        ).length

        const ratedComplaints = rawData.filter((c) => c.feedback?.rating)
        const avgRating = ratedComplaints.length
          ? (
              ratedComplaints.reduce((sum, c) => sum + c.feedback.rating, 0) /
              ratedComplaints.length
            ).toFixed(1)
          : 0

        setStats({
          totalComplaints: total,
          resolved,
          pending,
          emergency,
          avgRating
        })

        const sorted = [...rawData].sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        )
        const recent = sorted.slice(0, 5).map((c) => {
          const iconMap = {
            resolved: '✅',
            'in-progress': '🚧',
            assigned: '👤',
            investigating: '🔍',
            pending: '⏳',
            escalated: '🚨',
            rejected: '❌'
          }
          const colorMap = {
            resolved: '#38A169',
            'in-progress': '#3182CE',
            assigned: '#805AD5',
            investigating: '#805AD5',
            pending: '#ED8936',
            escalated: '#E53E3E',
            rejected: '#E53E3E'
          }
          const labelMap = {
            resolved: 'Complaint Resolved',
            'in-progress': 'Complaint In Progress',
            assigned: 'Officer Assigned',
            investigating: 'Under Investigation',
            pending: 'New Complaint Submitted',
            escalated: 'Complaint Escalated',
            rejected: 'Complaint Rejected'
          }
          const timeAgo = (dateStr) => {
            if (!dateStr) return ''
            const diff = Date.now() - new Date(dateStr).getTime()
            const mins = Math.floor(diff / 60000)
            const hours = Math.floor(mins / 60)
            const days = Math.floor(hours / 24)
            if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
            if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
            if (mins > 0) return `${mins} min ago`
            return 'Just now'
          }
          return {
            icon: iconMap[c.status] || '📋',
            title: labelMap[c.status] || 'Complaint Update',
            desc: `${c.complaintId || c._id} - ${c.title || 'Untitled'}`,
            time: timeAgo(c.updatedAt || c.createdAt),
            color: colorMap[c.status] || '#4A5568'
          }
        })
        setActivities(recent)
      } catch (err) {
        console.error('Failed to load profile stats:', err)
      }
    }

    fetchStats()
  }, [user])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ===================================
  // UPDATE PREFERENCE
  // ===================================
  const updatePreference = (key, value) => {
    const next = { ...preferences, [key]: value }
    setPreferences(next)
    localStorage.setItem('janvoice_preferences', JSON.stringify(next))
    // Also save theme separately for main.jsx to read on load
    if (key === 'theme') {
      localStorage.setItem('janvoice_theme', value)
    }
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  // ===================================
  // 2FA — LOAD QR CODE
  // ===================================
  const loadTwoFAQr = async () => {
    setTwoFALoading(true)
    setTwoFAError('')
    setQrCode('')
    setTwoFACode('')
    setBackupCodes([])

    try {
      const response = await api.get('/auth/2fa/setup')
      if (response.data?.qrCode) {
        setQrCode(response.data.qrCode)
      } else {
        setTwoFAError('Failed to load QR code')
      }
    } catch (err) {
      console.error('Load 2FA QR error:', err)
      setTwoFAError(err.response?.data?.message || 'Failed to load QR code')
    } finally {
      setTwoFALoading(false)
    }
  }

  // ===================================
  // 2FA — VERIFY AND ENABLE
  // ===================================
  const verifyAndEnableTwoFA = async () => {
    if (!twoFACode || twoFACode.length !== 6) {
      setTwoFAError('Please enter the 6-digit code from Google Authenticator')
      return
    }

    setTwoFALoading(true)
    setTwoFAError('')

    try {
      const response = await api.post('/auth/2fa/verify', { token: twoFACode })

      if (response.data?.success) {
        setTwoFAEnabled(true)
        if (response.data.backupCodes) {
          setBackupCodes(response.data.backupCodes)
        }
        if (setUser && user) {
          setUser({ ...user, twoFactorEnabled: true })
        }
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setTwoFAError(response.data?.message || 'Verification failed')
      }
    } catch (err) {
      console.error('Verify 2FA error:', err)
      setTwoFAError(
        err.response?.data?.message || 'Invalid code. Please try again.'
      )
    } finally {
      setTwoFALoading(false)
    }
  }

  // ===================================
  // 2FA — DISABLE
  // ===================================
  const disableTwoFA = async () => {
    if (
      !window.confirm(
        'Are you sure you want to disable 2FA? This will make your account less secure.'
      )
    ) {
      return
    }

    setTwoFALoading(true)
    setTwoFAError('')

    try {
      const response = await api.post('/auth/2fa/disable')
      if (response.data?.success) {
        setTwoFAEnabled(false)
        setQrCode('')
        setTwoFACode('')
        setBackupCodes([])
        if (setUser && user) {
          setUser({ ...user, twoFactorEnabled: false })
        }
        setSuccess(true)
        setShowTwoFA(false)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Disable 2FA error:', err)
      setTwoFAError(err.response?.data?.message || 'Failed to disable 2FA')
    } finally {
      setTwoFALoading(false)
    }
  }

  // ===================================
  // ACTIVE SESSIONS
  // ===================================
  const getCurrentSessions = () => {
    const ua = navigator.userAgent
    const isMobile = /Mobi|Android/i.test(ua)

    let browser = 'Unknown Browser'
    let browserIcon = '🌐'
    if (/Edg/i.test(ua)) {
      browser = 'Microsoft Edge'
      browserIcon = '🌊'
    } else if (/Chrome/i.test(ua)) {
      browser = 'Google Chrome'
      browserIcon = '🌐'
    } else if (/Firefox/i.test(ua)) {
      browser = 'Mozilla Firefox'
      browserIcon = '🦊'
    } else if (/Safari/i.test(ua)) {
      browser = 'Safari'
      browserIcon = '🧭'
    }

    const device = isMobile ? 'Mobile' : 'Desktop'
    const deviceIcon = isMobile ? '📱' : '💻'

    const loginTime =
      localStorage.getItem('janvoice_login_time') || new Date().toISOString()

    return [
      {
        id: 'current',
        device,
        deviceIcon,
        browser,
        browserIcon,
        os: navigator.platform || 'Unknown OS',
        ip: 'Local Network',
        location: 'Chennai, India (approximate)',
        loginAt: loginTime,
        current: true
      }
    ]
  }

  // ===================================
  // SAVE PROFILE
  // ===================================
  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone
      }

      if (formData.address || formData.city || formData.state || formData.pincode) {
        payload.address = {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      }

      const response = await api.put('/auth/profile', payload)

      if (response.data?.user) {
        if (setUser) setUser(response.data.user)
      } else {
        const updatedUser = { ...user, ...formData }
        if (setUser) setUser(updatedUser)
      }

      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Save profile error:', err)
      setError(
        err.response?.data?.message || 'Failed to save profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="My Profile">
      <div className="profile-container">
        {success && (
          <div className="success-toast">✅ Action completed successfully!</div>
        )}
        {error && (
          <div
            className="success-toast"
            style={{ background: '#FED7D7', color: '#C53030', borderColor: '#FC8181' }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className="profile-header-card">
          <div className="profile-cover"></div>
          <div className="profile-header-content">
            <div className="profile-avatar">
              {(formData.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="profile-header-info">
              <h2 className="profile-name">{formData.name || 'User'}</h2>
              <p className="profile-email">📧 {formData.email || 'No email'}</p>
              <div className="profile-tags">
                <span className="tag-role">👤 Citizen</span>
                <span className="tag-verified">✅ Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ '--c': '#FF6B35' }}>
            <div className="stat-icon">📋</div>
            <div className="stat-value">{stats.totalComplaints}</div>
            <div className="stat-label">Total Complaints</div>
          </div>
          <div className="stat-card" style={{ '--c': '#38A169' }}>
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card" style={{ '--c': '#ED8936' }}>
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card" style={{ '--c': '#F7931E' }}>
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        <div className="profile-tabs">
          {[
            { id: 'info', label: 'Personal Info', icon: '👤' },
            { id: 'security', label: 'Security', icon: '🔒' },
            { id: 'preferences', label: 'Preferences', icon: '⚙️' },
            { id: 'activity', label: 'Activity', icon: '📋' }
          ].map((t) => (
            <button
              key={t.id}
              className={`profile-tab ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="tab-panel">
              <div className="panel-header">
                <h3 className="panel-title">👤 Personal Information</h3>
                <button
                  className={`btn-edit ${editing ? 'active' : ''}`}
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? '✖ Cancel' : '✏️ Edit'}
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email} disabled />
                  <span className="hint">Cannot be changed</span>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!editing}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Aadhar (masked)</label>
                  <input type="text" value={formData.aadhar} disabled />
                </div>
                <div className="form-group full">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    disabled={!editing}
                    maxLength="6"
                  />
                </div>
              </div>

              {editing && (
                <div className="form-actions">
                  <button className="btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-panel">
              <h3 className="panel-title">🔒 Security Settings</h3>
              <div className="security-list">
                <div className="security-item">
                  <div className="si-icon">🔑</div>
                  <div className="si-info">
                    <h4>Change Password</h4>
                    <p>Update your password regularly</p>
                  </div>
                  <button onClick={() => navigate('/forgot-password')} className="btn-security">
                    Change →
                  </button>
                </div>

                <div className="security-item">
                  <div className="si-icon">📱</div>
                  <div className="si-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>
                      {twoFAEnabled
                        ? 'Your account is protected by 2FA'
                        : 'Add extra security to your account'}
                    </p>
                  </div>
                  {twoFAEnabled ? (
                    <button
                      className="btn-security"
                      onClick={() => {
                        setShowTwoFA(true)
                        setQrCode('')
                        setTwoFACode('')
                        setTwoFAError('')
                        setBackupCodes([])
                      }}
                      style={{
                        background: '#C6F6D5',
                        color: '#22543D',
                        borderColor: '#9AE6B4'
                      }}
                    >
                      ✅ Manage
                    </button>
                  ) : (
                    <button
                      className="btn-security"
                      onClick={() => {
                        setShowTwoFA(true)
                        loadTwoFAQr()
                      }}
                    >
                      Enable →
                    </button>
                  )}
                </div>

                <div className="security-item">
                  <div className="si-icon">📧</div>
                  <div className="si-info">
                    <h4>Email Verification</h4>
                    <p>Your email is verified</p>
                  </div>
                  <span className="status-pill verified">✅ Verified</span>
                </div>

                <div className="security-item">
                  <div className="si-icon">🕐</div>
                  <div className="si-info">
                    <h4>Active Sessions</h4>
                    <p>Manage devices logged into your account</p>
                  </div>
                  <button
                    className="btn-security"
                    onClick={() => setShowSessions(true)}
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="tab-panel">
              <h3 className="panel-title">⚙️ Preferences</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => updatePreference('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => updatePreference('theme', e.target.value)}
                  >
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                    <option value="auto">🔄 Auto</option>
                  </select>
                </div>
              </div>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Email Notifications</div>
                    <div className="toggle-desc">Receive updates via email</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) =>
                        updatePreference('emailNotifications', e.target.checked)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">SMS Notifications</div>
                    <div className="toggle-desc">Receive alerts via SMS</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) =>
                        updatePreference('smsNotifications', e.target.checked)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Complaint Updates</div>
                    <div className="toggle-desc">
                      Get notified when complaints are updated
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={preferences.complaintUpdates}
                      onChange={(e) =>
                        updatePreference('complaintUpdates', e.target.checked)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-panel">
              <h3 className="panel-title">📋 Recent Activity</h3>
              {activities.length === 0 ? (
                <div className="activity-timeline" style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                  <p style={{ color: '#999' }}>No recent activity yet.</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/citizen/submit')}
                    style={{ marginTop: '16px' }}
                  >
                    📝 Submit Your First Complaint
                  </button>
                </div>
              ) : (
                <div className="activity-timeline">
                  {activities.map((a, i) => (
                    <div key={i} className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: a.color + '20', color: a.color }}
                      >
                        {a.icon}
                      </div>
                      <div className="activity-body">
                        <div className="activity-title">{a.title}</div>
                        <div className="activity-desc">{a.desc}</div>
                        <div className="activity-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================
            2FA MODAL
            =================================== */}
        {showTwoFA && (
          <div
            onClick={() => setShowTwoFA(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: '16px', maxWidth: '520px',
                width: '100%', padding: '32px', position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <button
                onClick={() => setShowTwoFA(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'transparent', border: 'none', fontSize: '24px',
                  cursor: 'pointer', color: '#999'
                }}
              >
                ✖
              </button>

              {twoFAEnabled && backupCodes.length === 0 && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>✅ 2FA is Enabled</h2>
                  <p style={{ color: '#666', marginBottom: '24px' }}>
                    Your account is protected. You'll need your authenticator app to sign in.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setShowTwoFA(false)}
                      style={{
                        padding: '10px 20px', borderRadius: '8px',
                        border: '1px solid #CBD5E0', background: '#fff',
                        cursor: 'pointer', fontWeight: 500
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={disableTwoFA}
                      disabled={twoFALoading}
                      style={{
                        padding: '10px 20px', borderRadius: '8px',
                        border: 'none', background: '#E53E3E', color: '#fff',
                        cursor: twoFALoading ? 'not-allowed' : 'pointer',
                        fontWeight: 600, opacity: twoFALoading ? 0.6 : 1
                      }}
                    >
                      {twoFALoading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                  </div>
                </>
              )}

              {backupCodes.length > 0 && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>🎉 2FA Enabled!</h2>
                  <p style={{ color: '#666', marginBottom: '16px' }}>
                    Save these backup codes somewhere safe. Each can be used once if you lose your phone.
                  </p>
                  <div
                    style={{
                      background: '#FEFCBF', border: '1px solid #ECC94B',
                      borderRadius: '12px', padding: '16px',
                      marginBottom: '20px', fontFamily: 'monospace',
                      fontSize: '14px', lineHeight: 1.8
                    }}
                  >
                    {backupCodes.map((code, i) => (
                      <div key={i}>{code}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setShowTwoFA(false)
                      setBackupCodes([])
                    }}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px',
                      border: 'none', background: '#FF6B35', color: '#fff',
                      cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    I've Saved My Codes
                  </button>
                </>
              )}

              {!twoFAEnabled && backupCodes.length === 0 && (
                <>
                  <h2 style={{ marginTop: 0, marginBottom: '8px' }}>
                    🔐 Enable Two-Factor Authentication
                  </h2>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    Scan the QR code below with Google Authenticator or Authy.
                  </p>

                  {twoFALoading && !qrCode && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      ⏳ Loading QR code...
                    </div>
                  )}

                  {twoFAError && (
                    <div
                      style={{
                        background: '#FED7D7', color: '#C53030',
                        padding: '12px 16px', borderRadius: '8px',
                        marginBottom: '16px'
                      }}
                    >
                      ⚠️ {twoFAError}
                    </div>
                  )}

                  {qrCode && (
                    <>
                      <div
                        style={{
                          textAlign: 'center', padding: '16px',
                          background: '#F7FAFC', borderRadius: '12px',
                          marginBottom: '20px'
                        }}
                      >
                        <img
                          src={qrCode}
                          alt="2FA QR Code"
                          style={{ maxWidth: '220px', borderRadius: '8px' }}
                        />
                      </div>

                      <label
                        style={{
                          display: 'block', marginBottom: '8px',
                          fontWeight: 600, fontSize: '14px'
                        }}
                      >
                        Enter the 6-digit code from your app
                      </label>
                      <input
                        type="text"
                        value={twoFACode}
                        onChange={(e) =>
                          setTwoFACode(
                            e.target.value.replace(/\D/g, '').slice(0, 6)
                          )
                        }
                        placeholder="000000"
                        maxLength="6"
                        style={{
                          width: '100%', padding: '14px', fontSize: '22px',
                          letterSpacing: '8px', textAlign: 'center',
                          border: '2px solid #E2E8F0', borderRadius: '10px',
                          marginBottom: '20px', fontFamily: 'monospace',
                          boxSizing: 'border-box'
                        }}
                      />

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setShowTwoFA(false)}
                          style={{
                            padding: '10px 20px', borderRadius: '8px',
                            border: '1px solid #CBD5E0', background: '#fff',
                            cursor: 'pointer', fontWeight: 500
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={verifyAndEnableTwoFA}
                          disabled={twoFALoading || twoFACode.length !== 6}
                          style={{
                            padding: '10px 20px', borderRadius: '8px',
                            border: 'none', background: '#FF6B35',
                            color: '#fff',
                            cursor:
                              twoFALoading || twoFACode.length !== 6
                                ? 'not-allowed'
                                : 'pointer',
                            fontWeight: 600,
                            opacity:
                              twoFALoading || twoFACode.length !== 6 ? 0.6 : 1
                          }}
                        >
                          {twoFALoading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ===================================
            ACTIVE SESSIONS MODAL
            =================================== */}
        {showSessions && (
          <div
            onClick={() => setShowSessions(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 1000, padding: '20px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: '16px', maxWidth: '600px',
                width: '100%', padding: '32px', position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <button
                onClick={() => setShowSessions(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'transparent', border: 'none', fontSize: '24px',
                  cursor: 'pointer', color: '#999'
                }}
              >
                ✖
              </button>

              <h2 style={{ marginTop: 0, marginBottom: '8px' }}>🕐 Active Sessions</h2>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Devices currently logged into your JanVoice account.
              </p>

              {getCurrentSessions().map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px', border: '1px solid #E2E8F0',
                    borderRadius: '12px', marginBottom: '12px',
                    background: s.current ? '#F0FFF4' : '#fff'
                  }}
                >
                  <div style={{ fontSize: '32px' }}>{s.deviceIcon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong>
                        {s.browserIcon} {s.browser} on {s.device}
                      </strong>
                      {s.current && (
                        <span
                          style={{
                            background: '#C6F6D5', color: '#22543D',
                            padding: '2px 8px', borderRadius: '12px',
                            fontSize: '11px', fontWeight: 600
                          }}
                        >
                          ✓ This device
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#718096', fontSize: '13px' }}>
                      📍 {s.location} • 🌐 {s.ip}
                    </div>
                    <div style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>
                      🕐 Logged in: {new Date(s.loginAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setShowSessions(false)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px',
                    border: '1px solid #CBD5E0', background: '#fff',
                    cursor: 'pointer', fontWeight: 500
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Profile