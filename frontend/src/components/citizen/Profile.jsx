import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('info')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar: '',
    occupation: ''
  })

  const [errors, setErrors] = useState({})

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  useEffect(() => {
    // Load profile from localStorage or use defaults from auth context
    const savedProfile = localStorage.getItem('janvoice_profile')
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    else if (formData.name.trim().length < 3)
      newErrors.name = 'Name must be at least 3 characters'

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = 'Enter a valid 10-digit mobile number'

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = 'Pincode must be 6 digits'

    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar))
      newErrors.aadhaar = 'Aadhaar must be 12 digits'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    localStorage.setItem('janvoice_profile', JSON.stringify(formData))

    // Also update the auth user name
    const authUser = JSON.parse(localStorage.getItem('janvoice_user') || '{}')
    authUser.name = formData.name
    localStorage.setItem('janvoice_user', JSON.stringify(authUser))

    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCancel = () => {
    const savedProfile = localStorage.getItem('janvoice_profile')
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile))
    }
    setEditing(false)
    setErrors({})
  }

  const stats = {
    totalComplaints: 12,
    resolved: 8,
    pending: 3,
    emergency: 1
  }

  const tabs = [
    { id: 'info', label: '👤 Personal Info' },
    { id: 'contact', label: '📞 Contact Details' },
    { id: 'security', label: '🔒 Security' },
    { id: 'stats', label: '📊 Activity' }
  ]

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="My Profile">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-lg">
            {formData.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-header-info">
            <h2>{formData.name || 'Citizen User'}</h2>
            <p>{formData.email || 'citizen@test.com'}</p>
            <span className="verified-badge">✅ Verified Citizen</span>
          </div>
          <button
            className="btn-edit-profile"
            onClick={() => (editing ? handleSave() : setEditing(true))}
          >
            {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="success-banner">
          <span>✅</span> Profile updated successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`profile-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {/* TAB 1: Personal Info */}
        {activeTab === 'info' && (
          <div className="profile-section">
            <h3 className="section-heading">Personal Information</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled"
                />
                <span className="hint">Email cannot be changed</span>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editing}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g., Engineer, Teacher"
                />
              </div>

              <div className="form-group">
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="12-digit Aadhaar"
                  maxLength={12}
                  className={errors.aadhaar ? 'error' : ''}
                />
                {errors.aadhaar && (
                  <span className="error-msg">{errors.aadhaar}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact */}
        {activeTab === 'contact' && (
          <div className="profile-section">
            <h3 className="section-heading">Contact Details</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && (
                  <span className="error-msg">{errors.phone}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="House no, street, area"
                  rows={3}
                ></textarea>
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g., Chennai"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="e.g., Tamil Nadu"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && (
                  <span className="error-msg">{errors.pincode}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security */}
        {activeTab === 'security' && (
          <div className="profile-section">
            <h3 className="section-heading">Security Settings</h3>

            <div className="security-item">
              <div className="security-info">
                <h4>🔒 Change Password</h4>
                <p>Update your password to keep your account secure</p>
              </div>
              <button className="btn-security">Change</button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <h4>📱 Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <button className="btn-security">Enable</button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <h4>📧 Email Notifications</h4>
                <p>Receive updates about your complaints via email</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="security-item">
              <div className="security-info">
                <h4>📱 SMS Notifications</h4>
                <p>Get SMS alerts when your complaint status changes</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="security-item danger">
              <div className="security-info">
                <h4>⚠️ Delete Account</h4>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="btn-danger">Delete</button>
            </div>
          </div>
        )}

        {/* TAB 4: Activity / Stats */}
        {activeTab === 'stats' && (
          <div className="profile-section">
            <h3 className="section-heading">Your Activity</h3>

            <div className="stats-grid">
              <div className="stat-box" style={{ '--color': '#FF6B35' }}>
                <div className="stat-icon">📋</div>
                <div className="stat-num">{stats.totalComplaints}</div>
                <div className="stat-label">Total Complaints</div>
              </div>

              <div className="stat-box" style={{ '--color': '#38A169' }}>
                <div className="stat-icon">✅</div>
                <div className="stat-num">{stats.resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>

              <div className="stat-box" style={{ '--color': '#F7931E' }}>
                <div className="stat-icon">⏳</div>
                <div className="stat-num">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>

              <div className="stat-box" style={{ '--color': '#E53E3E' }}>
                <div className="stat-icon">🔴</div>
                <div className="stat-num">{stats.emergency}</div>
                <div className="stat-label">Emergency</div>
              </div>
            </div>

            <div className="activity-info-box">
              <h4>🏆 Citizen Score: 850 / 1000</h4>
              <p>
                You're an <strong>Active Contributor</strong>! Keep reporting
                issues to help improve your community.
              </p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="activity-info-box">
              <h4>📅 Member Since</h4>
              <p>September 2026 — Thank you for being part of JanVoice!</p>
            </div>
          </div>
        )}
      </div>

      {/* Save/Cancel Buttons (Only shown when editing) */}
      {editing && activeTab !== 'security' && activeTab !== 'stats' && (
        <div className="edit-actions">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Profile