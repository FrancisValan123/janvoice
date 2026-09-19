import React from 'react'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '👥', label: 'Users', path: '/admin/users', badge: 1245 },
    { icon: '🏛️', label: 'Departments', path: '/admin/departments' },
    { icon: '📂', label: 'Categories', path: '/admin/categories' },
    { icon: '📋', label: 'Audit Logs', path: '/admin/audit' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' }
  ]

  return (
    <DashboardLayout role="system_admin" menuItems={menuItems} title="System Admin Dashboard">
      <div className="welcome-banner admin-banner">
        <div className="welcome-text">
          <h2>System Control Center ⚙️</h2>
          <p>Monitoring <strong>1,245 users</strong> across <strong>8 departments</strong>.</p>
        </div>
        <button className="btn-primary-large">👥 Manage Users</button>
      </div>

      <div className="stats-grid">
        <StatCard icon="👥" label="Total Users" value="1,245" color="#FF6B35" trend={8} />
        <StatCard icon="🏛️" label="Departments" value="8" color="#805AD5" />
        <StatCard icon="📋" label="Total Complaints" value="12,847" color="#4299E1" trend={18} />
        <StatCard icon="⭐" label="System Health" value="99.8%" color="#38A169" />
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard