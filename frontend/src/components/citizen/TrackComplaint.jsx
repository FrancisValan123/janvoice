import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'
import { getComplaintById } from '../../utils/complaintStorage'
import './TrackComplaint.css'

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    setError('')
    setComplaint(null)
    setSearched(true)

    if (!complaintId.trim()) {
      setError('Please enter a complaint ID')
      return
    }

    const found = getComplaintById(complaintId.trim().toUpperCase())

    if (found) {
      setComplaint(found)
    } else {
      setError('No complaint found with this ID')
    }
  }

  // Timeline steps
  const getTimeline = (status) => {
    const steps = [
      { id: 'Pending', label: 'Complaint Submitted', icon: '📝' },
      { id: 'Assigned', label: 'Assigned to Officer', icon: '👨‍💼' },
      { id: 'In Progress', label: 'Work in Progress', icon: '🔧' },
      { id: 'Resolved', label: 'Resolved', icon: '✅' }
    ]

    const statusIndex = steps.findIndex((s) => s.id === status)
    return steps.map((step, i) => ({
      ...step,
      completed: i <= statusIndex,
      active: i === statusIndex
    }))
  }

  const formatDate = (iso) => {
    if (!iso) return 'N/A'
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityLabel = (p) => {
    const labels = {
      emergency: '🔴 Emergency',
      high: '🟠 High Priority',
      normal: '🟡 Normal',
      low: '🔵 Low'
    }
    return labels[p] || p
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Track Complaint">
      <div className="track-container">
        {/* Search Header */}
        <div className="track-header">
          <h2>🔍 Track Your Complaint</h2>
          <p>Enter your complaint ID to see the current status</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="track-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter complaint ID (e.g., JV2026123456)"
            />
            <button type="submit" className="btn-search">
              Search
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="track-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <div className="track-result">
            {/* Complaint Header */}
            <div className={`result-header priority-header-${complaint.priority}`}>
              <div>
                <div className="result-id">{complaint.complaintNumber}</div>
                <h3>{complaint.title}</h3>
              </div>
              <span className={`status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                {complaint.status}
              </span>
            </div>

            {/* Priority Badge */}
            <div className="result-priority">
              <span className={`priority-tag priority-tag-${complaint.priority}`}>
                {getPriorityLabel(complaint.priority)}
              </span>
              <span className="filed-date">
                Filed on {formatDate(complaint.createdAt)}
              </span>
            </div>

            {/* Timeline */}
            <div className="timeline-section">
              <h4>📅 Progress Timeline</h4>
              <div className="timeline">
                {getTimeline(complaint.status).map((step, i) => (
                  <div
                    key={i}
                    className={`timeline-step ${
                      step.completed ? 'completed' : ''
                    } ${step.active ? 'active' : ''}`}
                  >
                    <div className="timeline-icon">{step.icon}</div>
                    <div className="timeline-content">
                      <div className="timeline-label">{step.label}</div>
                      {step.active && (
                        <div className="timeline-status">
                          ← Current Status
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complaint Details */}
            <div className="details-section">
              <h4>📋 Complaint Details</h4>

              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{complaint.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">📍 {complaint.location}</span>
                </div>
                {complaint.affectedPeople && (
                  <div className="detail-item">
                    <span className="detail-label">People Affected</span>
                    <span className="detail-value">👥 {complaint.affectedPeople}</span>
                  </div>
                )}
                <div className="detail-item full-width">
                  <span className="detail-label">Description</span>
                  <span className="detail-value">{complaint.description}</span>
                </div>
              </div>
            </div>

            {/* Evidence */}
            {complaint.evidence && (
              <div className="evidence-section">
                <h4>📎 Evidence Attached</h4>
                <div className="evidence-file">
                  <span>📄</span> {complaint.evidence.name}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        {!complaint && (
          <div className="help-hint">
            <p>💡 <strong>Tip:</strong> Your complaint ID starts with <code>JV2026</code></p>
            <p>You can find it in your <a href="/citizen/complaints">My Complaints</a> page.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TrackComplaint