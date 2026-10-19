import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const MonthlyStatistics = () => {
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

  const [view, setView] = useState('trend')
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/statistics')
        setMonthlyData(res.data?.statistics || [])
      } catch (err) {
        console.error('Failed to load monthly stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Calculate totals from real data
  const totals = {
    created: monthlyData.reduce((s, m) => s + (m.created || 0), 0),
    resolved: monthlyData.reduce((s, m) => s + (m.resolved || 0), 0),
    escalated: monthlyData.reduce((s, m) => s + (m.escalated || 0), 0),
    avgDays: 0,
    avgSla: 0
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Monthly Statistics">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading statistics...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Monthly Statistics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ✅ Header Banner - Fixed white text */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: '0 12px 32px rgba(45, 55, 72, 0.25)' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              📊 Monthly Statistics
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              6-month trend of complaint volume and performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'trend', label: 'Trend' },
              { id: 'table', label: 'Table' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{ padding: '8px 20px', background: view === v.id ? 'white' : 'transparent', color: view === v.id ? '#1a202c' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Statistics Available</h3>
            <p>There is no monthly data to display yet.</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '18px', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #FF6B35' }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '4px' }}>{totals.created}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Created</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '18px', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #38A169' }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{totals.resolved}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Resolved</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '18px', boxShadow: 'var(--shadow-sm)', borderTop: '4px solid #C53030' }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#C53030', lineHeight: 1, marginBottom: '4px' }}>{totals.escalated}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Escalated</div>
              </div>
            </div>

            {/* Trend Chart */}
            {view === 'trend' && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '24px' }}>📈 6-Month Complaint Trend</h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '16px', height: '320px', padding: '20px 0', borderBottom: '2px solid var(--border-light)', borderLeft: '2px solid var(--border-light)' }}>
                  {monthlyData.map((m, i) => {
                    const maxVal = Math.max(...monthlyData.map((x) => x.created || 0), 10)
                    const createdHeight = ((m.created || 0) / maxVal) * 240
                    const resolvedHeight = ((m.resolved || 0) / maxVal) * 240
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '240px' }}>
                          <div style={{ width: '24px', height: `${createdHeight}px`, background: 'linear-gradient(180deg, #FF6B35, #F7931E)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '800', color: '#FF6B35' }}>{m.created}</span>
                          </div>
                          <div style={{ width: '24px', height: `${resolvedHeight}px`, background: 'linear-gradient(180deg, #38A169, #48BB78)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '800', color: '#38A169' }}>{m.resolved}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '8px' }}>{m.month}</div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '20px', fontSize: '12px', fontWeight: '700', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #FF6B35, #F7931E)', borderRadius: '4px' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Created</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #38A169, #48BB78)', borderRadius: '4px' }}></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Resolved</span>
                  </span>
                </div>
              </div>
            )}

            {/* Table View */}
            {view === 'table' && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Month', 'Created', 'Resolved', 'Escalated', 'Resolution Rate'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border-light)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{m.month} {m.year}</td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#FF6B35' }}>{m.created}</td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#38A169' }}>{m.resolved}</td>
                        <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#C53030' }}>{m.escalated}</td>
                        <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {m.created > 0 ? Math.round((m.resolved / m.created) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MonthlyStatistics