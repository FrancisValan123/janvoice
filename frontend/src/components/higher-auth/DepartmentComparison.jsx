import React, { useState, useEffect } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const DepartmentComparison = () => {
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

  const [allDepartments, setAllDepartments] = useState([])
  const [selectedDepts, setSelectedDepts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true)
        const res = await api.get('/authority/departments')
        const data = res.data?.departments || []

        // ✅ Filter out any empty names and map the data
        const formatted = data
          .filter(d => d.name && d.name.trim() !== '')
          .map((d, i) => {
            const colors = ['#FF6B35', '#4299E1', '#38A169', '#ED8936', '#805AD5', '#E53E3E']
            const nameStr = d.name || 'General'
            return {
              name: nameStr,
              code: nameStr.substring(0, 2).toUpperCase(),
              color: colors[i % colors.length],
              total: d.total || 0,
              resolved: d.resolved || 0,
              pending: d.pending || 0,
              sla: d.sla || 0,
              avgDays: d.avgDays || 0,
              overdue: d.overdue || 0,
              escalated: d.escalated || 0
            }
          })

        setAllDepartments(formatted)
        
        // Auto-select up to 3 departments
        if (formatted.length > 0) {
          setSelectedDepts(formatted.slice(0, 3).map(d => d.name))
        }
      } catch (err) {
        console.error('Failed to load departments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const toggleDept = (name) => {
    if (selectedDepts.includes(name)) {
      if (selectedDepts.length > 1) {
        setSelectedDepts(selectedDepts.filter((d) => d !== name))
      } else {
        alert('Select at least 1 department to compare')
      }
    } else {
      if (selectedDepts.length < 4) {
        setSelectedDepts([...selectedDepts, name])
      } else {
        alert('You can compare up to 4 departments at a time')
      }
    }
  }

  const selectedData = allDepartments.filter((d) => selectedDepts.includes(d.name))

  const metrics = [
    { key: 'total', label: 'Total Complaints', icon: '📋', format: (v) => v, higher: true },
    { key: 'resolved', label: 'Resolved', icon: '✅', format: (v) => v, higher: true },
    { key: 'pending', label: 'Pending', icon: '⏳', format: (v) => v, higher: false },
    { key: 'sla', label: 'SLA Compliance', icon: '📈', format: (v) => `${v}%`, higher: true },
    { key: 'avgDays', label: 'Avg Resolution', icon: '⏱️', format: (v) => `${v} days`, higher: false },
    { key: 'overdue', label: 'Overdue', icon: '🚨', format: (v) => v, higher: false },
    { key: 'escalated', label: 'Escalated', icon: '⚠️', format: (v) => v, higher: false }
  ]

  const getBestValue = (key, higherIsBetter) => {
    if (selectedData.length === 0) return 0
    const values = selectedData.map((d) => d[key])
    return higherIsBetter ? Math.max(...values) : Math.min(...values)
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Department Comparison">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>⏳ Loading department data...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Department Comparison">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '20px', padding: '32px', color: 'white', marginBottom: '24px', boxShadow: '0 12px 32px rgba(66, 153, 225, 0.25)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            🏛️ Department Comparison
          </h2>
          <p style={{ fontSize: '15px', opacity: 0.95, color: '#FFFFFF', fontWeight: '500', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
            Compare performance metrics across departments side-by-side
          </p>
        </div>

        {allDepartments.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Departments Found</h3>
            <p>There are no complaints in the database yet. Submit a new complaint to see departments here.</p>
          </div>
        ) : (
          <>
            {/* Department Selector */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
                🎯 Select Departments ({selectedDepts.length}/4)
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {allDepartments.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => toggleDept(d.name)}
                    style={{
                      padding: '10px 18px', background: selectedDepts.includes(d.name) ? d.color : 'var(--bg-surface-secondary)',
                      color: selectedDepts.includes(d.name) ? 'white' : 'var(--text-secondary)', border: `2px solid ${d.color}`,
                      borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', background: selectedDepts.includes(d.name) ? 'white' : d.color, borderRadius: '50%' }}></span>
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Grid */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
                📊 Side-by-Side Comparison
              </h3>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid var(--border-light)', minWidth: '220px' }}>
                      Metric
                    </th>
                    {selectedData.map((d) => (
                      <th key={d.name} style={{ textAlign: 'center', padding: '16px 14px', borderBottom: '2px solid var(--border-light)', minWidth: '140px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', background: d.color + '20', color: d.color, letterSpacing: '1px' }}>
                            {d.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{d.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => {
                    const best = getBestValue(m.key, m.higher)
                    return (
                      <tr key={m.key} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '16px 14px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {m.icon} {m.label}
                        </td>
                        {selectedData.map((d) => {
                          const isBest = d[m.key] === best && best !== 0
                          return (
                            <td key={d.name} style={{ padding: '16px 14px', textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', borderRadius: '10px',
                                  fontSize: '14px', fontWeight: '800', background: isBest ? 'rgba(56, 161, 105, 0.15)' : 'var(--bg-surface-secondary)',
                                  color: isBest ? '#276749' : 'var(--text-primary)', border: isBest ? '2px solid #38A169' : '2px solid transparent', minWidth: '80px'
                                }}
                              >
                                {isBest && '🏆 '}
                                {m.format(d[m.key] || 0)}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Legend */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'rgba(56, 161, 105, 0.2)', border: '2px solid #38A169', borderRadius: '3px' }}></span>
                  🏆 Best performer
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DepartmentComparison