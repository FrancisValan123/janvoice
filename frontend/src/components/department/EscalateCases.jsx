import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

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

  const [candidates, setCandidates] = useState([
    { id: 'JV2026089', title: 'Road collapse risk on NH-45', priority: 'emergency', officer: 'Ravi Kumar', days: 12, reason: 'Overdue by 12 days', suggested: true },
    { id: 'JV2026090', title: 'Water contamination Ward 12', priority: 'emergency', officer: 'Priya Sharma', days: 8, reason: 'No response in 48 hours', suggested: true },
    { id: 'JV2026091', title: 'Illegal dumping at lake', priority: 'high', officer: 'Suresh Rajan', days: 15, reason: 'Overdue by 15 days', suggested: true },
    { id: 'JV2026092', title: 'Streetlight outage main road', priority: 'high', officer: 'Anand Verma', days: 6, reason: 'Officer requested reassignment', suggested: false },
    { id: 'JV2026093', title: 'Pothole repair MG Road', priority: 'normal', officer: 'Meena Rao', days: 3, reason: 'Escalation requested by citizen', suggested: false }
  ])

  const [selectedIds, setSelectedIds] = useState([])
  const [success, setSuccess] = useState(false)

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleEscalate = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one case')
      return
    }
    setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
    setSuccess(true)
    setSelectedIds([])
    setTimeout(() => setSuccess(false), 3000)
  }

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', color: '#E53E3E', bg: '#FED7D7' },
      high: { icon: '🟠', color: '#F7931E', bg: '#FEEBC8' },
      normal: { icon: '🟡', color: '#ECC94B', bg: '#FEFCBF' }
    }
    return map[p] || map.normal
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Cases">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {success && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#C53030', color: 'white', padding: '14px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.3)', zIndex: 1000 }}>
            🚨 Cases escalated to higher authority!
          </div>
        )}

        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
            🚨 Escalate Cases
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.95 }}>
            Escalate problematic cases to higher authority for intervention
          </p>
        </div>

        {/* Info */}
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

        {/* Cases */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
              📋 Cases Requiring Escalation ({candidates.length})
            </h3>
            {candidates.length > 0 && (
              <button
                onClick={() => setSelectedIds(candidates.map((c) => c.id))}
                style={{ padding: '8px 16px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Select All
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {candidates.map((c) => {
              const priority = getPriorityConfig(c.priority)
              const selected = selectedIds.includes(c.id)
              return (
                <div
                  key={c.id}
                  onClick={() => toggleSelect(c.id)}
                  style={{
                    padding: '16px',
                    background: selected ? '#FFF5F5' : '#f7fafc',
                    border: selected ? '2px solid #E53E3E' : '2px solid transparent',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', border: selected ? 'none' : '2px solid #cbd5e0', background: selected ? '#E53E3E' : 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    {selected && '✓'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{c.id}</span>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                        {priority.icon} {c.priority}
                      </span>
                      {c.suggested && (
                        <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', background: '#FED7D7', color: '#C53030' }}>
                          ⚡ Recommended
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '6px' }}>
                      {c.title}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096', flexWrap: 'wrap' }}>
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
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>No Cases to Escalate</h3>
                <p style={{ fontSize: '14px', color: '#718096' }}>All cases are on track.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        {selectedIds.length > 0 && (
          <div style={{ position: 'sticky', bottom: '20px', background: 'white', borderRadius: '14px', padding: '16px 24px', marginTop: '20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: '#4a5568', fontWeight: '600' }}>
              <strong>{selectedIds.length}</strong> case{selectedIds.length > 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleEscalate}
              style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)' }}
            >
              🚨 Escalate Selected
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default EscalateCases