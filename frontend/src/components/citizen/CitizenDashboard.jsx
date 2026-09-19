import React from 'react'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import './CitizenDashboard.css'

const CitizenDashboard = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints', badge: 3 },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications', badge: 5 },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Citizen Dashboard">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, Citizen! 👋</h2>
          <p>Track your complaints and help build a better India.</p>
        </div>
        <button className="btn-primary-large">📝 Submit New Complaint</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Complaints" value="12" color="#FF6B35" trend={15} />
        <StatCard icon="⏳" label="Pending" value="3" color="#F7931E" />
        <StatCard icon="✅" label="Resolved" value="8" color="#38A169" trend={20} />
        <StatCard icon="🔴" label="Emergency" value="1" color="#E53E3E" />
      </div>

      <div className="recent-section">
        <h3 className="section-title">📋 Recent Complaints</h3>
        <div className="complaints-list">
          <div className="complaint-card">
            <div className="complaint-info">
              <div className="complaint-id">JV2026001</div>
              <div className="complaint-title">Broken street light near Anna Nagar</div>
              <div className="complaint-meta">📅 2026-09-15</div>
            </div>
            <span className="status-badge status-progress">In Progress</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CitizenDashboard