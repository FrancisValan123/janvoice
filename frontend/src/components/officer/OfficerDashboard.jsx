import React from 'react'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import './OfficerDashboard.css'

const OfficerDashboard = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned', badge: 8 },
    { icon: '🔍', label: 'Investigate', path: '/officer/investigate' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' }
  ]

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Officer Dashboard">
      <div className="welcome-banner officer-banner">
        <div className="welcome-text">
          <h2>Good Morning, Officer! 🎖️</h2>
          <p>You have <strong>8 active cases</strong> today.</p>
        </div>
        <button className="btn-primary-large">📋 View Assigned Cases</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Assigned" value="24" color="#FF6B35" />
        <StatCard icon="⏳" label="In Progress" value="8" color="#F7931E" />
        <StatCard icon="🔴" label="Emergency" value="2" color="#E53E3E" trend={-10} />
        <StatCard icon="✅" label="Resolved Today" value="5" color="#38A169" trend={25} />
      </div>

      <div className="recent-section">
        <h3 className="section-title">🎯 Priority Cases</h3>
        <div className="cases-list">
          <div className="case-card">
            <div className="case-info">
              <div className="case-id">JV2026010</div>
              <div className="case-title">Major pothole causing accidents</div>
              <div className="case-meta">📍 MG Road, Chennai • ⏰ Due in 2 hours</div>
            </div>
            <span className="status-badge status-urgent">Urgent</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default OfficerDashboard