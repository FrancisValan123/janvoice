import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ComplaintAnalytics = () => {
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

  const [range, setRange] = useState('30d')
  const [loading, setLoading] = useState(true)
  
  // Real data state (Starts at 0, not mock numbers)
  const [kpis, setKpis] = useState({ 
    total: 0, 
    resolved: 0, 
    pending: 0, 
    emergency: 0,
    avgResolution: 0, 
    sla: 0, 
    satisfaction: 0 
  })
  const [trendData, setTrendData] = useState([])
  const [byCategory, setByCategory] = useState([])
  const [byPriority, setByPriority] = useState([])

  // ===================================
  // FETCH REAL DATA FROM BACKEND
  // ===================================
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/analytics/overview?range=${range}`)
        const data = response.data

        if (data.success) {
          // 1. Map the exact keys returned by your backend
          setKpis({
            total: data.kpis.totalComplaints || 0,
            resolved: data.kpis.resolvedComplaints || 0,
            pending: data.kpis.pendingComplaints || 0,
            emergency: data.kpis.emergencyComplaints || 0,
            avgResolution: data.kpis.avgResolutionDays || 0,
            sla: data.kpis.resolutionRate || 0,
            satisfaction: 0 // Not calculated by backend yet
          })

          // 2. Set Trend Data
          setTrendData(data.trend || [])

          // 3. Format Category Data
          const catColors = { roads: '#FF6B35', water: '#4299E1', sanitation: '#38A169', electricity: '#ED8936', safety: '#E53E3E', other: '#718096' }
          const formattedCategories = (data.byCategory || []).map(item => ({
            label: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
            count: item.count,
            color: catColors[item._id] || '#718096'
          }))
          setByCategory(formattedCategories)

          // 4. Format Priority Data
          const prioColors = { emergency: '#E53E3E', high: '#F7931E', normal: '#ECC94B', low: '#4299E1' }
          const formattedPriorities = (data.byPriority || []).map(item => ({
            label: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
            count: item.count,
            color: prioColors[item._id] || '#718096'
          }))
          setByPriority(formattedPriorities)
        }
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [range])

  // Line chart component
  const LineChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', background: 'var(--bg-surface-secondary)', borderRadius: '12px' }}>
          No trend data available for this period.
        </div>
      )
    }

    const width = 700
    const height = 260
    const padding = { top: 20, right: 20, bottom: 40, left: 40 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom
    
    // Find max value for scaling
    const maxVal = Math.max(...data.map((d) => Math.max(d.created, d.resolved)), 5)
    const stepX = chartW / Math.max(data.length - 1, 1)

    const createdPoints = data.map((d, i) => `${padding.left + i * stepX},${padding.top + chartH - (d.created / maxVal) * chartH}`).join(' ')
    const resolvedPoints = data.map((d, i) => `${padding.left + i * stepX},${padding.top + chartH - (d.resolved / maxVal) * chartH}`).join(' ')

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padding.top + chartH * (1 - p)
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--border-light)" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-tertiary)">{Math.round(maxVal * p)}</text>
            </g>
          )
        })}
        <polyline points={createdPoints} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={resolvedPoints} fill="none" stroke="#38A169" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <text key={i} x={padding.left + i * stepX} y={height - 15} textAnchor="middle" fontSize="10" fill="var(--text-tertiary)">
            {d.date ? d.date.slice(5) : ''}
          </text>
        ))}
      </svg>
    )
  }

  // Bar chart component
  const BarChart = ({ items }) => {
    if (!items || items.length === 0) {
      return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No data available.</div>
    }
    const max = Math.max(...items.map((i) => i.count), 1)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.label}</span>
              <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{item.count}</span>
            </div>
            <div style={{ height: '10px', background: 'var(--bg-surface-secondary)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: item.color, borderRadius: '5px', transition: 'width 0.6s ease' }}></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Complaint Analytics">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading real analytics data...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Complaint Analytics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #553C9A, #805AD5)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', boxShadow: '0 12px 32px rgba(128, 90, 213, 0.25)' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              📈 Complaint Analytics
            </h2>
            <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              Deep dive into complaint patterns and trends
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['7d', '30d', '90d', '1y'].map((r) => (
              <button 
                key={r} 
                onClick={() => setRange(r)} 
                style={{ padding: '8px 16px', background: range === r ? 'white' : 'transparent', color: range === r ? '#553C9A' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid - Now uses REAL numbers from backend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Complaints', value: kpis.total, color: '#FF6B35', icon: '📋' },
            { label: 'Resolved', value: kpis.resolved, color: '#38A169', icon: '✅' },
            { label: 'Pending', value: kpis.pending, color: '#ED8936', icon: '⏳' },
            { label: 'Avg Resolution', value: kpis.avgResolution > 0 ? `${kpis.avgResolution}d` : 'N/A', color: '#4299E1', icon: '⏱️' },
            { label: 'Resolution Rate', value: `${kpis.sla}%`, color: '#805AD5', icon: '📈' },
            { label: 'Emergencies', value: kpis.emergency, color: '#E53E3E', icon: '🚨' }
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: `4px solid ${kpi.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{kpi.icon}</div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>📊 Complaints Trend</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '16px', height: '3px', background: '#FF6B35', borderRadius: '2px' }}></span> Created
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '16px', height: '3px', background: '#38A169', borderRadius: '2px' }}></span> Resolved
              </span>
            </div>
          </div>
          <LineChart data={trendData} />
        </div>

        {/* Two Column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📁 Complaints by Category</h3>
            <BarChart items={byCategory} />
          </div>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📌 Complaints by Priority</h3>
            <BarChart items={byPriority} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintAnalytics