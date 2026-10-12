import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './MyComplaints.css'

// ===================================
// CATEGORY HELPERS
// ===================================
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

const MyComplaints = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get('/complaints/my')

        const rawData =
          response.data?.data ||
          response.data?.complaints ||
          (Array.isArray(response.data) ? response.data : [])

        const formattedComplaints = rawData.map((c) => ({
          _id: c._id, // ✅ MongoDB _id — needed for navigation
          id: c.complaintId || c._id || 'N/A', // Display ID (JV2026001)
          title:
            c.title ||
            (c.description ? c.description.substring(0, 50) + '...' : 'Untitled'),
          category: getCategoryDisplay(c.category),
          categoryIcon: getCategoryIcon(c.category),
          status: c.status || 'pending',
          priority: c.priority || 'normal',
          date: c.createdAt
            ? new Date(c.createdAt).toISOString().split('T')[0]
            : 'N/A',
          updated:
            c.updatedAt || c.createdAt
              ? new Date(c.updatedAt || c.createdAt).toISOString().split('T')[0]
              : 'N/A',
          assignedTo: c.assignedTo?.name || c.assignedTo || 'Not assigned yet',
          location:
            c.location?.address ||
            c.location ||
            c.address ||
            'Location not specified'
        }))

        setComplaints(formattedComplaints)
      } catch (err) {
        console.error('Failed to fetch complaints:', err)
        setError(
          err.response?.data?.message ||
            'Failed to load complaints. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
      investigating: {
        label: 'Investigating',
        color: '#805AD5',
        bg: '#E9D8FD',
        icon: '🔍'
      },
      'in-progress': {
        label: 'In Progress',
        color: '#3182CE',
        bg: '#BEE3F8',
        icon: '🚧'
      },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' }
    }
    return map[status] || map.pending
  }

  const getPriorityConfig = (priority) => {
    const map = {
      emergency: { label: 'Emergency', icon: '🔴', color: '#E53E3E' },
      high: { label: 'High', icon: '🟠', color: '#F7931E' },
      normal: { label: 'Normal', icon: '🟡', color: '#ECC94B' },
      low: { label: 'Low', icon: '🔵', color: '#4299E1' }
    }
    return map[priority] || map.normal
  }

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    active: complaints.filter((c) =>
      ['assigned', 'investigating', 'in-progress'].includes(c.status)
    ).length,
    resolved: complaints.filter((c) => c.status === 'resolved').length
  }

  const filtered = complaints
    .filter((c) => {
      const matchFilter = filterStatus === 'all' || c.status === filterStatus
      const matchSearch =
        !search ||
        (c.id && c.id.toLowerCase().includes(search.toLowerCase())) ||
        (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
        (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
      return matchFilter && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'priority') {
        const order = { emergency: 0, high: 1, normal: 2, low: 3 }
        return order[a.priority] - order[b.priority]
      }
      return 0
    })

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="My Complaints">
      <div className="mycomplaints-container">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="mini-stat" style={{ '--c': '#FF6B35' }}>
            <div className="ms-icon">📋</div>
            <div>
              <div className="ms-value">{stats.total}</div>
              <div className="ms-label">Total</div>
            </div>
          </div>
          <div className="mini-stat" style={{ '--c': '#ED8936' }}>
            <div className="ms-icon">⏳</div>
            <div>
              <div className="ms-value">{stats.pending}</div>
              <div className="ms-label">Pending</div>
            </div>
          </div>
          <div className="mini-stat" style={{ '--c': '#3182CE' }}>
            <div className="ms-icon">🚧</div>
            <div>
              <div className="ms-value">{stats.active}</div>
              <div className="ms-label">Active</div>
            </div>
          </div>
          <div className="mini-stat" style={{ '--c': '#38A169' }}>
            <div className="ms-icon">✅</div>
            <div>
              <div className="ms-value">{stats.resolved}</div>
              <div className="ms-label">Resolved</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="investigating">Investigating</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          <div className="toolbar-right">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ▦
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>

            <Link to="/citizen/submit" className="btn-new-complaint">
              ➕ New Complaint
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Loading your complaints...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
            {error}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="results-count">
            Showing <strong>{filtered.length}</strong> of{' '}
            <strong>{complaints.length}</strong> complaints
          </div>
        )}

        {/* Complaints Grid/List */}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Complaints Found</h3>
              <p>
                {search || filterStatus !== 'all'
                  ? 'No complaints match your filters.'
                  : "You haven't submitted any complaints yet."}
              </p>
              {search || filterStatus !== 'all' ? (
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSearch('')
                    setFilterStatus('all')
                  }}
                >
                  Clear Filters
                </button>
              ) : (
                <Link to="/citizen/submit" className="btn-primary">
                  📝 Submit First Complaint
                </Link>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'complaints-grid' : 'complaints-list'}>
              {filtered.map((c) => {
                const status = getStatusConfig(c.status)
                const priority = getPriorityConfig(c.priority)

                return (
                  <div
                    key={c._id}
                    className={`complaint-card ${viewMode}`}
                    // ✅ FIXED: navigate using _id (Mongo ObjectId) and plural /complaints/
                    onClick={() => navigate(`/citizen/complaints/${c._id}`)}
                  >
                    <div
                      className="card-priority-bar"
                      style={{ background: priority.color }}
                    ></div>

                    <div className="card-header">
                      <div className="card-id-badge">{c.id}</div>
                      <div className="card-badges">
                        <span
                          className="priority-badge"
                          style={{
                            background: priority.color + '20',
                            color: priority.color
                          }}
                        >
                          {priority.icon} {priority.label}
                        </span>
                        <span
                          className="status-badge"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="card-category">
                      <span className="category-icon">{c.categoryIcon}</span>
                      <span className="category-name">{c.category}</span>
                    </div>

                    <h3 className="card-title">{c.title}</h3>

                    <div className="card-meta">
                      <div className="meta-row">
                        <span>👤 {c.assignedTo}</span>
                      </div>
                      <div className="meta-row">
                        <span>📍 {c.location}</span>
                      </div>
                      <div className="meta-row meta-dates">
                        <span>📅 {c.date}</span>
                        <span>🔄 {c.updated}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <span className="view-link">View Details →</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyComplaints