import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const MonitorDeadlines = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines', badge: 5 },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' },
    { icon: '📄', label: 'SLA Reports', path: '/department/sla' },
    { icon: '👨‍💼', label: 'Officer Performance', path: '/department/officers' },
    { icon: '⚙️', label: 'Settings', path: '/department/settings' }
  ]

  const [filter, setFilter] = useState('all')

  const [cases] = useState([
    { id: 'JV2026089', title: 'Road collapse risk on NH-45', priority: 'emergency', officer: 'Ravi Kumar', due: '2 hours', hoursLeft: 2, status: 'critical' },
    { id: 'JV2026090', title: 'Water contamination Ward 12', priority: 'emergency', officer: 'Priya Sharma', due: '4 hours', hoursLeft: 4, status: 'critical' },
    { id: 'JV2026091', title: 'Illegal dumping at lake', priority: 'high', officer: 'Suresh Rajan', due: '12 hours', hoursLeft: 12, status: 'warning' },
    { id: 'JV2026092', title: 'Streetlight outage main road', priority: 'high', officer: 'Anand Verma', due: '20 hours', hoursLeft: 20, status: 'warning' },
    { id: 'JV2026093', title: 'Pothole repair MG Road', priority: 'normal', officer: 'Meena Rao', due: '36 hours', hoursLeft: 36, status: 'ok' },
    { id: 'JV2026094', title: 'Water supply disruption', priority: 'normal', officer: 'Priya Sharma', due: '48 hours', hoursLeft: 48, status: 'ok' },
    { id: 'JV2026088', title: 'Drainage blockage', priority: 'high', officer: 'Ravi Kumar', due: '-6 hours', hoursLeft: -6, status: 'overdue' }
  ])

  const getStatusConfig = (status) => {
    const map = {
      critical: { color: '#E53E3E', bg: '#FED7D7', label: 'Critical', icon: '🚨' },
      warning: { color: '#ED8936', bg: '#FEEBC8', label: 'Warning', icon: '⚠️' },
      ok: { color: '#38A169', bg: '#C6F6D5', label: 'On Time', icon: '✅' },
      overdue: { color: '#C53030', bg: '#FED7D7', label: 'Overdue', icon: '🔴' }
    }
    return map[status] || map.ok
  }

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', color: '#E53E3E' },
      high: { icon: '🟠', color: '#F7931E' },
      normal: { icon: '🟡', color: '#ECC94B' },
      low: { icon: '🔵', color: '#4299E1' }
    }
    return map[p] || map.normal
  }

  const counts = {
    all: cases.length,
    critical: cases.filter((c) => c.status === 'critical').length,
    warning: cases.filter((c) => c.status === 'warning').length,
    overdue: cases.filter((c) => c.status === 'overdue').length,
    ok: cases.filter((c) => c.status === 'ok').length
  }

  const filtered = filter === 'all' ? cases : cases.filter((c) => c.status === filter)

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Monitor Deadlines">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', boxShadow: '0 8px 24px rgba(197, 48, 48, 0.2)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
            ⏰ Monitor Deadlines
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.95 }}>
            Track SLA compliance and identify cases at risk of breaching deadlines
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #C53030' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#C53030', lineHeight: 1, marginBottom: '4px' }}>{counts.overdue}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Overdue</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #E53E3E' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#E53E3E', lineHeight: 1, marginBottom: '4px' }}>{counts.critical}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Critical</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #ED8936' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#ED8936', lineHeight: 1, marginBottom: '4px' }}>{counts.warning}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Warning</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #38A169' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{counts.ok}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>On Time</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Cases', count: counts.all },
            { id: 'overdue', label: '🔴 Overdue', count: counts.overdue },
            { id: 'critical', label: '🚨 Critical', count: counts.critical },
            { id: 'warning', label: '⚠️ Warning', count: counts.warning },
            { id: 'ok', label: '✅ On Time', count: counts.ok }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '10px 18px',
                background: filter === tab.id ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'white',
                color: filter === tab.id ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: filter === tab.id ? '0 4px 12px rgba(255, 107, 53, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {tab.label}
              <span style={{ background: filter === tab.id ? 'rgba(255,255,255,0.3)' : '#edf2f7', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cases Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'Case', 'Priority', 'Officer', 'Due In', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const priority = getPriorityConfig(c.priority)
                const status = getStatusConfig(c.status)
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: '#1a202c' }}>{c.id}</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#1a202c', fontWeight: '600', minWidth: '200px' }}>{c.title}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: priority.color, fontWeight: '700' }}>{priority.icon} {c.priority}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#4a5568' }}>👤 {c.officer}</td>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: c.hoursLeft < 0 ? '#E53E3E' : c.hoursLeft < 24 ? '#ED8936' : '#38A169' }}>
                      ⏰ {c.due}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '5px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color, whiteSpace: 'nowrap' }}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button style={{ padding: '6px 12px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer', fontFamily: 'inherit' }}>
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MonitorDeadlines