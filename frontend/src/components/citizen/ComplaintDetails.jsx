import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { getComplaintById } from '../../utils/complaintStorage'
import './ComplaintDetails.css'

const ComplaintDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  useEffect(() => {
    if (id) {
      const found = getComplaintById(id)
      setComplaint(found)
    }
    setLoading(false)
  }, [id])

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

  const getTimeline = (status) => {
    const steps = [
      { id: 'Pending', label: 'Complaint Submitted', icon: '📝', desc: 'Your complaint has been received' },
      { id: 'Assigned', label: 'Assigned to Officer', icon: '👨‍💼', desc: 'Officer has been assigned' },
      { id: 'In Progress', label: 'Work in Progress', icon: '🔧', desc: 'Officer is working on it' },
      { id: 'Resolved', label: 'Resolved', icon: '✅', desc: 'Issue has been resolved' }
    ]

    const statusIndex = steps.findIndex((s) => s.id === status)
    return steps.map((step, i) => ({
      ...step,
      completed: i <= statusIndex,
      active: i === statusIndex
    }))
  }

  if (loading) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint Details">
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  if (!complaint) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint Details">
        <div className="not-found">
          <div className="not-found-icon">❌</div>
          <h2>Complaint Not Found</h2>
          <p>The complaint you're looking for doesn't exist or has been removed.</p>
          <Link to="/citizen/complaints" className="btn-back">
            ← Back to My Complaints
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint Details">
      <div className="details-container">
        {/* Back Button */}
        <button className="btn-back-top" onClick={() => navigate('/citizen/complaints')}>
          ← Back
        </button>

        {/* Header Card */}
        <div className={`details-header priority-header-${complaint.priority}`}>
          <div className="header-top">
            <span className="complaint-number">{complaint.complaintNumber}</span>
            <span className="status-pill">{complaint.status}</span>
          </div>
          <h1>{complaint.title}</h1>
          <div className="header-meta">
            <span>{getPriorityLabel(complaint.priority)}</span>
            <span>📅 {formatDate(complaint.createdAt)}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="details-grid">
          {/* Left Column */}
          <div className="details-left">
            {/* Timeline */}
            <div className="info-card">
              <h3>📅 Progress Timeline</h3>
              <div className="timeline-vertical">
                {getTimeline(complaint.status).map((step, i) => (
                  <div
                    key={i}
                    className={`timeline-item ${
                      step.completed ? 'completed' : ''
                    } ${step.active ? 'active' : ''}`}
                  >
                    <div className="timeline-icon-wrap">
                      <div className="timeline-icon">{step.icon}</div>
                      {i < getTimeline(complaint.status).length - 1 && (
                        <div className="timeline-line"></div>
                      )}
                    </div>
                    <div className="timeline-info">
                      <div className="timeline-title">{step.label}</div>
                      <div className="timeline-desc">{step.desc}</div>
                      {step.active && (
                        <div className="timeline-current">Current Status</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="info-card">
              <h3>📝 Description</h3>
              <p className="description-text">{complaint.description}</p>
            </div>

            {/* Evidence */}
            {complaint.evidence && (
              <div className="info-card">
                <h3>📎 Evidence</h3>
                <div className="evidence-box">
                  <span className="evidence-icon">📄</span>
                  <div>
                    <div className="evidence-name">{complaint.evidence.name}</div>
                    {complaint.evidence.size && (
                      <div className="evidence-size">
                        {(complaint.evidence.size / 1024).toFixed(2)} KB
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="details-right">
            {/* Info Card */}
            <div className="info-card">
              <h3>📋 Complaint Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">{complaint.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">📍 {complaint.location}</span>
                </div>
                {complaint.affectedPeople && (
                  <div className="info-item">
                    <span className="info-label">People Affected</span>
                    <span className="info-value">👥 {complaint.affectedPeople}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Priority</span>
                  <span className={`info-value priority-badge priority-${complaint.priority}`}>
                    {getPriorityLabel(complaint.priority)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`info-value status-tag status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Submitted On</span>
                  <span className="info-value">{formatDate(complaint.createdAt)}</span>
                </div>
                {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{formatDate(complaint.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="info-card help-card">
              <h3>💬 Need Help?</h3>
              <p>If your complaint hasn't been addressed, you can:</p>
              <ul>
                <li>📞 Call: 1800-XXX-XXXX</li>
                <li>✉️ Email: support@janvoice.gov.in</li>
                <li>📋 Visit your local ward office</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintDetails