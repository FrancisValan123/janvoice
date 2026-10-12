import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const OverdueReview = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated' },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue', badge: 5 },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [rangeFilter, setRangeFilter] = useState('all')

  const overdueCases = [
    { id: 'JV2026089', title: 'Road collapse risk on NH-45', dept: 'Public Works', officer: 'Ravi Kumar', days: 12, deadline: '2026-09-18', priority: 'emergency', citizens: 340 },
    { id: 'JV2026090', title: 'Water contamination Ward 12', dept: 'Water Supply', officer: 'Priya Sharma', days: 8, deadline: '2026-09-22', priority: 'emergency', citizens: 220 },
    { id: 'JV2026091', title: 'Illegal dumping at lake', dept: 'Sanitation', officer: 'Suresh Rajan', days: 15, deadline: '2026-09-15', priority: 'high', citizens: 180 },
    { id: 'JV2026093', title: 'Sewage overflow near school', dept: 'Sanitation', officer: 'Meena Rao', days: 9, deadline: '2026-09-21', priority: 'emergency', citizens: 450 },
    { id: 'JV2026095', title: 'Broken bridge railing', dept: 'Public Works', officer: 'Divya Menon', days: 11, deadline: '2026-09-19', priority: 'high', citizens: 260 }
  ]

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { label: 'Emergency', color: '#C53030', bg: '#FED7D7', icon: '🔴' },
      high: { label: 'High', color: '#9C4221', bg: '#FEEBC8', icon: '🟠' },
      normal: { label: 'Normal', color: '#975A16', bg: '#FEFCBF', icon: '🟡' }
    }
    return map[p] || map.normal
  }

  const getSeverity = (days) => {
    if (days >= 14) return { label: 'Critical', color: '#C53030', bg: '#FED7D7' }
    if (days >= 7) return { label: 'Severe', color: '#E53E3E', bg: '#FED7D7' }
    return { label: 'Warning', color: '#ED8936', bg: '#FEEBC8' }
  }

  let filtered = overdueCases
  if (rangeFilter === 'critical') filtered = overdueCases.filter((c) => c.days >= 14)
  else if (rangeFilter === 'severe') filtered = overdueCases.filter((c) => c.days >= 7 && c.days < 14)
  else if (rangeFilter === 'warning') filtered = overdueCases.filter((c) => c.days < 7)

  const stats = {
    total: overdueCases.length,
    critical: overdueCases.filter((c) => c.days >= 14).length,
    severe: overdueCases.filter((c) => c.days >= 7 && c.days < 14).length,
    warning: overdueCases.filter((c) => c.days < 7).length,
    avgDays: Math.round(overdueCases.reduce((s, c) => s + c.days, 0) / overdueCases.length),
    citizensAffected: overdueCases.reduce((s, c) => s + c.citizens, 0)
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Overdue Review">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #9C4221, #C05621)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>⏰ Overdue Cases Review</h2>
          <p style={{ fontSize: '14px', opacity: 0.95 }}>
            Cases that have exceeded their SLA deadline — immediate action required
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #C53030' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#C53030', lineHeight: 1, marginBottom: '4px' }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Overdue</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #E53E3E' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#E53E3E', lineHeight: 1, marginBottom: '4px' }}>{stats.critical}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Critical (14+ days)</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #ED8936' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#ED8936', lineHeight: 1, marginBottom: '4px' }}>{stats.severe}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Severe (7-14 days)</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #F7931E' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#F7931E', lineHeight: 1, marginBottom: '4px' }}>{stats.warning}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Warning (&lt;7 days)</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #805AD5' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{stats.avgDays}d</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Days Overdue</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '4px solid #4299E1' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#4299E1', lineHeight: 1, marginBottom: '4px' }}>{stats.citizensAffected}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Citizens Affected</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Overdue', count: stats.total },
            { id: 'critical', label: '🔴 Critical', count: stats.critical },
            { id: 'severe', label: '🟠 Severe', count: stats.severe },
            { id: 'warning', label: '🟡 Warning', count: stats.warning }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRangeFilter(tab.id)}
              style={{
                padding: '10px 18px',
                background: rangeFilter === tab.id ? 'linear-gradient(135deg, #C05621, #9C4221)' : 'white',
                color: rangeFilter === tab.id ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: rangeFilter === tab.id ? '0 4px 12px rgba(156, 66, 33, 0.3)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              {tab.label}
              <span style={{ background: rangeFilter === tab.id ? 'rgba(255,255,255,0.3)' : '#edf2f7', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
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
                {['ID', 'Case', 'Department', 'Officer', 'Priority', 'Days Overdue', 'Severity', 'Citizens', 'Action'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const priority = getPriorityConfig(c.priority)
                const severity = getSeverity(c.days)
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: '#1a202c' }}>{c.id}</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#1a202c', fontWeight: '600', minWidth: '220px' }}>{c.title}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>{c.dept}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#4a5568' }}>👤 {c.officer}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                        {priority.icon} {priority.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontSize: '14px', fontWeight: '800', color: '#C53030' }}>{c.days}d</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: severity.bg, color: severity.color }}>
                        {severity.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#4a5568' }}>👥 {c.citizens}</td>
                    <td style={{ padding: '14px' }}>
                      <button style={{ padding: '6px 14px', background: 'linear-gradient(135deg, #C05621, #9C4221)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Take Action
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

export default OverdueReview