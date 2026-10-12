import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'

const SLAReports = () => {
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

  const [period, setPeriod] = useState('month')

  const [reports] = useState([
    { department: 'Sanitation', priority: 'emergency', target: '1h', actual: '0.8h', compliance: 98, cases: 45, color: '#38A169' },
    { department: 'Sanitation', priority: 'high', target: '4h', actual: '3.5h', compliance: 92, cases: 120, color: '#38A169' },
    { department: 'Water Supply', priority: 'emergency', target: '1h', actual: '1.2h', compliance: 88, cases: 28, color: '#ED8936' },
    { department: 'Water Supply', priority: 'high', target: '4h', actual: '4.5h', compliance: 85, cases: 76, color: '#ED8936' },
    { department: 'Public Works', priority: 'high', target: '4h', actual: '5.2h', compliance: 78, cases: 98, color: '#E53E3E' },
    { department: 'Public Works', priority: 'normal', target: '24h', actual: '22h', compliance: 91, cases: 210, color: '#38A169' },
    { department: 'Electricity', priority: 'emergency', target: '1h', actual: '1.5h', compliance: 82, cases: 34, color: '#ED8936' },
    { department: 'Electricity', priority: 'normal', target: '24h', actual: '26h', compliance: 76, cases: 145, color: '#E53E3E' }
  ])

  const overallCompliance = Math.round(reports.reduce((s, r) => s + r.compliance, 0) / reports.length)
  const totalCases = reports.reduce((s, r) => s + r.cases, 0)
  const breached = reports.filter((r) => r.compliance < 80).length

  const getPriorityLabel = (p) => {
    const map = { emergency: '🔴 Emergency', high: '🟠 High', normal: '🟡 Normal', low: '🔵 Low' }
    return map[p] || p
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="SLA Reports">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📄 SLA Compliance Reports</h2>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Track Service Level Agreement performance across departments</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)} style={{ padding: '8px 16px', background: period === p.id ? 'white' : 'transparent', color: period === p.id ? '#2C5282' : 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', borderTop: '4px solid #38A169' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{overallCompliance}%</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Overall SLA</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', borderTop: '4px solid #4299E1' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#4299E1', lineHeight: 1, marginBottom: '4px' }}>{totalCases}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Cases</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', borderTop: '4px solid #E53E3E' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#E53E3E', lineHeight: 1, marginBottom: '4px' }}>{breached}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>SLA Breached</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center', borderTop: '4px solid #805AD5' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>4</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Departments</div>
          </div>
        </div>

        {/* SLA Table */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📊 SLA Breakdown by Department</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Department', 'Priority', 'Target', 'Actual', 'Cases', 'Compliance', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontSize: '11px', fontWeight: '800', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontSize: '13px', fontWeight: '700', color: '#1a202c' }}>{r.department}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#4a5568' }}>{getPriorityLabel(r.priority)}</td>
                  <td style={{ padding: '14px', fontSize: '12px', color: '#718096' }}>⏰ {r.target}</td>
                  <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: r.actual <= r.target ? '#38A169' : '#E53E3E' }}>
                    {r.actual}
                  </td>
                  <td style={{ padding: '14px', fontSize: '12px', fontWeight: '700', color: '#1a202c' }}>{r.cases}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '80px', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${r.compliance}%`, height: '100%', background: r.color }}></div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: r.color }}>{r.compliance}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: r.compliance >= 90 ? '#c6f6d5' : r.compliance >= 80 ? '#feebc8' : '#fed7d7', color: r.compliance >= 90 ? '#276749' : r.compliance >= 80 ? '#9c4221' : '#9b2c2c' }}>
                      {r.compliance >= 90 ? '✅ Excellent' : r.compliance >= 80 ? '⚠️ Fair' : '❌ Poor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
            📥 Export PDF Report
          </button>
          <button style={{ padding: '12px 24px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
            📊 Export CSV
          </button>
          <button style={{ padding: '12px 24px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}>
            📧 Email to Higher Authority
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SLAReports