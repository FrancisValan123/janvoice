import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

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

  // Demo data
  const kpis = {
    total: 157,
    resolved: 138,
    pending: 19,
    avgResolution: 5.8,
    sla: 86,
    satisfaction: 4.5
  }

  const byCategory = [
    { label: 'Roads & Infrastructure', count: 45, color: '#FF6B35' },
    { label: 'Water Supply', count: 32, color: '#4299E1' },
    { label: 'Sanitation & Waste', count: 58, color: '#38A169' },
    { label: 'Electricity', count: 22, color: '#ED8936' }
  ]

  const byPriority = [
    { label: 'Emergency', count: 12, color: '#E53E3E' },
    { label: 'High', count: 34, color: '#F7931E' },
    { label: 'Normal', count: 89, color: '#ECC94B' },
    { label: 'Low', count: 22, color: '#4299E1' }
  ]

  const byStatus = [
    { label: 'Resolved', count: 138, color: '#38A169' },
    { label: 'In Progress', count: 12, color: '#3182CE' },
    { label: 'Pending', count: 7, color: '#ED8936' }
  ]

  const trendData = [
    { date: '2026-09-01', created: 18, resolved: 12 },
    { date: '2026-09-05', created: 22, resolved: 15 },
    { date: '2026-09-10', created: 28, resolved: 20 },
    { date: '2026-09-15', created: 25, resolved: 24 },
    { date: '2026-09-20', created: 32, resolved: 28 },
    { date: '2026-09-25', created: 20, resolved: 25 },
    { date: '2026-09-30', created: 12, resolved: 14 }
  ]

  // Line chart
  const LineChart = ({ data }) => {
    if (!data || data.length === 0) return null
    const width = 700
    const height = 260
    const padding = { top: 20, right: 20, bottom: 40, left: 40 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom
    const maxVal = Math.max(...data.map((d) => Math.max(d.created, d.resolved)), 10)
    const stepX = chartW / (data.length - 1)

    const createdPoints = data.map((d, i) => {
      const x = padding.left + i * stepX
      const y = padding.top + chartH - (d.created / maxVal) * chartH
      return `${x},${y}`
    }).join(' ')

    const resolvedPoints = data.map((d, i) => {
      const x = padding.left + i * stepX
      const y = padding.top + chartH - (d.resolved / maxVal) * chartH
      return `${x},${y}`
    }).join(' ')

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padding.top + chartH * (1 - p)
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#a0aec0">{Math.round(maxVal * p)}</text>
            </g>
          )
        })}

        <polyline points={createdPoints} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={resolvedPoints} fill="none" stroke="#38A169" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => {
          const x = padding.left + i * stepX
          return (
            <text key={i} x={x} y={height - 15} textAnchor="middle" fontSize="10" fill="#718096">
              {d.date.slice(5)}
            </text>
          )
        })}
      </svg>
    )
  }

  // Bar chart
  const BarChart = ({ items }) => {
    const max = Math.max(...items.map((i) => i.count), 1)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ fontWeight: '600', color: '#2d3748' }}>{item.label}</span>
              <span style={{ fontWeight: '800', color: '#1a202c' }}>{item.count}</span>
            </div>
            <div style={{ height: '10px', background: '#edf2f7', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${(item.count / max) * 100}%`, height: '100%', background: item.color, borderRadius: '5px', transition: 'width 0.6s ease' }}></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Donut chart
  const DonutChart = ({ items }) => {
    const total = items.reduce((s, i) => s + i.count, 0)
    const size = 200
    const strokeWidth = 32
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    let offset = 0

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {items.map((item, i) => {
            const percent = item.count / total
            const dash = percent * circumference
            const el = (
              <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
            )
            offset += dash
            return el
          })}
          <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize="26" fontWeight="800" fill="#1a202c">{total}</text>
          <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize="11" fill="#718096">Total</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#2d3748' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></span>
              {item.label} ({Math.round((item.count / total) * 100)}%)
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Complaint Analytics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #553C9A, #805AD5)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📈 Complaint Analytics</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Deep dive into complaint patterns and trends</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {['7d', '30d', '90d', '1y'].map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: '8px 16px', background: range === r ? 'white' : 'transparent', color: range === r ? '#553C9A' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Total Complaints', value: kpis.total, color: '#FF6B35', icon: '📋' },
            { label: 'Resolved', value: kpis.resolved, color: '#38A169', icon: '✅' },
            { label: 'Pending', value: kpis.pending, color: '#ED8936', icon: '⏳' },
            { label: 'Avg Resolution', value: `${kpis.avgResolution}d`, color: '#4299E1', icon: '⏱️' },
            { label: 'SLA Compliance', value: `${kpis.sla}%`, color: '#805AD5', icon: '📈' },
            { label: 'Satisfaction', value: `⭐ ${kpis.satisfaction}`, color: '#F7931E', icon: '⭐' }
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: `4px solid ${kpi.color}` }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{kpi.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', lineHeight: 1, marginBottom: '4px' }}>{kpi.value}</div>
              <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Trend Chart */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>📊 Complaints Trend</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#4a5568', fontWeight: '600' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📁 Complaints by Category</h3>
            <BarChart items={byCategory} />
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📌 Complaints by Priority</h3>
            <DonutChart items={byPriority} />
          </div>
        </div>

        {/* Status Distribution */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📊 Status Distribution</h3>
          <DonutChart items={byStatus} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintAnalytics