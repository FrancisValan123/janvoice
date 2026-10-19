import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

const AuthoritySettings = () => {
  const { user } = useAuth()
  
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated' },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue' },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [settings, setSettings] = useState({
    autoEscalation: true,
    emailAlerts: true,
    smsAlerts: false,
    emergencySla: 1,
    highSla: 4,
    normalSla: 24,
    lowSla: 48,
    escalationThreshold: 7
  })

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setSaving(true)
    // Simulating API save for now
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? 'linear-gradient(135deg, #C53030, #9B2C2C)' : 'var(--border-medium)',
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
    <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  )

  const FormGroup = ({ label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  )

  const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )

  const inputStyle = {
    padding: '12px 14px',
    border: '2px solid var(--border-light)',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    background: 'var(--input-bg)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease'
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="System Settings">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {saved && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56, 161, 105, 0.3)', zIndex: 1000 }}>
            ✅ Settings saved successfully!
          </div>
        )}

        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '20px', padding: '32px', color: 'white', boxShadow: '0 12px 32px rgba(197, 48, 48, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            ⚙️ Global System Settings
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Configure system-wide SLAs and escalation rules across all departments
          </p>
        </div>

        {/* System Preferences */}
        <Card title="🎛️ System Controls" subtitle="Global behavior for the JanVoice platform">
          <ToggleRow
            label="Auto-Escalation"
            desc="Automatically escalate cases that pass their SLA deadline"
            checked={settings.autoEscalation}
            onChange={(v) => handleChange('autoEscalation', v)}
          />
          <ToggleRow
            label="Email Alerts"
            desc="Send email notifications to department heads for critical cases"
            checked={settings.emailAlerts}
            onChange={(v) => handleChange('emailAlerts', v)}
          />
          <ToggleRow
            label="SMS Alerts"
            desc="Send SMS notifications for Emergency priority complaints"
            checked={settings.smsAlerts}
            onChange={(v) => handleChange('smsAlerts', v)}
          />
        </Card>

        {/* SLA Response Times */}
        <Card title="⏱️ Global SLA Targets" subtitle="Maximum response time (in hours) per priority level">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <FormGroup label="🔴 Emergency (hours)">
              <input type="number" min="1" value={settings.emergencySla} onChange={(e) => handleChange('emergencySla', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🟠 High (hours)">
              <input type="number" min="1" value={settings.highSla} onChange={(e) => handleChange('highSla', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🟡 Normal (hours)">
              <input type="number" min="1" value={settings.normalSla} onChange={(e) => handleChange('normalSla', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
            <FormGroup label="🔵 Low (hours)">
              <input type="number" min="1" value={settings.lowSla} onChange={(e) => handleChange('lowSla', parseInt(e.target.value) || 1)} style={inputStyle} />
            </FormGroup>
          </div>
        </Card>

        {/* Escalation Threshold */}
        <Card title="🚨 Escalation Thresholds" subtitle="When should cases be escalated to higher authority?">
          <FormGroup label="Days Overdue before Escalation">
            <input type="number" min="1" max="30" value={settings.escalationThreshold} onChange={(e) => handleChange('escalationThreshold', parseInt(e.target.value) || 1)} style={inputStyle} />
          </FormGroup>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '14px 24px', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Reset to Defaults
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: '14px 32px', background: saving ? 'var(--border-medium)' : 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: saving ? 'none' : '0 4px 12px rgba(197, 48, 48, 0.3)' }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AuthoritySettings