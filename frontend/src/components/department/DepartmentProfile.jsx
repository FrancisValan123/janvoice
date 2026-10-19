import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

const DepartmentProfile = () => {
  const { user, setUser } = useAuth()
  
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

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: ''
  })

  // Load real user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || 'Unassigned',
        role: user.role || 'Department Admin'
      })
    }
  }, [user])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // ===================================
  // SAVE PROFILE TO DATABASE
  // ===================================
  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone
      })

      if (res.data.success) {
        setUser({ ...user, name: formData.name, phone: formData.phone })
        setSuccess(true)
        setEditing(false)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      setError(err.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'DA'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  const inputStyle = {
    padding: '12px 14px',
    border: '2px solid var(--border-light)',
    borderRadius: '10px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    background: 'var(--input-bg)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box'
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="My Profile">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {success && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56, 161, 105, 0.3)', zIndex: 1000 }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Header Profile Card */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px', position: 'relative' }}>
          
          {/* Top Blue Banner */}
          <div style={{ height: '120px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '20px 20px 0 0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          </div>

          {/* Avatar positioned absolutely to overlay the boundary */}
          <div style={{ position: 'absolute', top: '70px', left: '32px', width: '100px', height: '100px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '800', border: '5px solid var(--bg-surface)', boxShadow: '0 8px 24px rgba(255, 107, 53, 0.25)', zIndex: 10 }}>
            {getInitials(formData.name)}
          </div>

          {/* Text content safely in the white area */}
          <div style={{ padding: '60px 32px 32px 32px', display: 'flex', alignItems: 'flex-end', minHeight: '120px' }}>
            <div style={{ flex: 1, paddingLeft: '120px' }}> {/* Push text to the right of the avatar */}
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {formData.name}
              </h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: 'rgba(128, 90, 213, 0.15)', color: '#805AD5' }}>
                  🏛️ {formData.role.replace('_', ' ').toUpperCase()}
                </span>
                <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: 'rgba(56, 161, 105, 0.15)', color: '#38A169' }}>
                  ✅ {formData.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>Personal Information</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Manage your account details</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              style={{ padding: '10px 20px', background: editing ? 'var(--bg-surface-secondary)' : 'linear-gradient(135deg, #2C5282, #4299E1)', color: editing ? 'var(--text-secondary)' : 'white', border: editing ? '2px solid var(--border-light)' : 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: editing ? 'none' : '0 4px 12px rgba(66, 153, 225, 0.3)' }}
            >
              {editing ? '✖ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase' }}>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} disabled={!editing} style={inputStyle} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
              <input type="email" value={formData.email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} title="Email cannot be changed" />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase' }}>Phone Number</label>
              <input type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!editing} placeholder="Enter 10-digit number" style={inputStyle} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase' }}>Department</label>
              <input type="text" value={formData.department} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} title="Department is assigned by System Admin" />
            </div>
          </div>

          {editing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
              <button 
                onClick={handleSave} 
                disabled={saving}
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default DepartmentProfile