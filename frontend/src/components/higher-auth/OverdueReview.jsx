import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const OverdueReview = () => {
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

  const [overdueCases, setOverdueCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [rangeFilter, setRangeFilter] = useState('all')

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchOverdue = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/overdue')
        setOverdueCases(res.data?.cases || [])
      } catch (err) {
        console.error('Failed to load overdue cases:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverdue()
  }, [])

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

  // Filter based on days overdue
  let filtered = overdueCases
  if (rangeFilter === 'critical') filtered = overdueCases.filter((c) => (c.daysOverdue || 0) >= 14)
  else if (rangeFilter === 'severe') filtered = overdueCases.filter((c) => (c.daysOverdue || 0) >= 7 && (c.daysOverdue || 0) < 14)
  else if (rangeFilter === 'warning') filtered = overdueCases.filter((c) => (c.daysOverdue || 0) < 7)

  const stats = {
    total: overdueCases.length,
    critical: overdueCases.filter((c) => (c.daysOverdue || 0) >= 14).length,
    severe: overdueCases.filter((c) => (c.daysOverdue || 0) >= 7 && (c.daysOverdue || 0) < 14).length,
    warning: overdueCases.filter((c) => (c.daysOverdue || 0) < 7).length,
    avgDays: overdueCases.length > 0 
      ? Math.round(overdueCases.reduce((s, c) => s + (c.daysOverdue || 0), 0) / overdueCases.length)
      : 0,
    citizensAffected: overdueCases.reduce((s, c) => s + (c.affectedPeople || 1), 0)
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Overdue Review">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading overdue cases...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Overdue Review">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ✅ Header Banner - Fixed white text */}
        <div style={{ background: 'linear-gradient(135deg, #9C4221, #C05621)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(156, 66, 33, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            ⏰ Overdue Cases Review
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Cases that have exceeded their SLA deadline — immediate action required
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #C53030' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#C53030', lineHeight: 1, marginBottom: '4px' }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Overdue</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #E53E3E' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#E53E3E', lineHeight: 1, marginBottom: '4px' }}>{stats.critical}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Critical (14+ days)</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #ED8936' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#ED8936', lineHeight: 1, marginBottom: '4px' }}>{stats.severe}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Severe (7-14 days)</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #F7931E' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#F7931E', lineHeight: 1, marginBottom: '4px' }}>{stats.warning}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Warning (&lt;7 days)</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #805AD5' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{stats.avgDays}d</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Days Overdue</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #4299E1' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#4299E1', lineHeight: 1, marginBottom: '4px' }}>{stats.citizensAffected}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Citizens Affected</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                padding: '10px 18px', background: rangeFilter === tab.id ? 'linear-gradient(135deg, #C05621, #9C4221)' : 'var(--bg-surface)', color: rangeFilter === tab.id ? 'white' : 'var(--text-secondary)',
                border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: rangeFilter === tab.id ? '0 4px 12px rgba(156, 66, 33, 0.3)' : 'var(--shadow-sm)'
              }}
            >
              {tab.label}
              <span style={{ background: rangeFilter === tab.id ? 'rgba(255,255,255,0.3)' : 'var(--bg-surface-secondary)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto', minHeight: '300px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Overdue Cases</h3>
              <p>All cases are currently within their SLA deadlines.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'Case', 'Department', 'Officer', 'Priority', 'Days Overdue', 'Severity', 'Citizens', 'Action'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border-light)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const priority = getPriorityConfig(c.priority)
                  const severity = getSeverity(c.daysOverdue || 0)
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{c.complaintId || c._id}</td>
                      <td style={{ padding: '14px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', minWidth: '220px' }}>{c.title}</td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-tertiary)' }}>{c.department}</td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>👤 {c.assignedTo?.name || 'Unassigned'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                          {priority.icon} {priority.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontSize: '14px', fontWeight: '800', color: '#C53030' }}>{c.daysOverdue || 0}d</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: severity.bg, color: severity.color }}>
                          {severity.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>👥 {c.affectedPeople || 1}</td>
                      <td style={{ padding: '14px' }}>
                        <button style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #C05621, #9C4221)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Take Action
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OverdueReview