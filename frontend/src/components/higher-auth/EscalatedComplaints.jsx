import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const EscalatedComplaints = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated', badge: 12 },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue', badge: 5 },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('severity')

  const [escalated] = useState([
    { id: 'JV2026089', title: 'Road collapse risk on NH-45', dept: 'Public Works', officer: 'Ravi Kumar', days: 12, severity: 'critical', reason: 'Overdue by 12 days', citizens: 340, status: 'pending-review' },
    { id: 'JV2026090', title: 'Water contamination Ward 12', dept: 'Water Supply', officer: 'Priya Sharma', days: 8, severity: 'critical', reason: 'Public health risk', citizens: 220, status: 'under-review' },
    { id: 'JV2026091', title: 'Illegal dumping at lake', dept: 'Sanitation', officer: 'Suresh Rajan', days: 15, severity: 'critical', reason: 'Environmental hazard', citizens: 180, status: 'pending-review' },
    { id: 'JV2026092', title: 'Streetlight outage main road', dept: 'Electricity', officer: 'Anand Verma', days: 6, severity: 'high', reason: 'Safety concern', citizens: 95, status: 'action-taken' },
    { id: 'JV2026093', title: 'Sewage overflow near school', dept: 'Sanitation', officer: 'Meena Rao', days: 9, severity: 'critical', reason: 'Health emergency', citizens: 450, status: 'pending-review' },
    { id: 'JV2026094', title: 'Broken footpath near bus stop', dept: 'Public Works', officer: 'Divya Menon', days: 7, severity: 'high', reason: 'Citizen complaint escalation', citizens: 120, status: 'action-taken' }
  ])

  const getSeverityConfig = (sev) => {
    const map = {
      critical: { label: 'Critical', color: '#C53030', bg: '#FED7D7', icon: '🔴' },
      high: { label: 'High', color: '#9C4221', bg: '#FEEBC8', icon: '🟠' },
      medium: { label: 'Medium', color: '#975A16', bg: '#FEFCBF', icon: '🟡' }
    }
    return map[sev] || map.medium
  }

  const getStatusConfig = (status) => {
    const map = {
      'pending-review': { label: 'Pending Review', color: '#E53E3E', bg: '#FED7D7' },
      'under-review': { label: 'Under Review', color: '#ED8936', bg: '#FEEBC8' },
      'action-taken': { label: 'Action Taken', color: '#38A169', bg: '#C6F6D5' }
    }
    return map[status] || map['pending-review']
  }

  const counts = {
    all: escalated.length,
    critical: escalated.filter((e) => e.severity === 'critical').length,
    high: escalated.filter((e) => e.severity === 'high').length,
    pending: escalated.filter((e) => e.status === 'pending-review').length,
    action: escalated.filter((e) => e.status === 'action-taken').length
  }

  let filtered = filter === 'all' ? escalated : escalated.filter((e) => e.severity === filter || e.status === filter)
  if (sortBy === 'severity') {
    const order = { critical: 0, high: 1, medium: 2 }
    filtered = [...filtered].sort((a, b) => order[a.severity] - order[b.severity])
  } else if (sortBy === 'days') {
    filtered = [...filtered].sort((a, b) => b.days - a.days)
  } else if (sortBy === 'citizens') {
    filtered = [...filtered].sort((a, b) => b.citizens - a.citizens)
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Escalated Complaints">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>🚨 Escalated Complaints</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Review and take action on cases escalated from department admins
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Escalated', value: counts.all, color: '#E53E3E' },
            { label: 'Critical', value: counts.critical, color: '#C53030' },
            { label: 'High Priority', value: counts.high, color: '#F7931E' },
            { label: 'Pending Review', value: counts.pending, color: '#ED8936' },
            { label: 'Action Taken', value: counts.action, color: '#38A169' }
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '26px', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'critical', label: '🔴 Critical' },
              { id: 'high', label: '🟠 High' },
              { id: 'pending-review', label: '⏳ Pending' },
              { id: 'action-taken', label: '✅ Action Taken' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '9px 16px',
                  background: filter === tab.id ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : '#f7fafc',
                  color: filter === tab.id ? 'white' : '#4a5568',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            <option value="severity">Sort: Severity</option>
            <option value="days">Sort: Most Overdue</option>
            <option value="citizens">Sort: Most Affected</option>
          </select>
        </div>

        {/* Cases */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((c) => {
            const sev = getSeverityConfig(c.severity)
            const status = getStatusConfig(c.status)
            return (
              <div key={c.id} style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `5px solid ${sev.color}`, display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{c.id}</span>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: sev.bg, color: sev.color }}>
                      {sev.icon} {sev.label}
                    </span>
                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a202c', marginBottom: '10px' }}>{c.title}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#718096' }}>🏛️ <strong style={{ color: '#2d3748' }}>{c.dept}</strong></div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>👤 <strong style={{ color: '#2d3748' }}>{c.officer}</strong></div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>👥 <strong style={{ color: '#2d3748' }}>{c.citizens} affected</strong></div>
                    <div style={{ fontSize: '12px', color: '#C53030' }}>⏰ <strong>Overdue {c.days} days</strong></div>
                  </div>

                  <div style={{ padding: '10px 14px', background: '#FFF5F5', borderLeft: '3px solid #E53E3E', borderRadius: '6px', fontSize: '12px', color: '#9B2C2C', fontWeight: '600' }}>
                    ⚠️ Reason: {c.reason}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                  <button style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)' }}>
                    🚨 Take Action
                  </button>
                  <button style={{ padding: '10px 18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
                    👁️ View Details
                  </button>
                  <button style={{ padding: '10px 18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
                    📞 Contact Officer
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscalatedComplaints