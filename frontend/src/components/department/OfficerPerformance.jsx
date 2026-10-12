import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const OfficerPerformance = () => {
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

  const [sortBy, setSortBy] = useState('resolved')
  const [search, setSearch] = useState('')

  const officers = [
    { id: 1, name: 'Priya Sharma', dept: 'Water Supply', zone: 'Central', total: 42, resolved: 40, avgDays: 3.2, rating: 4.9, sla: 95, status: 'active' },
    { id: 2, name: 'Ravi Kumar', dept: 'Public Works', zone: 'North', total: 48, resolved: 45, avgDays: 4.1, rating: 4.8, sla: 92, status: 'active' },
    { id: 3, name: 'Meena Rao', dept: 'Sanitation', zone: 'Central', total: 38, resolved: 35, avgDays: 4.5, rating: 4.7, sla: 90, status: 'active' },
    { id: 4, name: 'Anand Verma', dept: 'Electricity', zone: 'West', total: 28, resolved: 25, avgDays: 5.2, rating: 4.6, sla: 88, status: 'active' },
    { id: 5, name: 'Suresh Rajan', dept: 'Public Works', zone: 'South', total: 45, resolved: 38, avgDays: 5.8, rating: 4.5, sla: 82, status: 'active' },
    { id: 6, name: 'Lakshmi Narayan', dept: 'Health', zone: 'East', total: 22, resolved: 21, avgDays: 3.5, rating: 4.8, sla: 93, status: 'active' },
    { id: 7, name: 'Karthik Iyer', dept: 'Transport', zone: 'North', total: 18, resolved: 15, avgDays: 6.1, rating: 4.2, sla: 78, status: 'active' },
    { id: 8, name: 'Divya Menon', dept: 'Sanitation', zone: 'South', total: 32, resolved: 30, avgDays: 4.0, rating: 4.7, sla: 91, status: 'inactive' }
  ]

  const filtered = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.dept.toLowerCase().includes(search.toLowerCase()) ||
      o.zone.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'resolved') return b.resolved - a.resolved
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'sla') return b.sla - a.sla
    if (sortBy === 'avgDays') return a.avgDays - b.avgDays
    return 0
  })

  const topPerformers = [...officers]
    .filter((o) => o.status === 'active')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  const getInitials = (name) => name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Officer Performance">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>👨‍💼 Officer Performance</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Track and compare officer efficiency and ratings</p>
        </div>

        {/* Top Performers */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>🏆 Top Performers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {topPerformers.map((o, i) => (
              <div key={o.id} style={{ background: i === 0 ? 'linear-gradient(135deg, #FFF5F0, #FFE8D6)' : '#f7fafc', borderRadius: '12px', padding: '20px', border: i === 0 ? '2px solid #FF6B35' : '2px solid transparent', position: 'relative' }}>
                {i === 0 && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px' }}>
                    🥇 TOP
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                    {getInitials(o.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</div>
                    <div style={{ fontSize: '11px', color: '#718096' }}>{o.dept} • {o.zone}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#38A169' }}>{o.resolved}</div>
                    <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700' }}>Resolved</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#F7931E' }}>⭐ {o.rating}</div>
                    <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700' }}>Rating</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#4299E1' }}>{o.sla}%</div>
                    <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700' }}>SLA</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '0 12px' }}>
            <span style={{ fontSize: '15px', opacity: 0.6 }}>🔍</span>
            <input type="text" placeholder="Search officers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '11px 0', border: 'none', background: 'transparent', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '11px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', background: 'white', fontSize: '13px', fontWeight: '600', color: '#2d3748', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <option value="resolved">Sort: Most Resolved</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="sla">Sort: Best SLA</option>
            <option value="avgDays">Sort: Fastest</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Officer', 'Department', 'Zone', 'Total', 'Resolved', 'Avg Days', 'Rating', 'SLA', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: '#a0aec0' }}>#{i + 1}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #805AD5, #6B46C1)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>
                        {getInitials(o.name)}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', whiteSpace: 'nowrap' }}>{o.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>{o.dept}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>📍 {o.zone}</td>
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{o.total}</td>
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#38A169' }}>{o.resolved}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#4299E1', fontWeight: '700' }}>{o.avgDays}d</td>
                  <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: '#F7931E' }}>⭐ {o.rating}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${o.sla}%`, height: '100%', background: o.sla >= 90 ? '#38A169' : o.sla >= 80 ? '#ED8936' : '#E53E3E' }}></div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: o.sla >= 90 ? '#38A169' : o.sla >= 80 ? '#ED8936' : '#E53E3E' }}>{o.sla}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: o.status === 'active' ? '#c6f6d5' : '#fed7d7', color: o.status === 'active' ? '#276749' : '#9b2c2c' }}>
                      {o.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OfficerPerformance