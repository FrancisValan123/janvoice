import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './TrackComplaint.css'

const TrackComplaint = () => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const trimmed = searchId.trim()
    if (!trimmed) {
      setError('Please enter a complaint ID')
      return
    }

    // Accept either JV... (friendly ID) or Mongo ObjectId
    if (
      !/^JV\d{8}$/i.test(trimmed) &&
      !/^[0-9a-fA-F]{24}$/.test(trimmed)
    ) {
      setError('Please enter a valid complaint ID (e.g., JV20260001)')
      return
    }

    setLoading(true)
    try {
      const res = await api.get(`/complaints/${trimmed}`)
      const c = res.data?.complaint || res.data
      setResult(c)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Complaint not found. Please check the ID and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: 'rgba(237, 137, 54, 0.15)', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.15)', icon: '👤' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: 'rgba(128, 90, 213, 0.15)', icon: '🔍' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: 'rgba(49, 130, 206, 0.15)', icon: '🚧' },
      resolved: { label: 'Resolved', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.15)', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: 'rgba(197, 48, 48, 0.15)', icon: '🚨' }
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
    <DashboardLayout role="citizen" menuItems={menuItems} title="Track Complaint">
      <div className="tc-container">
        {/* Hero */}
        <div className="tc-hero">
          <div className="tc-hero-icon">🔍</div>
          <h1 className="tc-hero-title">Track Your Complaint</h1>
          <p className="tc-hero-sub">
            Enter your complaint ID to see real-time status and updates
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="tc-search-form">
          <div className="tc-search-wrapper">
            <span className="tc-search-icon">🔍</span>
            <input
              type="text"
              className="tc-search-input"
              placeholder="Enter Complaint ID (e.g., JV20260001)"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value)
                setError('')
              }}
              disabled={loading}
            />
            <button
              type="submit"
              className="tc-search-btn"
              disabled={loading}
            >
              {loading ? '⏳ Searching...' : 'Track →'}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="tc-error">
            ⚠️ {error}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="tc-result">
            <div className="tc-result-header">
              <div className="tc-result-id">{result.complaintId || result._id}</div>
              <span
                className="tc-result-status"
                style={{
                  background: getStatusConfig(result.status).bg,
                  color: getStatusConfig(result.status).color
                }}
              >
                {getStatusConfig(result.status).icon}{' '}
                {getStatusConfig(result.status).label}
              </span>
            </div>

            <h2 className="tc-result-title">{result.title}</h2>
            <p className="tc-result-desc">{result.description}</p>

            <div className="tc-result-grid">
              <div className="tc-result-item">
                <span className="tc-result-label">Category</span>
                <span className="tc-result-value">{result.category || 'General'}</span>
              </div>
              <div className="tc-result-item">
                <span className="tc-result-label">Priority</span>
                <span
                  className="tc-result-value"
                  style={{ color: getPriorityConfig(result.priority).color }}
                >
                  {getPriorityConfig(result.priority).icon}{' '}
                  {getPriorityConfig(result.priority).label}
                </span>
              </div>
              <div className="tc-result-item">
                <span className="tc-result-label">Location</span>
                <span className="tc-result-value">
                  {result.location?.address || 'Not specified'}
                </span>
              </div>
              <div className="tc-result-item">
                <span className="tc-result-label">Assigned To</span>
                <span className="tc-result-value">
                  {result.assignedTo?.name || 'Not assigned yet'}
                </span>
              </div>
              <div className="tc-result-item">
                <span className="tc-result-label">Submitted</span>
                <span className="tc-result-value">
                  {result.createdAt
                    ? new Date(result.createdAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
              <div className="tc-result-item">
                <span className="tc-result-label">Deadline</span>
                <span className="tc-result-value">
                  {result.deadline
                    ? new Date(result.deadline).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Card (shown when no result yet) */}
        {!result && !loading && (
          <div className="tc-info-card">
            <div className="tc-info-icon">📌</div>
            <h3 className="tc-info-title">Where to find your Complaint ID?</h3>
            <p className="tc-info-desc">
              Your Complaint ID is a code like <strong>JV20260001</strong>. It's
              available in:
            </p>
            <ul className="tc-info-list">
              <li>✉️ Your confirmation email</li>
              <li>📋 The "My Complaints" page</li>
              <li>🔔 Notifications about your complaint</li>
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TrackComplaint