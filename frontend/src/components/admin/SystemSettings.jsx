import React, { useState } from 'react'
import './SystemSettings.css'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'JanVoice',
    siteTagline: 'National Public Complaint & Action Platform',
    contactEmail: 'support@janvoice.gov.in',
    contactPhone: '1800-XXX-XXXX',
    maintenanceMode: false,
    registrationOpen: true,
    autoAssignComplaints: true,
    emailNotifications: true,
    smsNotifications: false,
    emergencyResponseTime: 1,
    highResponseTime: 4,
    normalResponseTime: 24,
    lowResponseTime: 48
  })

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`toggle ${checked ? 'on' : 'off'}`}
      type="button"
    >
      <span className="toggle-knob"></span>
    </button>
  )

  return (
    <div className="dashboard-content">
      <div className="settings-container">
        <div className="settings-card">
          <div className="settings-header">
            <h3 className="settings-title">⚙️ General Settings</h3>
            <p className="settings-subtitle">Configure basic platform information</p>
          </div>
          <div className="settings-body">
            <div className="form-group">
              <label>Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Site Tagline</label>
              <input type="text" value={settings.siteTagline} onChange={(e) => handleChange('siteTagline', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <h3 className="settings-title">🎛️ System Controls</h3>
            <p className="settings-subtitle">Enable or disable system features</p>
          </div>
          <div className="settings-body">
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Maintenance Mode</div>
                <div className="toggle-description">Temporarily disable access for non-admin users</div>
              </div>
              <Toggle checked={settings.maintenanceMode} onChange={(v) => handleChange('maintenanceMode', v)} />
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Registration Open</div>
                <div className="toggle-description">Allow new users to register accounts</div>
              </div>
              <Toggle checked={settings.registrationOpen} onChange={(v) => handleChange('registrationOpen', v)} />
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Auto-Assign Complaints</div>
                <div className="toggle-description">Automatically assign complaints to available officers</div>
              </div>
              <Toggle checked={settings.autoAssignComplaints} onChange={(v) => handleChange('autoAssignComplaints', v)} />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <h3 className="settings-title">🔔 Notifications</h3>
            <p className="settings-subtitle">Choose how to notify users</p>
          </div>
          <div className="settings-body">
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Email Notifications</div>
                <div className="toggle-description">Send email updates for complaint status</div>
              </div>
              <Toggle checked={settings.emailNotifications} onChange={(v) => handleChange('emailNotifications', v)} />
            </div>
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">SMS Notifications</div>
                <div className="toggle-description">Send SMS alerts for emergency complaints</div>
              </div>
              <Toggle checked={settings.smsNotifications} onChange={(v) => handleChange('smsNotifications', v)} />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <h3 className="settings-title">⏱️ SLA Response Times</h3>
            <p className="settings-subtitle">Set maximum response time for each priority level</p>
          </div>
          <div className="settings-body">
            <div className="form-row">
              <div className="form-group">
                <label>🔴 Emergency (hours)</label>
                <input type="number" min="1" value={settings.emergencyResponseTime} onChange={(e) => handleChange('emergencyResponseTime', parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group">
                <label>🟠 High (hours)</label>
                <input type="number" min="1" value={settings.highResponseTime} onChange={(e) => handleChange('highResponseTime', parseInt(e.target.value) || 1)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>🟡 Normal (hours)</label>
                <input type="number" min="1" value={settings.normalResponseTime} onChange={(e) => handleChange('normalResponseTime', parseInt(e.target.value) || 1)} />
              </div>
              <div className="form-group">
                <label>🔵 Low (hours)</label>
                <input type="number" min="1" value={settings.lowResponseTime} onChange={(e) => handleChange('lowResponseTime', parseInt(e.target.value) || 1)} />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn-secondary">Reset to Defaults</button>
          <button className="btn-primary" onClick={handleSave}>💾 Save All Settings</button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings