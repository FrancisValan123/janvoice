import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './AssignedComplaints.css'

const CATEGORY_MAP = {
  roads: { name: 'Roads & Infrastructure', icon: '🛣️' },
  water: { name: 'Water Supply', icon: '💧' },
  sanitation: { name: 'Sanitation & Waste', icon: '🗑️' },
  electricity: { name: 'Electricity', icon: '⚡' },
  safety: { name: 'Public Safety', icon: '🚨' },
  transport: { name: 'Transport', icon: '🚌' },
  health: { name: 'Health', icon: '🏥' },
  education: { name: 'Education', icon: '📚' },
  environment: { name: 'Environment', icon: '🌳' },
  other: { name: 'Other', icon: '📁' }
}

const getCategoryDisplay = (category) => {
  if (!category) return 'General'
  const normalized = category.toLowerCase().trim()
  return CATEGORY_MAP[normalized]?.name || category
}

const getCategoryIcon = (category) => {
  if (!category) return '📋'
  const normalized = category.toLowerCase().trim()
  return CATEGORY_MAP[normalized]?.icon || '📋'
}

const AssignedComplaints = () => {
  const navigate = useNavigate()

  // ✅ FIXED: Removed "Investigate" — it navigates from the case cards instead
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📊', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get('/complaints/assigned')
        const rawData =
          response.data?.data ||
          response.data?.complaints ||
          (Array.isArray(response.data) ? response.data : [])

        const formatted = rawData.map((c) => {
          const createdAt = c.createdAt ? new Date(c.createdAt) : null
          const deadline = c.deadline ? new Date(c.deadline) : null
          let hoursLeft = null
          if (deadline) {
            hoursLeft = Math.round((deadline - Date.now()) / (1000 * 60 * 60))
          }

          return {
            _id: c._id,
            id: c.complaintId || c._id,
            title: c.title || 'Untitled',
            category: getCategoryDisplay(c.category),
            categoryIcon: getCategoryIcon(c.category),
            priority: c.priority || 'normal',
            status: c.status || 'pending',
            location: c.location?.address || c.location || 'Not specified',
            affectedPeople: c.affectedPeople || 1,
            hoursLeft,
            citizen: c.citizen?.name || 'Citizen',
            date: createdAt ? createdAt.toISOString().split('T')[0] : 'N/A'
          }
        })

        setComplaints(formatted)
      } catch (err) {
        console.error('Failed to fetch assigned complaints:', err)
        setError(
          err.response?.data?.message ||
            'Failed to load assigned complaints. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const stats = {
    total: complaints.length,
    assigned: complaints.filter((c) => c.status === 'assigned').length,
    investigating: complaints.filter((c) => c.status === 'investigating').length,
    inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    emergency: complaints.filter(
      (c) => c.priority === 'emergency' && c.status !== 'resolved'
    ).length
  }

  const filtered = complaints.filter((c) => {
    const matchSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())

    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchPriority = filterPriority === 'all' || c.priority === filterPriority

    return matchSearch && matchStatus && matchPriority
  })

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: 'rgba(237, 137, 54, 0.15)' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.15)' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: 'rgba(128, 90, 213, 0.15)' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: 'rgba(49, 130, 206, 0.15)' },
      resolved: { label: 'Resolved', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)' }
    }
    return map[status] || map.pending
  }

  const getPriorityConfig = (priority) => {
    const map = {
      emergency: { label: 'Emergency', color: '#E53E3E', icon: '🔴' },
      high: { label: 'High', color: '#F7931E', icon: '🟠' },
      normal: { label: 'Normal', color: '#ECC94B', icon: '🟡' },
      low: { label: 'Low', color: '#4299E1', icon: '🔵' }
    }
    return map[priority] || map.normal
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Assigned Cases">
      <div className="ac-container">
        <div className="ac-hero">
          <div className="ac-hero-content">
            <div>
              <h1 className="ac-hero-title">📋 Assigned Cases</h1>
              <p className="ac-hero-sub">Manage and prioritize all cases assigned to you</p>
            </div>
          </div>
        </div>

        <div className="ac-stats-grid">
          <div className="ac-stat-card" style={{ '--c': '#FF6B35' }}>
            <div className="ac-stat-value">{stats.total}</div>
            <div className="ac-stat-label">Total</div>
          </div>
          <div className="ac-stat-card" style={{ '--c': '#4299E1' }}>
            <div className="ac-stat-value">{stats.assigned}</div>
            <div className="ac-stat-label">Assigned</div>
          </div>
          <div className="ac-stat-card" style={{ '--c': '#805AD5' }}>
            <div className="ac-stat-value">{stats.investigating}</div>
            <div className="ac-stat-label">Investigating</div>
          </div>
          <div className="ac-stat-card" style={{ '--c': '#3182CE' }}>
            <div className="ac-stat-value">{stats.inProgress}</div>
            <div className="ac-stat-label">In Progress</div>
          </div>
          <div className="ac-stat-card" style={{ '--c': '#E53E3E' }}>
            <div className="ac-stat-value">{stats.emergency}</div>
            <div className="ac-stat-label">Emergency</div>
          </div>
        </div>

        <div className="ac-filters">
          <div className="ac-search-wrapper">
            <span className="ac-search-icon">🔍</span>
            <input
              type="text"
              className="ac-search-input"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="ac-filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="emergency">🔴 Emergency</option>
            <option value="high">🟠 High</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🔵 Low</option>
          </select>
        </div>

        <div className="ac-tabs">
          {[
            { id: 'all', label: 'All Cases', count: stats.total },
            { id: 'assigned', label: 'Assigned', count: stats.assigned },
            { id: 'investigating', label: 'Investigating', count: stats.investigating },
            { id: 'in-progress', label: 'In Progress', count: stats.inProgress }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`ac-tab ${filterStatus === tab.id ? 'active' : ''}`}
              onClick={() => setFilterStatus(tab.id)}
            >
              {tab.label}
              <span className="ac-tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="ac-empty">
            <div className="ac-empty-icon">⏳</div>
            <h3 className="ac-empty-title">Loading your assigned cases...</h3>
          </div>
        ) : error ? (
          <div className="ac-empty">
            <div className="ac-empty-icon">⚠️</div>
            <h3 className="ac-empty-title">{error}</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ac-empty">
            <div className="ac-empty-icon">📭</div>
            <h3 className="ac-empty-title">
              {search || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'No cases match your filters'
                : 'No cases assigned to you yet'}
            </h3>
            <p className="ac-empty-sub">
              {search || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'When a department admin assigns complaints to you, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="ac-list">
            {filtered.map((c) => {
              const status = getStatusConfig(c.status)
              const priority = getPriorityConfig(c.priority)
              return (
                <div key={c._id} className="ac-case-card">
                  <div className="ac-case-header">
                    <div className="ac-case-badges">
                      <span className="ac-case-id">{c.id}</span>
                      <span
                        className="ac-badge"
                        style={{ background: priority.color + '20', color: priority.color }}
                      >
                        {priority.icon} {priority.label}
                      </span>
                      <span
                        className="ac-badge"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="ac-case-title">{c.title}</h3>

                  <div className="ac-case-meta">
                    <span>{c.categoryIcon} {c.category}</span>
                    <span>📍 {c.location}</span>
                    <span>👥 {c.affectedPeople} affected</span>
                    {c.hoursLeft !== null && (
                      <span
                        style={{
                          color: c.hoursLeft < 0 ? '#E53E3E' : c.hoursLeft < 24 ? '#F7931E' : 'var(--text-tertiary)',
                          fontWeight: 700
                        }}
                      >
                        ⏰ {c.hoursLeft < 0
                          ? `Overdue by ${Math.abs(c.hoursLeft)}h`
                          : `${c.hoursLeft}h left`}
                      </span>
                    )}
                  </div>

                  <div className="ac-case-footer">
                    <span className="ac-case-citizen">👤 {c.citizen}</span>
                    <div className="ac-case-actions">
                      <button
                        className="ac-btn-secondary"
                        onClick={() => navigate(`/officer/case/${c._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="ac-btn-primary"
                        onClick={() => navigate(`/officer/investigate/${c._id}`)}
                      >
                        🔍 Investigate
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AssignedComplaints