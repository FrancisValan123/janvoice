import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './ComplaintHistory.css'

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

const ComplaintHistory = () => {
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
  const [selectedYear, setSelectedYear] = useState('all')

  // ===================================
  // FETCH REAL COMPLAINTS
  // ===================================
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

        // Format each complaint for display
        const formatted = rawData.map((c) => {
          const createdAt = c.createdAt ? new Date(c.createdAt) : null
          const resolvedAt = c.resolvedAt ? new Date(c.resolvedAt) : null

          // Calculate days between submitted and resolved
          let days = null
          if (createdAt && resolvedAt) {
            days = Math.round((resolvedAt - createdAt) / (1000 * 60 * 60 * 24))
          }

          return {
            _id: c._id,
            id: c.complaintId || c._id,
            title: c.title || 'Untitled',
            category: getCategoryDisplay(c.category),
            submitted: createdAt ? createdAt.toISOString().split('T')[0] : 'N/A',
            resolved: resolvedAt ? resolvedAt.toISOString().split('T')[0] : '—',
            days: days,
            rating: c.feedback?.rating || 0,
            status: c.status || 'pending',
            year: createdAt ? createdAt.getFullYear() : null
          }
        })

        // Sort newest first
        formatted.sort((a, b) => {
          if (a.submitted === 'N/A') return 1
          if (b.submitted === 'N/A') return -1
          return new Date(b.submitted) - new Date(a.submitted)
        })

        setComplaints(formatted)
      } catch (err) {
        console.error('Failed to fetch complaint history:', err)
        setError(
          err.response?.data?.message ||
            'Failed to load complaint history. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  // ===================================
  // GET AVAILABLE YEARS
  // ===================================
  const availableYears = [...new Set(complaints.map((c) => c.year).filter(Boolean))]
    .sort((a, b) => b - a) // Descending

  // ===================================
  // FILTER BY SELECTED YEAR
  // ===================================
  const filteredComplaints =
    selectedYear === 'all'
      ? complaints
      : complaints.filter((c) => c.year === parseInt(selectedYear))

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: '#E9D8FD', icon: '🔍' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' }
    }
    return map[status] || map.pending
  }

  const renderStars = (rating) => {
    if (!rating || rating === 0) return '—'
    return '⭐'.repeat(rating)
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint History">
      <div className="ch-container">
        {/* Year Tabs */}
        <div className="ch-tabs">
          <button
            className={`ch-tab ${selectedYear === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedYear('all')}
          >
            📅 All Years
          </button>
          {availableYears.map((year) => (
            <button
              key={year}
              className={`ch-tab ${selectedYear === String(year) ? 'active' : ''}`}
              onClick={() => setSelectedYear(String(year))}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Card with Table */}
        <div className="ch-card">
          {loading ? (
            <div className="ch-empty">
              <div className="ch-empty-icon">⏳</div>
              <h3 className="ch-empty-title">Loading your history...</h3>
            </div>
          ) : error ? (
            <div className="ch-empty">
              <div className="ch-empty-icon">⚠️</div>
              <h3 className="ch-empty-title">{error}</h3>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="ch-empty">
              <div className="ch-empty-icon">📭</div>
              <h3 className="ch-empty-title">No complaints yet</h3>
              <p className="ch-empty-sub">
                {selectedYear === 'all'
                  ? "You haven't submitted any complaints yet."
                  : `No complaints found for ${selectedYear}.`}
              </p>
              <Link to="/citizen/submit" className="ch-empty-btn">
                📝 Submit a Complaint
              </Link>
            </div>
          ) : (
            <div className="ch-table-wrapper">
              <table className="ch-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Submitted</th>
                    <th>Resolved</th>
                    <th>Days</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((c) => {
                    const status = getStatusConfig(c.status)
                    return (
                      <tr key={c._id}>
                        <td>
                          <span className="ch-id">{c.id}</span>
                        </td>
                        <td>
                          <span className="ch-title">{c.title}</span>
                        </td>
                        <td>
                          <span className="ch-category">{c.category}</span>
                        </td>
                        <td>{c.submitted}</td>
                        <td>{c.resolved}</td>
                        <td>
                          {c.days !== null ? (
                            <span className="ch-days">{c.days}d</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <span className="ch-rating">{renderStars(c.rating)}</span>
                        </td>
                        <td>
                          <span
                            className="ch-status"
                            style={{ background: status.bg, color: status.color }}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="ch-view-btn"
                            onClick={() => navigate(`/citizen/complaints/${c._id}`)}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        {!loading && !error && complaints.length > 0 && (
          <div className="ch-info-box">
            <span className="ch-info-icon">💡</span>
            <div className="ch-info-text">
              <strong>Looking for current complaints?</strong>
              <p>
                This page shows only your past complaint history. To view or
                manage active complaints, go to{' '}
                <Link to="/citizen/complaints" className="ch-info-link">
                  My Complaints →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ComplaintHistory