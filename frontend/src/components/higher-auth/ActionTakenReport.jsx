import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const ActionTakenReport = () => {
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

  const [period, setPeriod] = useState('month')

  const reports = [
    { id: 'JV2026089', title: 'Road collapse risk on NH-45', dept: 'Public Works', officer: 'Ravi Kumar', action: 'Approved emergency budget', actionBy: 'Authority', date: '2026-09-28', status: 'resolved', impact: 'High' },
    { id: 'JV2026090', title: 'Water contamination Ward 12', dept: 'Water Supply', officer: 'Priya Sharma', action: 'Issued directive to dept head', actionBy: 'Authority', date: '2026-09-27', status: 'in-progress', impact: 'Critical' },
    { id: 'JV2026091', title: 'Illegal dumping at lake', dept: 'Sanitation', officer: 'Suresh Rajan', action: 'Transferred case to new officer', actionBy: 'Authority', date: '2026-09-26', status: 'in-progress', impact: 'High' },
    { id: 'JV2026092', title: 'Streetlight outage main road', dept: 'Electricity', officer: 'Anand Verma', action: 'Escalated to state level', actionBy: 'Authority', date: '2026-09-25', status: 'escalated', impact: 'Medium' },
    { id: 'JV2026093', title: 'Sewage overflow near school', dept: 'Sanitation', officer: 'Meena Rao', action: 'Immediate cleanup ordered', actionBy: 'Authority', date: '2026-09-24', status: 'resolved', impact: 'Critical' },
    { id: 'JV2026094', title: 'Broken footpath near bus stop', dept: 'Public Works', officer: 'Divya Menon', action: 'Approved repair budget', actionBy: 'Authority', date: '2026-09-23', status: 'in-progress', impact: 'Medium' },
    { id: 'JV2026095', title: 'Broken bridge railing', dept: 'Public Works', officer: 'Divya Menon', action: 'Closed case — out of scope', actionBy: 'Authority', date: '2026-09-22', status: 'closed', impact: 'High' }
  ]

  const getStatusConfig = (status) => {
    const map = {
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' },
      closed: { label: 'Closed', color: '#718096', bg: '#EDF2F7', icon: '🔒' }
    }
    return map[status] || map['in-progress']
  }

  const getImpactConfig = (impact) => {
    const map = {
      Critical: { color: '#C53030', bg: '#FED7D7' },
      High: { color: '#9C4221', bg: '#FEEBC8' },
      Medium: { color: '#975A16', bg: '#FEFCBF' },
      Low: { color: '#2C5282', bg: '#BEE3F8' }
    }
    return map[impact] || map.Medium
  }

  const stats = {
    total: reports.length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
    escalated: reports.filter((r) => r.status === 'escalated').length,
    critical: reports.filter((r) => r.impact === 'Critical').length
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Action Taken Report">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📄 Action Taken Report</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              Complete log of all actions taken on escalated cases
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 16px',
                  background: period === p ? 'white' : 'transparent',
                  color: period === p ? '#2C5282' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Actions', value: stats.total, color: '#4299E1' },
            { label: 'Resolved', value: stats.resolved, color: '#38A169' },
            { label: 'In Progress', value: stats.inProgress, color: '#3182CE' },
            { label: 'Escalated Further', value: stats.escalated, color: '#C53030' },
            { label: 'Critical Impact', value: stats.critical, color: '#9C4221' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)' }}>
            📥 Export PDF
          </button>
          <button style={{ padding: '12px 24px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
            📊 Export CSV
          </button>
          <button style={{ padding: '12px 24px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
            📧 Email Report
          </button>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
            📋 Action Log ({reports.length} actions)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Case ID', 'Title', 'Department', 'Action Taken', 'Impact', 'Date', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => {
                const status = getStatusConfig(r.status)
                const impact = getImpactConfig(r.impact)
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: '#1a202c' }}>{r.id}</td>
                    <td style={{ padding: '14px', fontSize: '13px', color: '#1a202c', fontWeight: '600', minWidth: '200px' }}>{r.title}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>{r.dept}</td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#2d3748', maxWidth: '240px' }}>
                      <div style={{ fontWeight: '700', marginBottom: '2px' }}>{r.action}</div>
                      <div style={{ fontSize: '11px', color: '#a0aec0' }}>by {r.actionBy}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: impact.bg, color: impact.color }}>
                        {r.impact}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>{r.date}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color, whiteSpace: 'nowrap' }}>
                        {status.icon} {status.label}
                      </span>
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

export default ActionTakenReport