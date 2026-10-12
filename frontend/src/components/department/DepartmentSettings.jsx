import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const DepartmentSettings = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines' },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' },
    { icon: '📄', label: 'SLA Reports', path: '/department/sla' },
    { icon: '👨‍💼', label: 'Officer Performance', path: '/department/officers' },
    { icon: '⚙️', label: 'Settings', path: '/department/settings' }
  ]

  const [settings, setSettings] = useState({
    departmentName: 'Public Works Department',
    departmentCode: 'PW',
    headName: 'Eng. Suresh Kumar',
    contactEmail: 'pw@janvoice.gov.in',
    contactPhone: '1800-111-2222',
    autoAssign: true,
    emailNotifications: true,
    smsNotifications: false,
    allowReassignment: true,
    emergencyResponse: 1,
    highResponse: 4,
    normalResponse: 24,
    lowResponse: 48
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : '#cbd5e0',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.3s ease',
        flexShrink: 0
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '25px' : '3px',
          width: '22px',
          height: '22px',
          background: 'white',
          borderRadius: '50%',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      ></span>
    </button>
  )

  const Card = ({ title, subtitle, children }) => (
    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
      <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '13px', color: '#718096' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  )

  const FormGroup = ({ label, children, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748' }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: '11px', color: '#a0aec0', fontStyle: 'italic' }}>{hint}</span>}
    </div>
  )

  const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#718096' }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )

  const inputStyle = {
    padding: '12px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a202c',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Settings">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {saved && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56, 161, 105, 0.3)', zIndex: 1000 }}>
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>⚙️ Department Settings</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Configure department information and preferences</p>
        </div>

        {/* General Info */}
        <Card title="🏛️ General Information" subtitle="Basic department details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <FormGroup label="Department Name">
              <input type="text" value={settings.departmentName} onChange={(e) => handleChange('departmentName', e.target.value)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="Department Code">
              <input type="text" value={settings.departmentCode} onChange={(e) => handleChange('departmentCode', e.target.value)} maxLength="4" style={inputStyle} />
            </FormGroup>
            <FormGroup label="Department Head">
              <input type="text" value={settings.headName} onChange={(e) => handleChange('headName', e.target.value)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="Contact Email">
              <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="Contact Phone">
              <input type="tel" value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} style={inputStyle} />
            </FormGroup>
          </div>
        </Card>

        {/* System Preferences */}
        <Card title="🎛️ System Preferences" subtitle="Control department behavior">
          <ToggleRow
            label="Auto-Assign Complaints"
            desc="Automatically assign new complaints to available officers"
            checked={settings.autoAssign}
            onChange={(v) => handleChange('autoAssign', v)}
          />
          <ToggleRow
            label="Allow Reassignment"
            desc="Let officers request reassignment of cases"
            checked={settings.allowReassignment}
            onChange={(v) => handleChange('allowReassignment', v)}
          />
        </Card>

        {/* Notifications */}
        <Card title="🔔 Notifications" subtitle="Choose how to receive updates">
          <ToggleRow
            label="Email Notifications"
            desc="Receive case updates via email"
            checked={settings.emailNotifications}
            onChange={(v) => handleChange('emailNotifications', v)}
          />
          <ToggleRow
            label="SMS Notifications"
            desc="Receive SMS alerts for critical cases"
            checked={settings.smsNotifications}
            onChange={(v) => handleChange('smsNotifications', v)}
          />
        </Card>

        {/* SLA Response Times */}
        <Card title="⏱️ SLA Response Times" subtitle="Maximum response time per priority level">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <FormGroup label="🔴 Emergency (hours)">
              <input type="number" min="1" value={settings.emergencyResponse} onChange={(e) => handleChange('emergencyResponse', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🟠 High (hours)">
              <input type="number" min="1" value={settings.highResponse} onChange={(e) => handleChange('highResponse', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🟡 Normal (hours)">
              <input type="number" min="1" value={settings.normalResponse} onChange={(e) => handleChange('normalResponse', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🔵 Low (hours)">
              <input type="number" min="1" value={settings.lowResponse} onChange={(e) => handleChange('lowResponse', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{ padding: '14px 24px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
            Reset to Defaults
          </button>
          <button onClick={handleSave} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}>
            💾 Save All Settings
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentSettings