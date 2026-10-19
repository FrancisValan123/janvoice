import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

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
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/performance')
        // Backend returns { officers: [...] } or { departments: [...] }
        const rawData = res.data?.officers || res.data?.departments || []
        
        // Map and sort by SLA descending (highest performance first)
        const formatted = rawData.map((d, index) => ({
          id: d._id || index,
          name: d.department || d.name || 'Unknown Dept',
          color: ['#FF6B35', '#4299E1', '#38A169', '#ED8936', '#805AD5', '#E53E3E'][index % 6],
          resolved: d.resolved || 0,
          pending: d.pending || 0,
          sla: d.sla || 0,
          avgDays: d.avgDays || 0,
          rating: d.rating || 4.0, // Backend doesn't have ratings yet, fallback to 4.0
          trend: d.trend || 0
        })).sort((a, b) => b.sla - a.sla)

        // Add rank based on sorted order
        formatted.forEach((d, i) => { d.rank = i + 1 })

        setDepartments(formatted)
      } catch (err) {
        console.error('Failed to load performance:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPerformance()
  }, [period])

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '🥇', color: '#FFD700' }
    if (rank === 2) return { icon: '🥈', color: '#C0C0C0' }
    if (rank === 3) return { icon: '🥉', color: '#CD7F32' }
    return { icon: `#${rank}`, color: '#a0aec0' }
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Performance Monitor">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading performance data...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Performance Monitor">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Banner - ✅ Fixed white text */}
        <div style={{ background: 'linear-gradient(135deg, #553C9A, #805AD5)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: '0 12px 32px rgba(128, 90, 213, 0.25)' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              📈 Performance Monitor
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              Compare department performance across key metrics
            </p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{ padding: '8px 16px', background: period === p ? 'white' : 'transparent', color: period === p ? '#553C9A' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>🏆 Department Leaderboard</h3>
          
          {departments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <p>No performance data available yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {departments.map((d) => {
                const rank = getRankBadge(d.rank)
                return (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '12px', borderLeft: `4px solid ${d.color}` }}>
                    <div style={{ width: '48px', height: '48px', background: d.rank <= 3 ? rank.color + '30' : 'var(--bg-surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: d.rank <= 3 ? '24px' : '16px', fontWeight: '800', color: d.rank <= 3 ? rank.color : 'var(--text-tertiary)', flexShrink: 0 }}>
                      {rank.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{d.name}</div>
                      <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                        <span>✅ {d.resolved} resolved</span>
                        <span>⏳ {d.pending} pending</span>
                        <span>⏱️ {d.avgDays}d avg</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: d.sla >= 85 ? '#38A169' : d.sla >= 75 ? '#ED8936' : '#E53E3E' }}>{d.sla}%</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>SLA</div>
                      </div>
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#F7931E' }}>⭐ {d.rating}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Rating</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Metric Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📊 SLA Compliance</h3>
            {departments.map((d) => (
              <div key={d.name} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span style={{ fontWeight: '800', color: d.color }}>{d.sla}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.sla}%`, height: '100%', background: d.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>⏱️ Avg Resolution Time</h3>
            {[...departments].sort((a, b) => a.avgDays - b.avgDays).map((d) => (
              <div key={d.name} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span style={{ fontWeight: '800', color: d.avgDays <= 5 ? '#38A169' : d.avgDays <= 7 ? '#ED8936' : '#E53E3E' }}>{d.avgDays} days</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-surface-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((d.avgDays / 10) * 100, 100)}%`, height: '100%', background: d.avgDays <= 5 ? '#38A169' : d.avgDays <= 7 ? '#ED8936' : '#E53E3E', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default PerformanceMonitor