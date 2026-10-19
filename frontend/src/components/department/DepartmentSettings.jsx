import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

const DepartmentSettings = () => {
  const { user } = useAuth()
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

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deptId, setDeptId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [settings, setSettings] = useState({
    departmentName: '',
    departmentCode: '',
    headName: '',
    contactEmail: '',
    contactPhone: '',
    autoAssign: false,
    emailNotifications: true,
    smsNotifications: false,
    allowReassignment: true,
    emergencyResponse: 1,
    highResponse: 4,
    normalResponse: 24,
    lowResponse: 48
  })

  // ===================================
  // FETCH REAL DEPARTMENT DATA
  // ===================================
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setLoading(true)
        // 1. Fetch all departments
        const res = await api.get('/departments')
        const departments = res.data?.departments || []
        
        // 2. Find the logged-in admin's department
        const myDept = departments.find(d => d.name === user?.department)
        
        if (myDept) {
          setDeptId(myDept._id)
          setSettings(prev => ({
            ...prev,
            departmentName: myDept.name || '',
            departmentCode: myDept.code || '',
            headName: myDept.head || '',
            contactEmail: myDept.contactEmail || '',
            contactPhone: myDept.contactPhone || '',
            emergencyResponse: myDept.slaTargets?.emergency || 1,
            highResponse: myDept.slaTargets?.high || 4,
            normalResponse: myDept.slaTargets?.normal || 24,
            lowResponse: myDept.slaTargets?.low || 48
          }))
        } else {
          setError('Could not find your department record in the database.')
        }
      } catch (err) {
        console.error('Failed to load department settings:', err)
        setError('Failed to load settings from the server.')
      } finally {
        setLoading(false)
      }
    }

    if (user?.department) {
      fetchDepartment()
    } else {
      setLoading(false)
      setError('You are not assigned to a department.')
    }
  }, [user])

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  // ===================================
  // SAVE TO DATABASE
  // ===================================
  const handleSave = async () => {
    if (!deptId) return alert('Department ID not found.')
    
    setSaving(true)
    setError('')
    
    try {
      // Prepare payload matching your backend's expected fields
      const payload = {
        name: settings.departmentName,
        code: settings.departmentCode,
        head: settings.headName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        slaTargets: {
          emergency: parseInt(settings.emergencyResponse),
          high: parseInt(settings.highResponse),
          normal: parseInt(settings.normalResponse),
          low: parseInt(settings.lowResponse)
        }
      }

      await api.patch(`/departments/${deptId}`, payload)
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      setError(err.response?.data?.message || 'Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'var(--border-medium)',
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

  const FormGroup = ({ label, children, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>{hint}</span>}
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

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Settings">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>⏳ Loading settings...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Settings">
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {saved && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56, 161, 105, 0.3)', zIndex: 1000 }}>
            ✅ Settings saved successfully!
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px', borderRadius: '10px', fontWeight: 600, fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Header Banner - Fixed text color */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '20px', padding: '32px', color: 'white', boxShadow: '0 12px 32px rgba(45, 55, 72, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            ⚙️ Department Settings
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Configure department information and preferences
          </p>
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
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '14px 24px', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Reset to Defaults
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ padding: '14px 32px', background: saving ? 'var(--border-medium)' : 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: saving ? 'none' : '0 4px 12px rgba(255, 107, 53, 0.3)' }}
          >
            {saving ? '⏳ Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentSettings