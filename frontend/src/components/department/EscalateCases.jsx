import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './EscalateCases.css' // ✅ Import the new CSS file

const EscalateCases = () => {
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

  const [candidates, setCandidates] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [escalating, setEscalating] = useState(false)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true)
        const response = await api.get('/complaints')
        const allComplaints = response.data?.complaints || []
        
        const activeCases = allComplaints.filter(c => 
          c.status !== 'resolved' && c.status !== 'escalated' && c.status !== 'closed'
        )

        const processed = activeCases.map(c => {
          const isOverdue = c.deadline && new Date(c.deadline) < new Date()
          const daysOverdue = isOverdue 
            ? Math.floor((new Date() - new Date(c.deadline)) / (1000 * 60 * 60 * 24))
            : 0
            
          const suggested = isOverdue || c.priority === 'emergency'

          return {
            _id: c._id,
            complaintId: c.complaintId || c._id,
            title: c.title,
            priority: c.priority || 'normal',
            officer: c.assignedTo?.name || 'Unassigned',
            reason: isOverdue ? `Overdue by ${daysOverdue} days` : 'Active case',
            suggested
          }
        })

        processed.sort((a, b) => (b.suggested === a.suggested ? 0 : b.suggested ? 1 : -1))
        setCandidates(processed)
      } catch (err) {
        console.error('Error fetching cases:', err)
        setError('Failed to load cases. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleEscalate = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one case')
      return
    }
    
    setEscalating(true)
    try {
      const promises = selectedIds.map(id => 
        api.put(`/departments/escalate/${id}`, 
          { reason: 'Escalated by Department Admin via dashboard' }
        )
      )

      await Promise.all(promises)

      setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c._id)))
      setSuccess(true)
      setSelectedIds([])
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error escalating cases:', err)
      alert('Failed to escalate cases. Check the console for details.')
    } finally {
      setEscalating(false)
    }
  }

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', color: '#E53E3E', bg: '#FED7D7' },
      high: { icon: '🟠', color: '#F7931E', bg: '#FEEBC8' },
      normal: { icon: '🟡', color: '#ECC94B', bg: '#FEFCBF' },
      low: { icon: '🔵', color: '#4299E1', bg: '#BEE3F8' }
    }
    return map[p] || map.normal
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Cases">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          ⏳ Loading cases...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Cases">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {success && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#C53030', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.3)', zIndex: 1000 }}>
            🚨 Cases escalated to higher authority!
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* ✅ FIXED: Added className="ec-header-banner" */}
        <div className="ec-header-banner" style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '14px', padding: '28px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.2)' }}>
          <h2>🚨 Escalate Cases</h2>
          <p>Escalate problematic cases to higher authority for intervention</p>
        </div>

        <div style={{ background: '#FFF5F5', border: '2px solid #FED7D7', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#742A2A', marginBottom: '4px' }}>
              Escalation Guidelines
            </div>
            <div style={{ fontSize: '13px', color: '#9B2C2C', lineHeight: 1.5 }}>
              Use escalation for cases that: are overdue by 7+ days, have no officer response, need higher authority intervention, or have been disputed by citizens.
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
              📋 Cases Requiring Escalation ({candidates.length})
            </h3>
            {candidates.length > 0 && (
              <button
                onClick={() => setSelectedIds(candidates.map((c) => c._id))}
                style={{ padding: '8px 16px', background: 'var(--bg-surface-secondary)', border: '2px solid var(--border-light)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Select All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {candidates.map((c) => {
              const priority = getPriorityConfig(c.priority)
              const selected = selectedIds.includes(c._id)
              
              return (
                <div
                  key={c._id}
                  onClick={() => toggleSelect(c._id)}
                  style={{
                    padding: '16px',
                    background: selected ? '#FFF5F5' : 'var(--bg-surface-secondary)',
                    border: selected ? '2px solid #E53E3E' : '2px solid transparent',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', border: selected ? 'none' : '2px solid #cbd5e0', background: selected ? '#E53E3E' : 'var(--bg-surface)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    {selected && '✓'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{c.complaintId}</span>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                        {priority.icon} {c.priority}
                      </span>
                      {c.suggested && (
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', background: '#FED7D7', color: '#C53030' }}>
                          ⚡ Recommended
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {c.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                      <span>👤 {c.officer}</span>
                      <span style={{ color: '#E53E3E', fontWeight: '700' }}>⏰ {c.reason}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {candidates.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Cases to Escalate</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>All cases are on track or already escalated.</p>
              </div>
            )}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div style={{ position: 'sticky', bottom: '20px', background: 'var(--bg-surface)', borderRadius: '14px', padding: '16px 24px', marginTop: '20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <strong>{selectedIds.length}</strong> case{selectedIds.length > 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleEscalate}
              disabled={escalating}
              style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: escalating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)', opacity: escalating ? 0.7 : 1 }}
            >
              {escalating ? '⏳ Escalating...' : '🚨 Escalate Selected'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default EscalateCases