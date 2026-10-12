import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

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

  const monthlyData = [
    { month: 'Apr', created: 180, resolved: 165, escalated: 8, avgDays: 6.8, sla: 78 },
    { month: 'May', created: 195, resolved: 178, escalated: 9, avgDays: 6.5, sla: 80 },
    { month: 'Jun', created: 210, resolved: 195, escalated: 10, avgDays: 6.2, sla: 82 },
    { month: 'Jul', created: 225, resolved: 210, escalated: 11, avgDays: 6.0, sla: 84 },
    { month: 'Aug', created: 240, resolved: 228, escalated: 12, avgDays: 5.8, sla: 85 },
    { month: 'Sep', created: 235, resolved: 232, escalated: 12, avgDays: 5.5, sla: 86 }
  ]

  const totals = {
    created: monthlyData.reduce((s, m) => s + m.created, 0),
    resolved: monthlyData.reduce((s, m) => s + m.resolved, 0),
    escalated: monthlyData.reduce((s, m) => s + m.escalated, 0),
    avgDays: (monthlyData.reduce((s, m) => s + m.avgDays, 0) / monthlyData.length).toFixed(1),
    avgSla: Math.round(monthlyData.reduce((s, m) => s + m.sla, 0) / monthlyData.length)
  }

  const growth = ((monthlyData[5].created - monthlyData[0].created) / monthlyData[0].created * 100).toFixed(1)
  const slaGrowth = monthlyData[5].sla - monthlyData[0].sla
  const daysImprovement = (monthlyData[0].avgDays - monthlyData[5].avgDays).toFixed(1)

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Monthly Statistics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📊 Monthly Statistics</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>6-month trend of complaint volume and performance</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'trend', label: 'Trend' },
              { id: 'table', label: 'Table' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  padding: '8px 20px',
                  background: view === v.id ? 'white' : 'transparent',
                  color: view === v.id ? '#1a202c' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #FF6B35' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '4px' }}>{totals.created}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Created</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '800', marginTop: '6px' }}>↑ {growth}% in 6 months</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #38A169' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{totals.resolved}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Resolved</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '800', marginTop: '6px' }}>{Math.round(totals.resolved / totals.created * 100)}% resolution rate</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #C53030' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#C53030', lineHeight: 1, marginBottom: '4px' }}>{totals.escalated}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Escalated</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #4299E1' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#4299E1', lineHeight: 1, marginBottom: '4px' }}>{totals.avgDays}d</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Resolution</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '800', marginTop: '6px' }}>↓ {daysImprovement}d improvement</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '4px solid #805AD5' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{totals.avgSla}%</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg SLA</div>
            <div style={{ fontSize: '11px', color: '#38A169', fontWeight: '800', marginTop: '6px' }}>↑ {slaGrowth} points growth</div>
          </div>
        </div>

        {/* Chart View */}
        {view === 'trend' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📈 6-Month Complaint Trend</h3>

            {/* Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '16px', height: '320px', padding: '20px 0', borderBottom: '2px solid #e2e8f0', borderLeft: '2px solid #e2e8f0' }}>
              {monthlyData.map((m, i) => {
                const maxVal = Math.max(...monthlyData.map((x) => x.created), 250)
                const createdHeight = (m.created / maxVal) * 240
                const resolvedHeight = (m.resolved / maxVal) * 240
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '240px' }}>
                      <div
                        title={`Created: ${m.created}`}
                        style={{
                          width: '24px',
                          height: `${createdHeight}px`,
                          background: 'linear-gradient(180deg, #FF6B35, #F7931E)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.6s ease',
                          position: 'relative'
                        }}
                      >
                        <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '800', color: '#FF6B35' }}>{m.created}</span>
                      </div>
                      <div
                        title={`Resolved: ${m.resolved}`}
                        style={{
                          width: '24px',
                          height: `${resolvedHeight}px`,
                          background: 'linear-gradient(180deg, #38A169, #48BB78)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.6s ease',
                          position: 'relative'
                        }}
                      >
                        <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '800', color: '#38A169' }}>{m.resolved}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', marginTop: '8px' }}>{m.month}</div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '20px', fontSize: '12px', fontWeight: '700', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #FF6B35, #F7931E)', borderRadius: '4px' }}></span>
                <span style={{ color: '#4a5568' }}>Created</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', background: 'linear-gradient(180deg, #38A169, #48BB78)', borderRadius: '4px' }}></span>
                <span style={{ color: '#4a5568' }}>Resolved</span>
              </span>
            </div>
          </div>
        )}

        {/* SLA Trend */}
        {view === 'trend' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📊 SLA Compliance & Resolution Time Trend</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {monthlyData.map((m) => (
                <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#f7fafc', borderRadius: '10px' }}>
                  <div style={{ width: '50px', fontSize: '14px', fontWeight: '800', color: '#1a202c', flexShrink: 0 }}>{m.month}</div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                      <span style={{ color: '#718096' }}>SLA: {m.sla}%</span>
                      <span style={{ color: '#718096' }}>Avg: {m.avgDays}d</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${m.sla}%`, height: '100%', background: m.sla >= 85 ? '#38A169' : m.sla >= 80 ? '#ED8936' : '#E53E3E', borderRadius: '4px' }}></div>
                      </div>
                      <div style={{ flex: 1, height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${100 - (m.avgDays / 10) * 100}%`, height: '100%', background: '#4299E1', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '80px', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#38A169' }}>{m.sla}%</div>
                    <div style={{ fontSize: '10px', color: '#718096' }}>SLA</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Month', 'Created', 'Resolved', 'Escalated', 'Avg Days', 'SLA', 'Resolution Rate'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((m) => (
                  <tr key={m.month} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '800', color: '#1a202c' }}>{m.month} 2026</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#FF6B35' }}>{m.created}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#38A169' }}>{m.resolved}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#C53030' }}>{m.escalated}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#4299E1' }}>{m.avgDays}d</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', background: m.sla >= 85 ? '#C6F6D5' : m.sla >= 80 ? '#FEEBC8' : '#FED7D7', color: m.sla >= 85 ? '#276749' : m.sla >= 80 ? '#9C4221' : '#9B2C2C' }}>
                        {m.sla}%
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: '#4a5568' }}>
                      {Math.round((m.resolved / m.created) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MonthlyStatistics