import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import StatCard from '../common/StatCard'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import './DepartmentDashboard.css'

const DepartmentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activeOfficers: 0,
    overdueCases: 0,
    avgSla: 0,
    resolved: 0,
    pending: 0,
    emergency: 0,
    avgResolution: 0
  })
  const [departments, setDepartments] = useState([])
  const [urgentCases, setUrgentCases] = useState([])

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

  // ===================================
  // FETCH REAL DATA
  // ===================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch complaints (Backend automatically filters by department for Dept Admins)
        const complaintsRes = await api.get('/complaints?limit=100') 
        const allComplaints = complaintsRes.data?.complaints || []

        // 2. Fetch departments
        let depts = []
        try {
          const deptsRes = await api.get('/departments')
          depts = deptsRes.data?.departments || []
          setDepartments(depts)
        } catch (e) {
          console.warn('Could not fetch departments', e)
        }

        // 3. Fetch users/officers (Only System Admin might have this, if 403, we show 0)
        let officerCount = 0
        try {
          const usersRes = await api.get('/admin/users?role=officer&limit=1')
          officerCount = usersRes.data?.total || 0
        } catch (e) {
          console.warn('Could not fetch officer count', e)
        }

        // --- Calculate Stats from Real Data ---
        const now = new Date()
        const activeStatuses = ['pending', 'assigned', 'investigating', 'in-progress']
        
        let pending = 0, resolved = 0, emergency = 0, overdue = 0
        let totalResolutionTime = 0
        let resolvedWithTime = 0

        allComplaints.forEach(c => {
          if (activeStatuses.includes(c.status)) pending++
          if (c.status === 'resolved') {
            resolved++
            if (c.createdAt && c.resolvedAt) {
              totalResolutionTime += (new Date(c.resolvedAt) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24)
              resolvedWithTime++
            }
          }
          if (c.priority === 'emergency' && c.status !== 'resolved') emergency++
          
          // Overdue check
          if (c.deadline && new Date(c.deadline) < now && c.status !== 'resolved') {
            overdue++
          }
        })

        const avgResolution = resolvedWithTime > 0 ? (totalResolutionTime / resolvedWithTime).toFixed(1) : 0
        const slaTarget = 85 

        setStats({
          totalComplaints: allComplaints.length,
          activeOfficers: officerCount,
          overdueCases: overdue,
          avgSla: slaTarget,
          resolved: resolved,
          pending: pending,
          emergency: emergency,
          avgResolution: avgResolution
        })

        // --- Build Urgent Cases List ---
        const urgent = allComplaints
          .filter(c => (c.priority === 'emergency' || (c.deadline && new Date(c.deadline) < now)) && c.status !== 'resolved')
          .slice(0, 3)
          .map(c => {
            const deadlineDate = c.deadline ? new Date(c.deadline) : null
            let deadlineStr = 'No deadline'
            if (deadlineDate) {
              const hoursLeft = Math.round((deadlineDate - now) / (1000 * 60 * 60))
              deadlineStr = hoursLeft < 0 ? `Overdue by ${Math.abs(hoursLeft)}h` : `${hoursLeft}h left`
            }
            return {
              id: c.complaintId || c._id,
              title: c.title,
              priority: c.priority,
              deadline: deadlineStr,
              officer: c.assignedTo?.name || 'Unassigned',
              location: c.location?.address || 'Unknown'
            }
          })

        setUrgentCases(urgent)

      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E' },
      high: { icon: '🟠', label: 'High', color: '#F7931E' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1' }
    }
    return map[p] || map.normal
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Department Dashboard">
        <div className="dd-loading">
          <div className="dd-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      role="department_admin"
      menuItems={menuItems}
      title="Department Dashboard"
    >
      <div className="dd-container">
        {/* Welcome Banner */}
        <div className="dd-welcome">
          <div className="dd-welcome-content">
            <div>
              <h2 className="dd-welcome-title">
                Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 🏛️
              </h2>
              
              {/* ✅ FIXED SENTENCE HERE */}
              <p className="dd-welcome-sub" style={{ color: '#FFFFFF', opacity: 1, fontWeight: 500 }}>
                Managing the <strong>{user?.department || 'General'}</strong> department with{' '}
                <strong>{stats.activeOfficers} officers</strong>. Currently{' '}
                <strong>{stats.pending} cases</strong> need attention.
              </p>

            </div>
            <div className="dd-welcome-actions">
              <Link to="/department/assign" className="dd-btn-primary">
                👥 Assign Officers
              </Link>
              <Link to="/department/escalate" className="dd-btn-secondary">
                🚨 Escalate Cases
              </Link>
            </div>
          </div>
          <div className="dd-welcome-decoration">
            <div className="dd-circle dd-c1"></div>
            <div className="dd-circle dd-c2"></div>
          </div>
        </div>

        {/* Urgent Alert */}
        {stats.emergency > 0 && (
          <div className="dd-alert">
            <div className="dd-alert-icon">🚨</div>
            <div className="dd-alert-body">
              <div className="dd-alert-title">
                {stats.emergency} Emergency Cases Need Immediate Attention
              </div>
              <div className="dd-alert-desc">
                These cases are nearing or have exceeded their deadlines.
              </div>
            </div>
            <Link to="/department/escalate" className="dd-alert-link">
              View →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="dd-stats-grid">
          <StatCard icon="📋" label="Total Complaints" value={stats.totalComplaints} color="#FF6B35" />
          <StatCard icon="👥" label="Active Officers" value={stats.activeOfficers} color="#805AD5" />
          <StatCard icon="⏰" label="Overdue Cases" value={stats.overdueCases} color="#E53E3E" />
          <StatCard icon="📈" label="Avg SLA" value={stats.avgSla} suffix="%" color="#38A169" />
          <StatCard icon="✅" label="Resolved" value={stats.resolved} color="#38A169" />
          <StatCard icon="⏳" label="Pending" value={stats.pending} color="#ED8936" />
        </div>

        {/* Two Column Grid */}
        <div className="dd-two-col">
          {/* Department Overview */}
          <div className="dd-card">
            <div className="dd-card-header">
              <h3 className="dd-card-title">🏛️ Department Overview</h3>
              <Link to="/department/stats" className="dd-link">
                View Details →
              </Link>
            </div>
            <div className="dd-dept-grid">
              {departments.length === 0 ? (
                 <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '20px' }}>No departments found.</p>
              ) : (
                departments.map((dept, i) => (
                  <div key={i} className="dd-dept-item">
                    <div className="dd-dept-header">
                      <span className="dd-dept-badge" style={{ background: (dept.color || '#FF6B35') + '20', color: dept.color || '#FF6B35' }}>
                        {dept.code}
                      </span>
                      <span className="dd-dept-sla" style={{ color: dept.color || '#FF6B35' }}>86%</span>
                    </div>
                    <div className="dd-dept-name">{dept.name}</div>
                    <div className="dd-dept-meta">
                      <span>👥 0</span>
                      <span>📋 0</span>
                      <span>✅ 0</span>
                    </div>
                    <div className="dd-dept-bar">
                      <div className="dd-dept-bar-fill" style={{ width: `86%`, background: dept.color || '#FF6B35' }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Urgent Cases */}
          <div className="dd-card">
            <div className="dd-card-header">
              <h3 className="dd-card-title">🚨 Urgent Cases</h3>
              <Link to="/department/deadlines" className="dd-link">
                View All →
              </Link>
            </div>
            <div className="dd-urgent-list">
              {urgentCases.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '20px' }}>No urgent cases. You're all caught up! ✨</p>
              ) : (
                urgentCases.map((c) => {
                  const priority = getPriorityConfig(c.priority)
                  return (
                    <div key={c.id} className="dd-urgent-item">
                      <div className="dd-urgent-bar" style={{ background: priority.color }}></div>
                      <div className="dd-urgent-body">
                        <div className="dd-urgent-meta">
                          <span className="dd-urgent-id">{c.id}</span>
                          <span className="dd-urgent-priority" style={{ color: priority.color }}>
                            {priority.icon} {priority.label}
                          </span>
                        </div>
                        <div className="dd-urgent-title">{c.title}</div>
                        <div className="dd-urgent-details">
                          <span>👤 {c.officer}</span>
                          <span>⏰ {c.deadline}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dd-card">
          <div className="dd-card-header">
            <h3 className="dd-card-title">⚡ Quick Actions</h3>
          </div>
          <div className="dd-actions-grid">
            <Link to="/department/assign" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#FF6B35' }}>👥</div>
              <div className="dd-action-label">Assign Officers</div>
            </Link>
            <Link to="/department/deadlines" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#ED8936' }}>⏰</div>
              <div className="dd-action-label">Monitor Deadlines</div>
            </Link>
            <Link to="/department/escalate" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#E53E3E' }}>🚨</div>
              <div className="dd-action-label">Escalate Cases</div>
            </Link>
            <Link to="/department/analytics" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#805AD5' }}>📈</div>
              <div className="dd-action-label">Analytics</div>
            </Link>
            <Link to="/department/sla" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#4299E1' }}>📄</div>
              <div className="dd-action-label">SLA Reports</div>
            </Link>
            <Link to="/department/officers" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#38A169' }}>👨‍💼</div>
              <div className="dd-action-label">Officer Performance</div>
            </Link>
            <Link to="/department/allocation" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#F7931E' }}>📦</div>
              <div className="dd-action-label">Resource Allocation</div>
            </Link>
            <Link to="/department/settings" className="dd-action">
              <div className="dd-action-icon" style={{ background: '#4A5568' }}>⚙️</div>
              <div className="dd-action-label">Settings</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DepartmentDashboard