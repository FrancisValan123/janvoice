import React from 'react'
import DashboardLayout from '../common/DashboardLayout'

const DepartmentStats = () => {
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

  const stats = [
    { name: 'Public Works', code: 'PW', color: '#FF6B35', officers: 12, complaints: 45, resolved: 38, pending: 7, sla: 84, avgDays: 6.2, trend: 12 },
    { name: 'Water Supply', code: 'WS', color: '#4299E1', officers: 8, complaints: 32, resolved: 28, pending: 4, sla: 88, avgDays: 5.1, trend: 8 },
    { name: 'Sanitation', code: 'SN', color: '#38A169', officers: 15, complaints: 58, resolved: 52, pending: 6, sla: 90, avgDays: 4.8, trend: 15 },
    { name: 'Electricity', code: 'EL', color: '#ED8936', officers: 6, complaints: 22, resolved: 18, pending: 4, sla: 82, avgDays: 7.4, trend: -3 },
    { name: 'Transport', code: 'TR', color: '#805AD5', officers: 4, complaints: 15, resolved: 12, pending: 3, sla: 80, avgDays: 8.1, trend: 5 },
    { name: 'Health', code: 'HL', color: '#E53E3E', officers: 5, complaints: 18, resolved: 16, pending: 2, sla: 89, avgDays: 3.5, trend: 10 }
  ]

  const totals = {
    complaints: stats.reduce((s, d) => s + d.complaints, 0),
    resolved: stats.reduce((s, d) => s + d.resolved, 0),
    pending: stats.reduce((s, d) => s + d.pending, 0),
    officers: stats.reduce((s, d) => s + d.officers, 0),
    avgSla: Math.round(stats.reduce((s, d) => s + d.sla, 0) / stats.length)
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Statistics">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a202c, #2d3748)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📊 Department Statistics</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Comprehensive performance overview of all departments</p>
        </div>

        {/* Overall Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#FF6B35', lineHeight: 1, marginBottom: '4px' }}>{totals.complaints}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Total Complaints</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{totals.resolved}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Resolved</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#ED8936', lineHeight: 1, marginBottom: '4px' }}>{totals.pending}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Pending</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#805AD5', lineHeight: 1, marginBottom: '4px' }}>{totals.officers}</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Officers</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#38A169', lineHeight: 1, marginBottom: '4px' }}>{totals.avgSla}%</div>
            <div style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg SLA</div>
          </div>
        </div>

        {/* Department Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {stats.map((dept) => (
            <div key={dept.code} style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: `4px solid ${dept.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', background: dept.color + '20', color: dept.color, letterSpacing: '1px' }}>
                    {dept.code}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c' }}>{dept.name}</h3>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: dept.trend >= 0 ? '#38A169' : '#E53E3E' }}>
                  {dept.trend >= 0 ? '↑' : '↓'} {Math.abs(dept.trend)}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', lineHeight: 1 }}>{dept.complaints}</div>
                  <div style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Total</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#38A169', lineHeight: 1 }}>{dept.resolved}</div>
                  <div style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Resolved</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#ED8936', lineHeight: 1 }}>{dept.pending}</div>
                  <div style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', fontWeight: '700', marginTop: '4px' }}>Pending</div>
                </div>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#718096', fontWeight: '600' }}>SLA Compliance</span>
                  <span style={{ color: dept.color, fontWeight: '800' }}>{dept.sla}%</span>
                </div>
                <div style={{ height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${dept.sla}%`, height: '100%', background: dept.color, borderRadius: '3px' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#718096', fontWeight: '600' }}>👥 {dept.officers} officers</span>
                  <span style={{ color: '#718096', fontWeight: '600' }}>⏱️ {dept.avgDays}d avg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentStats