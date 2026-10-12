import React from 'react'

const StatusTimeline = ({ timeline, currentStatus }) => {
  const statuses = [
    { key: 'submitted', label: 'Submitted', icon: '📝', color: '#4299E1' },
    { key: 'assigned', label: 'Assigned', icon: '👤', color: '#805AD5' },
    { key: 'investigating', label: 'Investigating', icon: '🔍', color: '#ED8936' },
    { key: 'in-progress', label: 'In Progress', icon: '🚧', color: '#3182CE' },
    { key: 'resolved', label: 'Resolved', icon: '✅', color: '#38A169' }
  ]

  const getCurrentIndex = () => {
    const map = {
      pending: 0,
      assigned: 1,
      investigating: 2,
      'in-progress': 3,
      resolved: 4
    }
    return map[currentStatus] ?? 0
  }

  const currentIndex = getCurrentIndex()

  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
        📅 Status Progress
      </h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 8px' }}>
        {/* Background Line */}
        <div style={{ position: 'absolute', top: '22px', left: '30px', right: '30px', height: '3px', background: '#e2e8f0', borderRadius: '2px', zIndex: 0 }}></div>

        {/* Progress Line */}
        <div style={{ position: 'absolute', top: '22px', left: '30px', height: '3px', background: `linear-gradient(90deg, ${statuses[0].color}, ${statuses[currentIndex].color})`, borderRadius: '2px', width: `calc((100% - 60px) * ${currentIndex / (statuses.length - 1)})`, transition: 'width 0.6s ease', zIndex: 1 }}></div>

        {statuses.map((s, i) => {
          const isActive = i <= currentIndex
          const isCurrent = i === currentIndex
          return (
            <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2, flex: 1 }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: isActive ? s.color : 'white',
                  color: isActive ? 'white' : '#a0aec0',
                  border: `3px solid ${isActive ? s.color : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  boxShadow: isCurrent ? `0 0 0 6px ${s.color}25` : 'none',
                  transition: 'all 0.3s ease',
                  animation: isCurrent ? 'pulse 2s ease-in-out infinite' : 'none'
                }}
              >
                {isActive && i < currentIndex ? '✓' : s.icon}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: isActive ? s.color : '#a0aec0', textAlign: 'center', whiteSpace: 'nowrap' }}>
                {s.label}
              </div>
              {timeline && timeline[i] && (
                <div style={{ fontSize: '10px', color: '#a0aec0', textAlign: 'center' }}>
                  {timeline[i].date}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 6px var(--pulse-color, rgba(255,107,53,0.15)); }
            50% { box-shadow: 0 0 0 12px var(--pulse-color, rgba(255,107,53,0.05)); }
          }
        `}
      </style>
    </div>
  )
}

export default StatusTimeline