import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { getUserComplaints } from '../../utils/complaintStorage'
import './MyComplaints.css'

const MyComplaints = () => {
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState('all')

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = () => {
    const data = getUserComplaints('citizen@test.com')
    // Sort by newest first
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setComplaints(data)
  }

  const filteredComplaints =
    filter === 'all'
      ? complaints
      : complaints.filter(
          (c) => c.status.toLowerCase().replace(' ', '-') === filter
        )

  const getPriorityLabel = (priority) => {
    const labels = {
      emergency: '🔴 Emergency',
      high: '🟠 High',
      normal: '🟡 Normal',
      low: '🔵 Low'
    }
    return labels[priority] || priority
  }

  const getStatusClass = (status) => {
    const map = {
      Pending: 'status-pending',
      Assigned: 'status-assigned',
      'In Progress': 'status-progress',
      Resolved: 'status-resolved',
      Rejected: 'status-rejected'
    }
    return map[status] || 'status-pending'
  }

  const formatDate = (isoDate) => {
    const d = new Date(isoDate)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="My Complaints">
      {/* Header */}
      <div className="complaints-header">
        <div>
          <h2>📋 My Complaints</h2>
          <p>
            Total: <strong>{complaints.length}</strong> complaints submitted
          </p>
        </div>
        <Link to="/citizen/submit" className="btn-new-complaint">
          + New Complaint
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'assigned', label: 'Assigned' },
          { id: 'in-progress', label: 'In Progress' },
          { id: 'resolved', label: 'Resolved' }
        ].map((f) => (
          <button
            key={f.id}
            className={`filter-tab ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No complaints found</h3>
          <p>
            {filter === 'all'
              ? "You haven't submitted any complaints yet."
              : `No complaints with "${filter}" status.`}
          </p>
          <Link to="/citizen/submit" className="btn-submit-first">
            Submit Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className={`complaint-card priority-border-${complaint.priority}`}
            >
              <div className="complaint-top">
                <div className="complaint-id-wrap">
                  <span className="complaint-id">
                    {complaint.complaintNumber}
                  </span>
                  <span
                    className={`priority-tag priority-tag-${complaint.priority}`}
                  >
                    {getPriorityLabel(complaint.priority)}
                  </span>
                </div>
                <span
                  className={`status-badge ${getStatusClass(complaint.status)}`}
                >
                  {complaint.status}
                </span>
                {complaint.status === 'Resolved' && (
                  <button
                    className="btn-feedback"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/citizen/feedback/${complaint.id}`)
                    }}
                  >
                    ⭐ Give Feedback
                  </button>
                )}
              </div>

              <h3 className="complaint-title">{complaint.title}</h3>
              <p className="complaint-desc">
                {complaint.description.length > 150
                  ? complaint.description.substring(0, 150) + '...'
                  : complaint.description}
              </p>

              <div className="complaint-meta">
                <span>📍 {complaint.location}</span>
                <span>🏷️ {complaint.category}</span>
                {complaint.affectedPeople && (
                  <span>👥 {complaint.affectedPeople} affected</span>
                )}
                <span>📅 {formatDate(complaint.createdAt)}</span>
              </div>

              <div className="complaint-actions">
                <Link
                  to={`/citizen/complaints/${complaint.id}`}
                  className="btn-view-details"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default MyComplaints