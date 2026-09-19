import React from 'react'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import './DepartmentDashboard.css'

const DepartmentDashboard = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines', badge: 5 },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' }
  ]

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Dashboard">
      <div className="welcome-banner dept-banner">
        <div className="welcome-text">
          <h2>Department Overview 🏛️</h2>
          <p>Monitoring <strong>4 departments</strong> with <strong>41 officers</strong>.</p>
        </div>
        <button className="btn-primary-large">📊 Generate Report</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Complaints" value="157" color="#FF6B35" trend={12} />
        <StatCard icon="👥" label="Active Officers" value="41" color="#805AD5" />
        <StatCard icon="⏰" label="Overdue Cases" value="8" color="#E53E3E" trend={-15} />
        <StatCard icon="📈" label="Avg SLA %" value="86%" color="#38A169" trend={5} />
      </div>
    </DashboardLayout>
  )
}

export default DepartmentDashboard