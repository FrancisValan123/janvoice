import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const ResourceAllocation = () => {
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

  const [resources] = useState([
    { type: 'Officers', icon: '👨‍💼', allocated: 41, available: 8, total: 49, color: '#FF6B35', unit: 'staff' },
    { type: 'Vehicles', icon: '🚗', allocated: 22, available: 6, total: 28, color: '#4299E1', unit: 'vehicles' },
    { type: 'Equipment', icon: '🛠️', allocated: 87, available: 13, total: 100, color: '#38A169', unit: 'units' },
    { type: 'Budget', icon: '💰', allocated: 72, available: 28, total: 100, color: '#F7931E', unit: '%' }
  ])

  const [departments] = useState([
    { name: 'Public Works', officers: 12, vehicles: 6, equipment: 28, budget: 24, color: '#FF6B35' },
    { name: 'Water Supply', officers: 8, vehicles: 4, equipment: 18, budget: 18, color: '#4299E1' },
    { name: 'Sanitation', officers: 15, vehicles: 8, equipment: 22, budget: 26, color: '#38A169' },
    { name: 'Electricity', officers: 6, vehicles: 4, equipment: 19, budget: 32, color: '#ED8936' }
  ])

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Resource Allocation">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📦 Resource Allocation</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Manage and distribute resources across departments</p>
        </div>

        {/* Resource Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {resources.map((r, i) => {
            const usage = Math.round((r.allocated / r.total) * 100)
            return (
              <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: `4px solid ${r.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{r.icon}</span>
                  <span style={{ padding: '4px 10px', background: r.color + '20', color: r.color, borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                    {usage}% used
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>{r.type}</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: r.color, lineHeight: 1, marginBottom: '4px' }}>
                  {r.allocated}/{r.total}
                </div>
                <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>
                  {r.available} {r.unit} available
                </div>
                <div style={{ height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${usage}%`, height: '100%', background: r.color, borderRadius: '3px' }}></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Department Allocation Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>🏛️ Allocation by Department</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Department', '👨‍💼 Officers', '🚗 Vehicles', '🛠️ Equipment', '💰 Budget %', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '4px', height: '28px', background: d.color, borderRadius: '2px' }}></span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{d.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{d.officers}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{d.vehicles}</td>
                    <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{d.equipment}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '80px', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.budget}%`, height: '100%', background: d.color }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: d.color }}>{d.budget}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button style={{ padding: '6px 12px', background: '#f7fafc', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reallocation Panel */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>🔄 Reallocate Resources</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2d3748', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From Department</label>
              <select style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: 'white', outline: 'none', fontFamily: 'inherit', fontWeight: '600', color: '#2d3748' }}>
                {departments.map((d) => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2d3748', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To Department</label>
              <select style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: 'white', outline: 'none', fontFamily: 'inherit', fontWeight: '600', color: '#2d3748' }}>
                {departments.map((d) => <option key={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2d3748', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Resource Type</label>
              <select style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: 'white', outline: 'none', fontFamily: 'inherit', fontWeight: '600', color: '#2d3748' }}>
                <option>👨‍💼 Officers</option>
                <option>🚗 Vehicles</option>
                <option>🛠️ Equipment</option>
                <option>💰 Budget</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#2d3748', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</label>
              <input type="number" defaultValue="5" min="1" style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)' }}>
            🔄 Reallocate Resources
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResourceAllocation