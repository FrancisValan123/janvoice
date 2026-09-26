import React, { useState } from 'react'
import './SystemSettings.css'

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [toast, setToast] = useState(null)

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'JanVoice',
    siteTagline: 'National Public Complaint & Action Platform',
    supportEmail: 'support@janvoice.gov.in',
    supportPhone: '1800-XXX-XXXX',
    timezone: 'Asia/Kolkata',
    language: 'en'
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'janvoice@gmail.com',
    smtpPass: '••••••••••••',
    fromName: 'JanVoice',
    fromEmail: 'noreply@janvoice.gov.in'
  })

  const [slaSettings, setSlaSettings] = useState({
    emergency: 1,
    high: 4,
    normal: 24,
    low: 48,
    autoEscalate: true,
    escalationHours: 72
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    dailyDigest: false
  })

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = () => {
    showToast('✅ Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'sla', label: 'SLA', icon: '⏱️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ]

  return (
    <div className="system-settings">
      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="page-header">
        <div>
          <h2>⚙️ System Settings</h2>
          <p>Configure the JanVoice platform</p>
        </div>
        <button className="btn-save-all" onClick={handleSave}>
          <span>💾</span> Save Changes
        </button>
      </div>

      <div className="settings-layout">
        <aside className="settings-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </aside>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-panel">
              <h3 className="panel-title">General Settings</h3>
              <p className="panel-desc">Basic configuration for the platform</p>

              <div className="form-grid">
                <div className="form-field">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Site Tagline</label>
                  <input
                    type="text"
                    value={generalSettings.siteTagline}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteTagline: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Support Email</label>
                  <input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Support Phone</label>
                  <input
                    type="tel"
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Timezone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Default Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="settings-panel">
              <h3 className="panel-title">Email Configuration</h3>
              <p className="panel-desc">SMTP settings for outgoing emails</p>

              <div className="form-grid">
                <div className="form-field">
                  <label>SMTP Host</label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>SMTP Port</label>
                  <input
                    type="text"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>SMTP Username</label>
                  <input
                    type="email"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>SMTP Password</label>
                  <input
                    type="password"
                    value={emailSettings.smtpPass}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>From Name</label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>From Email</label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn-test-email">📨 Send Test Email</button>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="settings-panel">
              <h3 className="panel-title">SLA Configuration</h3>
              <p className="panel-desc">Set response times for each priority level</p>

              <div className="sla-grid">
                <div className="sla-card priority-emergency">
                  <div className="sla-header">
                    <span className="sla-icon">🔴</span>
                    <span className="sla-title">Emergency</span>
                  </div>
                  <div className="sla-input">
                    <input
                      type="number"
                      value={slaSettings.emergency}
                      onChange={(e) => setSlaSettings({ ...slaSettings, emergency: e.target.value })}
                      min="1"
                    />
                    <span className="sla-unit">hours</span>
                  </div>
                </div>

                <div className="sla-card priority-high">
                  <div className="sla-header">
                    <span className="sla-icon">🟠</span>
                    <span className="sla-title">High Priority</span>
                  </div>
                  <div className="sla-input">
                    <input
                      type="number"
                      value={slaSettings.high}
                      onChange={(e) => setSlaSettings({ ...slaSettings, high: e.target.value })}
                      min="1"
                    />
                    <span className="sla-unit">hours</span>
                  </div>
                </div>

                <div className="sla-card priority-normal">
                  <div className="sla-header">
                    <span className="sla-icon">🟡</span>
                    <span className="sla-title">Normal</span>
                  </div>
                  <div className="sla-input">
                    <input
                      type="number"
                      value={slaSettings.normal}
                      onChange={(e) => setSlaSettings({ ...slaSettings, normal: e.target.value })}
                      min="1"
                    />
                    <span className="sla-unit">hours</span>
                  </div>
                </div>

                <div className="sla-card priority-low">
                  <div className="sla-header">
                    <span className="sla-icon">🔵</span>
                    <span className="sla-title">Low Priority</span>
                  </div>
                  <div className="sla-input">
                    <input
                      type="number"
                      value={slaSettings.low}
                      onChange={(e) => setSlaSettings({ ...slaSettings, low: e.target.value })}
                      min="1"
                    />
                    <span className="sla-unit">hours</span>
                  </div>
                </div>
              </div>

              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Auto-Escalate Overdue Cases</div>
                  <div className="toggle-desc">Automatically escalate to higher authority</div>
                </div>
                <button
                  className={`toggle-btn ${slaSettings.autoEscalate ? 'on' : 'off'}`}
                  onClick={() => setSlaSettings({ ...slaSettings, autoEscalate: !slaSettings.autoEscalate })}
                >
                  <span className="toggle-circle"></span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <h3 className="panel-title">Notification Settings</h3>
              <p className="panel-desc">Choose how you want to receive notifications</p>

              <div className="toggle-list">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="toggle-row">
                    <div>
                      <div className="toggle-label">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="toggle-desc">Enable or disable this notification</div>
                    </div>
                    <button
                      className={`toggle-btn ${value ? 'on' : 'off'}`}
                      onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })}
                    >
                      <span className="toggle-circle"></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings