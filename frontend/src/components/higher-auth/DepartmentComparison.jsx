import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

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

  const [selectedDepts, setSelectedDepts] = useState(['Public Works', 'Water Supply', 'Sanitation'])

  const allDepartments = [
    {
      name: 'Public Works',
      code: 'PW',
      color: '#FF6B35',
      total: 45,
      resolved: 38,
      pending: 7,
      sla: 84,
      avgDays: 6.2,
      satisfaction: 4.4,
      overdue: 3,
      escalated: 4,
      officers: 12,
      trend: 12
    },
    {
      name: 'Water Supply',
      code: 'WS',
      color: '#4299E1',
      total: 32,
      resolved: 28,
      pending: 4,
      sla: 88,
      avgDays: 5.1,
      satisfaction: 4.6,
      overdue: 2,
      escalated: 2,
      officers: 8,
      trend: 8
    },
    {
      name: 'Sanitation',
      code: 'SN',
      color: '#38A169',
      total: 58,
      resolved: 52,
      pending: 6,
      sla: 90,
      avgDays: 4.8,
      satisfaction: 4.7,
      overdue: 1,
      escalated: 3,
      officers: 15,
      trend: 15
    },
    {
      name: 'Electricity',
      code: 'EL',
      color: '#ED8936',
      total: 22,
      resolved: 18,
      pending: 4,
      sla: 82,
      avgDays: 7.4,
      satisfaction: 4.2,
      overdue: 2,
      escalated: 2,
      officers: 6,
      trend: -3
    },
    {
      name: 'Transport',
      code: 'TR',
      color: '#805AD5',
      total: 15,
      resolved: 12,
      pending: 3,
      sla: 80,
      avgDays: 8.1,
      satisfaction: 4.0,
      overdue: 1,
      escalated: 1,
      officers: 4,
      trend: 5
    },
    {
      name: 'Health',
      code: 'HL',
      color: '#E53E3E',
      total: 18,
      resolved: 16,
      pending: 2,
      sla: 89,
      avgDays: 3.5,
      satisfaction: 4.8,
      overdue: 0,
      escalated: 0,
      officers: 5,
      trend: 10
    }
  ]

  const toggleDept = (name) => {
    if (selectedDepts.includes(name)) {
      if (selectedDepts.length > 2) {
        setSelectedDepts(selectedDepts.filter((d) => d !== name))
      } else {
        alert('Select at least 2 departments to compare')
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
    { key: 'satisfaction', label: 'Satisfaction', icon: '⭐', format: (v) => `${v}/5`, higher: true },
    { key: 'overdue', label: 'Overdue', icon: '🚨', format: (v) => v, higher: false },
    { key: 'escalated', label: 'Escalated', icon: '⚠️', format: (v) => v, higher: false },
    { key: 'officers', label: 'Officers', icon: '👥', format: (v) => v, higher: true }
  ]

  const getBestValue = (key, higherIsBetter) => {
    const values = selectedData.map((d) => d[key])
    return higherIsBetter ? Math.max(...values) : Math.min(...values)
  }

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Department Comparison">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>🏛️ Department Comparison</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Compare performance metrics across departments side-by-side
          </p>
        </div>

        {/* Department Selector */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
            🎯 Select Departments ({selectedDepts.length}/4)
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {allDepartments.map((d) => (
              <button
                key={d.name}
                onClick={() => toggleDept(d.name)}
                style={{
                  padding: '10px 16px',
                  background: selectedDepts.includes(d.name) ? d.color : 'white',
                  color: selectedDepts.includes(d.name) ? 'white' : '#4a5568',
                  border: `2px solid ${d.color}`,
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ width: '10px', height: '10px', background: selectedDepts.includes(d.name) ? 'white' : d.color, borderRadius: '50%' }}></span>
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
            📊 Side-by-Side Comparison
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px 14px', fontSize: '12px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', minWidth: '220px' }}>
                  Metric
                </th>
                {selectedData.map((d) => (
                  <th key={d.name} style={{ textAlign: 'center', padding: '16px 14px', borderBottom: '2px solid #e2e8f0', minWidth: '140px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', background: d.color + '20', color: d.color, letterSpacing: '1px' }}>
                        {d.code}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{d.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => {
                const best = getBestValue(m.key, m.higher)
                return (
                  <tr key={m.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 14px', fontSize: '13px', fontWeight: '700', color: '#2d3748' }}>
                      {m.icon} {m.label}
                    </td>
                    {selectedData.map((d) => {
                      const isBest = d[m.key] === best
                      return (
                        <td key={d.name} style={{ padding: '16px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '800',
                              background: isBest ? '#C6F6D5' : '#f7fafc',
                              color: isBest ? '#276749' : '#1a202c',
                              border: isBest ? '2px solid #38A169' : '2px solid transparent',
                              minWidth: '80px'
                            }}
                          >
                            {isBest && '🏆 '}
                            {m.format(d[m.key])}
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
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px', color: '#718096', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#C6F6D5', border: '2px solid #38A169', borderRadius: '3px' }}></span>
              🏆 Best performer
            </span>
            <span>Higher is better: Total, Resolved, SLA, Satisfaction, Officers</span>
            <span>Lower is better: Pending, Avg Days, Overdue, Escalated</span>
          </div>
        </div>

        {/* Winner Card */}
        <div style={{ background: 'linear-gradient(135deg, #C6F6D5, #9AE6B4)', borderRadius: '14px', padding: '24px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '56px', flexShrink: 0 }}>🏆</div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontSize: '12px', color: '#22543D', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Overall Best Performer
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1C4532', marginBottom: '6px' }}>
              {
                [...selectedData].sort((a, b) => b.sla + b.satisfaction * 10 - (a.sla + a.satisfaction * 10))[0]
                  ?.name
              }
            </div>
            <div style={{ fontSize: '13px', color: '#22543D' }}>
              Highest combined SLA compliance and citizen satisfaction
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentComparison