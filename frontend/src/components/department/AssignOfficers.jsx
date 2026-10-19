import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../common/StatCard'

const AssignOfficers = () => {
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

  const [unassigned, setUnassigned] = useState([])
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedOfficer, setSelectedOfficer] = useState(null)
  const [searchOfficer, setSearchOfficer] = useState('')
  const [success, setSuccess] = useState(false)
  const [assigning, setAssigning] = useState(false)

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const complaintsRes = await api.get('/complaints?status=pending')
        setUnassigned(complaintsRes.data?.complaints || [])

        const officersRes = await api.get('/admin/users?role=officer')
        setOfficers(officersRes.data?.users || [])
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load complaints or officers.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.1)' },
      high: { icon: '🟠', label: 'High', color: '#F7931E', bg: 'rgba(247, 147, 30, 0.1)' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B', bg: 'rgba(236, 201, 75, 0.15)' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.1)' }
    }
    return map[p] || map.normal
  }

  const handleAssign = async () => {
    if (!selectedCase || !selectedOfficer) return

    setAssigning(true)
    try {
      await api.put(`/complaints/${selectedCase._id}/assign`, {
        assignedTo: selectedOfficer._id,
        department: user.department
      })

      setUnassigned((prev) => prev.filter((c) => c._id !== selectedCase._id))
      setSuccess(true)
      setSelectedCase(null)
      setSelectedOfficer(null)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Assignment error:', err)
      alert(err.response?.data?.message || 'Failed to assign case.')
    } finally {
      setAssigning(false)
    }
  }

  const filteredOfficers = officers.filter(
    (o) => o.name.toLowerCase().includes(searchOfficer.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Assign Officers">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>Loading data...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Assign Officers">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {success && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#38A169', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(56,161,105,0.3)', zIndex: 1000 }}>
            ✅ Case assigned successfully!
          </div>
        )}

        {/* ✅ ADDED: Beautiful Gradient Banner */}
        <div style={{ background: 'linear-gradient(135deg, #553C9A 0%, #805AD5 60%, #B794F4 100%)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(128, 90, 213, 0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              👥 Assign Officers
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', maxWidth: '600px', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              Match unassigned complaints with the best available officer. Select a pending case on the left, and choose an officer on the right.
            </p>
          </div>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '150px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <StatCard icon="⏳" label="Pending Cases" value={unassigned.length} color="#ED8936" />
          <StatCard icon="👥" label="Available Officers" value={officers.length} color="#805AD5" />
          <StatCard icon="🚀" label="Action Required" value={selectedCase ? 1 : 0} color="#3182CE" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          {/* Left: Unassigned Cases */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                📋 Unassigned Cases ({unassigned.length})
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {unassigned.map((c) => {
                const priority = getPriorityConfig(c.priority)
                const isSelected = selectedCase?._id === c._id
                return (
                  <div
                    key={c._id}
                    onClick={() => setSelectedCase(c)}
                    style={{
                      padding: '16px',
                      background: isSelected ? 'rgba(255, 107, 53, 0.08)' : 'var(--bg-surface-secondary)',
                      border: isSelected ? '2px solid #FF6B35' : '2px solid var(--border-light)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(255, 107, 53, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                        {c.complaintId || c._id}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                        {priority.icon} {priority.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {c.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                      <span>📁 {c.category}</span>
                      <span>📍 {c.location?.address || 'Unknown'}</span>
                    </div>
                  </div>
                )
              })}

              {unassigned.length === 0 && (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-surface-secondary)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>All Cases Assigned!</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>There are no pending cases waiting for assignment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Officers */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)', gap: '12px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                👨‍💼 Available Officers ({filteredOfficers.length})
              </h3>
              <input
                type="text"
                placeholder="Search officers..."
                value={searchOfficer}
                onChange={(e) => setSearchOfficer(e.target.value)}
                style={{ padding: '10px 14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', minWidth: '200px', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {filteredOfficers.map((o) => {
                const isSelected = selectedOfficer?._id === o._id
                return (
                  <div
                    key={o._id}
                    onClick={() => setSelectedOfficer(o)}
                    style={{
                      padding: '16px',
                      background: isSelected ? 'rgba(128, 90, 213, 0.08)' : 'var(--bg-surface-secondary)',
                      border: isSelected ? '2px solid #805AD5' : '2px solid var(--border-light)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(128, 90, 213, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', background: isSelected ? '#805AD5' : 'var(--text-tertiary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', flexShrink: 0 }}>
                        {o.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{o.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {o.department || 'No Dept'} • {o.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {filteredOfficers.length === 0 && (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>No officers found in this department.</p>
              )}
            </div>
          </div>
        </div>

        {/* Assignment Footer */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', marginTop: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', borderTop: '4px solid #FF6B35' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            {selectedCase && selectedOfficer ? (
              <div style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                Ready to assign <strong style={{ color: '#FF6B35' }}>{selectedCase.complaintId || selectedCase._id}</strong> to <strong style={{ color: '#805AD5' }}>{selectedOfficer.name}</strong>?
              </div>
            ) : (
              <div style={{ fontSize: '15px', color: 'var(--text-tertiary)' }}>
                Select a case on the left, and an officer on the right to proceed.
              </div>
            )}
          </div>
          <button
            onClick={handleAssign}
            disabled={!selectedCase || !selectedOfficer || assigning}
            style={{
              padding: '16px 36px',
              background: (selectedCase && selectedOfficer && !assigning) ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'var(--border-medium)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: (selectedCase && selectedOfficer && !assigning) ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: (selectedCase && selectedOfficer && !assigning) ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none'
            }}
          >
            {assigning ? '⏳ Assigning...' : '✅ Assign Officer'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssignOfficers