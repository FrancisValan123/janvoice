import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const PerformanceMonitor = () => {
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

  const departments = [
    { name: 'Sanitation', color: '#38A169', resolved: 52, pending: 6, sla: 90, avgDays: 4.8, satisfaction: 4.7, trend: 15, rank: 1 },
    { name: 'Water Supply', color: '#4299E1', resolved: 28, pending: 4, sla: 88, avgDays: 5.1, satisfaction: 4.6, trend: 8, rank: 2 },
    { name: 'Public Works', color: '#FF6B35', resolved: 38, pending: 7, sla: 84, avgDays: 6.2, satisfaction: 4.4, trend: 12, rank: 3 },
    { name: 'Electricity', color: '#ED8936', resolved: 18, pending: 4, sla: 82, avgDays: 7.4, satisfaction: 4.2, trend: -3, rank: 4 },
    { name: 'Transport', color: '#805AD5', resolved: 12, pending: 3, sla: 80, avgDays: 8.1, satisfaction: 4.0, trend: 5, rank: 5 },
    { name: 'Health', color: '#E53E3E', resolved: 16, pending: 2, sla: 89, avgDays: 3.5, satisfaction: 4.8, trend: 10, rank: 6 }
  ]

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '🥇', color: '#FFD700' }
    if (rank === 2) return { icon: '🥈', color: '#C0C0C0' }
    if (rank === 3) return { icon: '🥉', color: '#CD7F32' }
    return { icon: `#${rank}`, color: '#a0aec0' }
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Performance Monitor">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #553C9A, #805AD5)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📈 Performance Monitor</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Compare department performance across key metrics</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)} style={{ padding: '8px 16px', background: period === p.id ? 'white' : 'transparent', color: period === p.id ? '#553C9A' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>🏆 Department Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {departments.map((d) => {
              const rank = getRankBadge(d.rank)
              return (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f7fafc', borderRadius: '12px', borderLeft: `4px solid ${d.color}` }}>
                  <div style={{ width: '48px', height: '48px', background: d.rank <= 3 ? rank.color + '30' : '#edf2f7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: d.rank <= 3 ? '24px' : '16px', fontWeight: '800', color: d.rank <= 3 ? rank.color : '#718096', flexShrink: 0 }}>
                    {rank.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#1a202c', marginBottom: '4px' }}>{d.name}</div>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#718096', flexWrap: 'wrap' }}>
                      <span>✅ {d.resolved} resolved</span>
                      <span>⏳ {d.pending} pending</span>
                      <span>⏱️ {d.avgDays}d avg</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: d.sla >= 85 ? '#38A169' : d.sla >= 75 ? '#ED8936' : '#E53E3E' }}>{d.sla}%</div>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>SLA</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#F7931E' }}>⭐ {d.satisfaction}</div>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Rating</div>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '60px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: d.trend >= 0 ? '#38A169' : '#E53E3E' }}>
                        {d.trend >= 0 ? '↑' : '↓'} {Math.abs(d.trend)}%
                      </div>
                      <div style={{ fontSize: '9px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Trend</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Metric Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* SLA Comparison */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📊 SLA Compliance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {departments.map((d) => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{d.name}</span>
                    <span style={{ fontWeight: '800', color: d.color }}>{d.sla}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${d.sla}%`, height: '100%', background: d.color, borderRadius: '4px', transition: 'width 0.6s ease' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Time */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>⏱️ Avg Resolution Time</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[...departments].sort((a, b) => a.avgDays - b.avgDays).map((d) => (
                <div key={d.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>{d.name}</span>
                    <span style={{ fontWeight: '800', color: d.avgDays <= 5 ? '#38A169' : d.avgDays <= 7 ? '#ED8936' : '#E53E3E' }}>{d.avgDays} days</span>
                  </div>
                  <div style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min((d.avgDays / 10) * 100, 100)}%`, height: '100%', background: d.avgDays <= 5 ? '#38A169' : d.avgDays <= 7 ? '#ED8936' : '#E53E3E', borderRadius: '4px', transition: 'width 0.6s ease' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PerformanceMonitor