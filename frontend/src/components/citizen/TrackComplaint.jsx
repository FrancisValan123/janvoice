import React, { useState } from 'react'
import DashboardLayout from '../common/DashboardLayout'
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
  const [searching, setSearching] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState('')

  // Demo data
  const demoComplaint = {
    id: 'JV2026001',
    title: 'Broken street light near Anna Nagar',
    category: 'Roads & Infrastructure',
    priority: 'normal',
    status: 'in-progress',
    description: 'The street light has been broken for 2 weeks causing safety issues at night.',
    location: 'Anna Nagar, Chennai - 600040',
    assignedTo: 'Officer Ravi Kumar',
    department: 'Public Works',
    createdAt: '2026-09-15',
    deadline: '2026-09-22',
    timeline: [
      { status: 'Submitted', date: '2026-09-15 10:30 AM', icon: '📝', desc: 'Complaint registered successfully' },
      { status: 'Assigned', date: '2026-09-15 02:15 PM', icon: '👤', desc: 'Assigned to Officer Ravi Kumar' },
      { status: 'Investigating', date: '2026-09-16 09:00 AM', icon: '🔍', desc: 'Officer started investigation' },
      { status: 'In Progress', date: '2026-09-18 11:30 AM', icon: '🚧', desc: 'Repair work has been initiated' },
      { status: 'Pending Resolution', date: 'In progress', icon: '⏳', desc: 'Awaiting completion' }
    ]
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchId.trim()) {
      setError('Please enter a complaint ID')
      return
    }

    setSearching(true)
    setError('')
    setComplaint(null)

    setTimeout(() => {
      setSearching(false)
      if (searchId.toUpperCase() === 'JV2026001' || searchId.length > 5) {
        setComplaint({ ...demoComplaint, id: searchId.toUpperCase() })
      } else {
        setError('No complaint found with this ID. Please check and try again.')
      }
    }, 1200)
  }

  const getStatusConfig = (status) => {
    const map = {
      'in-progress': { color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      resolved: { color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      pending: { color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { color: '#4299E1', bg: '#BEE3F8', icon: '👤' }
    }
    return map[status] || map.pending
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Track Complaint">
      <div className="track-container">
        <div className="track-header">
          <h2 className="track-title">🔍 Track Your Complaint</h2>
          <p className="track-subtitle">
            Enter your complaint ID to see real-time status and updates
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="track-form">
          <div className="search-input-wrapper">
            <span className="search-icon-large">🔍</span>
            <input
              type="text"
              value={searchId}
              onChange={(e) => { setSearchId(e.target.value); setError('') }}
              placeholder="Enter Complaint ID (e.g., JV2026001)"
              className="track-input"
            />
            <button type="submit" className="track-btn" disabled={searching}>
              {searching ? '⏳ Searching...' : 'Track →'}
            </button>
          </div>
          {error && <div className="track-error">⚠️ {error}</div>}
        </form>

        {/* Complaint Details */}
        {complaint && (
          <div className="track-result">
            {/* Header Card */}
            <div className="result-card">
              <div className="result-header">
                <div>
                  <div className="result-id">{complaint.id}</div>
                  <h3 className="result-title">{complaint.title}</h3>
                </div>
                <span
                  className="result-status"
                  style={{
                    background: getStatusConfig(complaint.status).bg,
                    color: getStatusConfig(complaint.status).color
                  }}
                >
                  {getStatusConfig(complaint.status).icon} {complaint.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="result-grid">
                <div className="result-item">
                  <div className="ri-label">📁 Category</div>
                  <div className="ri-value">{complaint.category}</div>
                </div>
                <div className="result-item">
                  <div className="ri-label">👤 Assigned Officer</div>
                  <div className="ri-value">{complaint.assignedTo}</div>
                </div>
                <div className="result-item">
                  <div className="ri-label">🏛️ Department</div>
                  <div className="ri-value">{complaint.department}</div>
                </div>
                <div className="result-item">
                  <div className="ri-label">📍 Location</div>
                  <div className="ri-value">{complaint.location}</div>
                </div>
                <div className="result-item">
                  <div className="ri-label">📅 Submitted</div>
                  <div className="ri-value">{complaint.createdAt}</div>
                </div>
                <div className="result-item">
                  <div className="ri-label">⏰ Deadline</div>
                  <div className="ri-value">{complaint.deadline}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="timeline-card">
              <h3 className="timeline-title">📅 Status Timeline</h3>
              <div className="timeline">
                {complaint.timeline.map((item, i) => (
                  <div
                    key={i}
                    className={`timeline-item ${i === complaint.timeline.length - 1 ? 'current' : ''}`}
                  >
                    <div className="timeline-marker">
                      <span className="marker-icon">{item.icon}</span>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-status">{item.status}</div>
                      <div className="timeline-date">{item.date}</div>
                      <div className="timeline-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Helper */}
        {!complaint && !error && (
          <div className="track-helper">
            <div className="helper-icon">📌</div>
            <h4>Where to find your Complaint ID?</h4>
            <p>
              Your Complaint ID (format: <strong>JV2026001</strong>) is available
              in your confirmation email, in your <strong>My Complaints</strong>{' '}
              list, and in notifications.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TrackComplaint