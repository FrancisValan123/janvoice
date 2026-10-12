import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const getRoleConfig = (role) => {
    const config = {
      citizen: { label: 'Citizen', icon: '👤', color: '#4299E1', bg: '#BEE3F8' },
      officer: { label: 'Officer', icon: '👨‍💼', color: '#805AD5', bg: '#E9D8FD' },
      department_admin: { label: 'Dept Admin', icon: '🏛️', color: '#ED8936', bg: '#FEEBC8' },
      higher_authority: { label: 'Higher Authority', icon: '⭐', color: '#E53E3E', bg: '#FED7D7' },
      system_admin: { label: 'System Admin', icon: '⚙️', color: '#1a202c', bg: '#E2E8F0' }
    }
    return config[role] || config.citizen
  }

  const handleSave = async () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
  }

  const role = getRoleConfig(user?.role)

  const menuItems = [
    { id: 'profile', icon: '👤', label: 'Profile Info' },
    { id: 'security', icon: '🔒', label: 'Security' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'preferences', icon: '⚙️', label: 'Preferences' }
  ]

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info-header">
            <h1 className="profile-name">{user?.name || 'User'}</h1>
            <p className="profile-email-header">📧 {user?.email || 'email@example.com'}</p>
            <div className="profile-badges">
              <span
                className="role-badge-large"
                style={{ background: role.bg, color: role.color }}
              >
                {role.icon} {role.label}
              </span>
              <span className="status-badge-large">
                🟢 Active
              </span>
            </div>
          </div>
          <div className="profile-header-actions">
            <Link to="/login" className="btn-icon-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>

      {success && (
        <div className="success-toast">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Main Grid */}
      <div className="profile-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}

          <div className="sidebar-footer">
            <Link to="/logout" className="logout-sidebar-btn">
              🚪 Logout
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">👤 Personal Information</h2>
                  <p className="section-subtitle">
                    Manage your personal details and contact info
                  </p>
                </div>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    title="Email cannot be changed"
                  />
                  <span className="hint">Email cannot be changed</span>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={role.label} disabled />
                  <span className="hint">Set by system administrator</span>
                </div>

                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!editing}
                    placeholder="Street address"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!editing}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    disabled={!editing}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    disabled={!editing}
                    placeholder="600001"
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
            <div className="profile-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">🔒 Security Settings</h2>
                  <p className="section-subtitle">
                    Manage your password and security preferences
                  </p>
                </div>
              </div>

              <div className="security-list">
                <div className="security-item">
                  <div className="security-icon">🔑</div>
                  <div className="security-info">
                    <h4>Change Password</h4>
                    <p>Update your password regularly for better security</p>
                  </div>
                  <Link to="/forgot-password" className="btn-security">
                    Change →
                  </Link>
                </div>

                <div className="security-item">
                  <div className="security-icon">📱</div>
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-security">Enable →</button>
                </div>

                <div className="security-item">
                  <div className="security-icon">📧</div>
                  <div className="security-info">
                    <h4>Email Verification</h4>
                    <p>Your email is verified and secure</p>
                  </div>
                  <span className="status-badge success">✅ Verified</span>
                </div>

                <div className="security-item">
                  <div className="security-icon">💻</div>
                  <div className="security-info">
                    <h4>Active Sessions</h4>
                    <p>Manage devices currently logged into your account</p>
                  </div>
                  <button className="btn-security">View →</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">🔔 Notification Preferences</h2>
                  <p className="section-subtitle">
                    Choose how you'd like to be notified
                  </p>
                </div>
              </div>

              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Email Notifications</div>
                    <div className="toggle-desc">
                      Receive updates via email
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">SMS Notifications</div>
                    <div className="toggle-desc">
                      Receive alerts via SMS
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Complaint Updates</div>
                    <div className="toggle-desc">
                      Get notified when your complaints are updated
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Weekly Digest</div>
                    <div className="toggle-desc">
                      Receive weekly summary of activities
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-title">Marketing Emails</div>
                    <div className="toggle-desc">
                      Receive news and updates about JanVoice
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">⚙️ Preferences</h2>
                  <p className="section-subtitle">
                    Customize your JanVoice experience
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Theme</label>
                  <select defaultValue="light">
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                    <option value="auto">🔄 Auto</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Time Zone</label>
                  <select defaultValue="ist">
                    <option value="ist">🇮🇳 IST (UTC+5:30)</option>
                    <option value="utc">🌍 UTC</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date Format</label>
                  <select defaultValue="dd-mm-yyyy">
                    <option value="dd-mm-yyyy">DD-MM-YYYY</option>
                    <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">💾 Save Preferences</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile