import React from 'react'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import './AuthorityDashboard.css'

const AuthorityDashboard = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated', badge: 12 },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue' }
  ]

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Higher Authority Dashboard">
      <div className="welcome-banner auth-banner">
        <div className="welcome-text">
          <h2>System Overview ⭐</h2>
          <p><strong>12 escalated cases</strong> require your attention.</p>
        </div>
        <button className="btn-primary-large">🚨 Review Escalations</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="🚨" label="Escalated" value="12" color="#E53E3E" trend={20} />
        <StatCard icon="⏰" label="Overdue" value="5" color="#F7931E" trend={-10} />
        <StatCard icon="🏛️" label="Departments" value="8" color="#805AD5" />
        <StatCard icon="⭐" label="Avg Performance" value="78%" color="#38A169" trend={8} />
      </div>
    </DashboardLayout>
  )
}

export default AuthorityDashboard