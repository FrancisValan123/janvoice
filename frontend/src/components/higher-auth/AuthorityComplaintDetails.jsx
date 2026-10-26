import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import '../department/DepartmentComplaintDetails.css' 

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

const AuthorityComplaintDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/authority/dashboard' },
    { icon: '🚨', label: 'Escalated Cases', path: '/authority/escalated' },
    { icon: '📈', label: 'Performance', path: '/authority/performance' },
    { icon: '⏰', label: 'Overdue Review', path: '/authority/overdue' },
    { icon: '🏛️', label: 'Departments', path: '/authority/departments' },
    { icon: '📄', label: 'Action Reports', path: '/authority/reports' },
    { icon: '📊', label: 'Statistics', path: '/authority/statistics' },
    { icon: '💡', label: 'Recommendations', path: '/authority/recommendations' }
  ]

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resolving, setResolving] = useState(false) // ✅ State for resolving

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get(`/complaints/${id}`)
        const c = response.data?.complaint || response.data

        if (!c) {
          setError('Complaint not found')
          return
        }

        const formatted = {
          _id: c._id,
          id: c.complaintId || c._id,
          title: c.title || 'Untitled',
          description: c.description || 'No description provided.',
          category: getCategoryDisplay(c.category),
          categoryIcon: getCategoryIcon(c.category),
          priority: c.priority || 'normal',
          status: c.status || 'pending',
          department: c.department || 'General',
          affectedPeople: c.affectedPeople || 1,
          location: c.location || {},
          locationText: c.location?.address
            ? `${c.location.address}${c.location.city ? ', ' + c.location.city : ''}${c.location.state ? ', ' + c.location.state : ''}${c.location.pincode ? ' - ' + c.location.pincode : ''}`
            : 'Location not specified',
          assignedTo: c.assignedTo
            ? {
                name: c.assignedTo.name || 'Officer',
                phone: c.assignedTo.phone || 'N/A',
                email: c.assignedTo.email || 'N/A'
              }
            : null,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          deadline: c.deadline,
          resolvedAt: c.resolvedAt,
          evidence: c.evidence || [],
          actionEvidence: c.actionEvidence || [],
          statusHistory: c.statusHistory || [],
          feedback: c.feedback || null
        }

        setComplaint(formatted)
      } catch (err) {
        console.error('Failed to fetch complaint:', err)
        setError(
          err.response?.data?.message ||
            'Failed to load complaint details. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchComplaint()
  }, [id])

  // ✅ NEW: Handle Resolving the Case
  const handleResolve = async () => {
    if (!window.confirm('Are you sure you want to mark this case as resolved?')) return
    
    setResolving(true)
    try {
      await api.put(`/complaints/${id}/status`, {
        status: 'resolved',
        note: 'Case reviewed and resolved by Higher Authority.'
      })
      alert('Case marked as resolved successfully.')
      navigate('/authority/escalated') // Go back to list
    } catch (err) {
      console.error('Resolve error:', err)
      alert(err.response?.data?.message || 'Failed to resolve case.')
    } finally {
      setResolving(false)
    }
  }

  const formatDate = (dateStr, withTime = false) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    if (isNaN(d)) return 'N/A'
    if (withTime) {
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return d.toISOString().split('T')[0]
  }

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const getStatusConfig = (status) => {
    const map = {
      pending: { label: 'Pending', color: '#ED8936', bg: '#FEEBC8', icon: '⏳' },
      assigned: { label: 'Assigned', color: '#4299E1', bg: '#BEE3F8', icon: '👤' },
      investigating: { label: 'Investigating', color: '#805AD5', bg: '#E9D8FD', icon: '🔍' },
      'in-progress': { label: 'In Progress', color: '#3182CE', bg: '#BEE3F8', icon: '🚧' },
      resolved: { label: 'Resolved', color: '#38A169', bg: '#C6F6D5', icon: '✅' },
      rejected: { label: 'Rejected', color: '#E53E3E', bg: '#FED7D7', icon: '❌' },
      escalated: { label: 'Escalated', color: '#C53030', bg: '#FED7D7', icon: '🚨' },
      closed: { label: 'Closed', color: '#4A5568', bg: '#E2E8F0', icon: '🔒' }
    }
    return map[status] || map.pending
  }

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { label: 'Emergency', color: '#E53E3E', icon: '🔴', bg: '#FED7D7' },
      high: { label: 'High', color: '#F7931E', icon: '🟠', bg: '#FEEBC8' },
      normal: { label: 'Normal', color: '#ECC94B', icon: '🟡', bg: '#FEFCBF' },
      low: { label: 'Low', color: '#4299E1', icon: '🔵', bg: '#BEE3F8' }
    }
    return map[p] || map.normal
  }

  const renderEvidenceItem = (file, i, isAction = false) => {
    const isImage = file.type === 'image'
    const isVideo = file.type === 'video'

    return (
      <a
        key={file.publicId || i}
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="evidence-item"
        style={{ textDecoration: 'none' }}
      >
        {isImage ? (
          <div className="evidence-thumb" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-surface-tertiary)' }}>
            <img
              src={file.url}
              alt={file.name || `Evidence ${i + 1}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', display: 'block' }}
            />
          </div>
        ) : (
          <div className="evidence-thumb" style={isAction ? { background: 'rgba(56, 161, 105, 0.2)' } : {}}>
            {isVideo ? '🎥' : isAction ? '📸' : '📄'}
          </div>
        )}
        <div className="evidence-info">
          <div className="evidence-name" title={file.name || file.url}>
            {file.name || file.url?.split('/').pop() || `File ${i + 1}`}
          </div>
          <div className="evidence-size">
            {file.size ? formatSize(file.size) : file.type || 'file'}
          </div>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 700, marginLeft: 'auto' }}>
          Open ↗
        </span>
      </a>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Complaint Details">
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
          Loading complaint details...
        </div>
      </DashboardLayout>
    )
  }

  if (error || !complaint) {
    return (
      <DashboardLayout role="higher_authority" menuItems={menuItems} title="Complaint Details">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 style={{ color: '#E53E3E', marginBottom: '16px' }}>
            ⚠️ {error || 'Complaint not found'}
          </h2>
          <button className="back-btn" onClick={() => navigate('/authority/escalated')}>
            ← Back to Escalated Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const status = getStatusConfig(complaint.status)
  const priority = getPriorityConfig(complaint.priority)

  return (
    <DashboardLayout role="higher_authority" menuItems={menuItems} title="Complaint Details">
      <div className="details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="details-header-card">
          <div className="header-top">
            <div>
              <div className="details-id">{complaint.id}</div>
              <h1 className="details-title">{complaint.title}</h1>
            </div>
            <div className="header-badges">
              <span className="status-pill" style={{ background: status.bg, color: status.color }}>
                {status.icon} {status.label.toUpperCase()}
              </span>
              <span className="priority-pill" style={{ background: priority.bg, color: priority.color }}>
                {priority.icon} {priority.label}
              </span>
            </div>
          </div>

          <div className="header-meta">
            <span>{complaint.categoryIcon} {complaint.category}</span>
            <span>🏛️ {complaint.department}</span>
            <span>📅 Submitted: {formatDate(complaint.createdAt)}</span>
            <span>🔄 Updated: {formatDate(complaint.updatedAt)}</span>
          </div>
        </div>

        <div className="details-grid">
          <div className="details-main">
            <div className="details-card">
              <h3 className="details-card-title">📝 Description</h3>
              <p className="details-text">{complaint.description}</p>
            </div>

            <div className="details-card">
              <h3 className="details-card-title">
                📎 Evidence ({complaint.evidence.length})
              </h3>
              {complaint.evidence.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                  No evidence uploaded.
                </p>
              ) : (
                <div className="evidence-grid">
                  {complaint.evidence.map((file, i) => renderEvidenceItem(file, i, false))}
                </div>
              )}
            </div>

            {complaint.actionEvidence.length > 0 && (
              <div className="details-card">
                <h3 className="details-card-title">📸 Officer Action Evidence</h3>
                <div className="evidence-grid">
                  {complaint.actionEvidence.map((file, i) => renderEvidenceItem(file, i, true))}
                </div>
              </div>
            )}

            <div className="details-card">
              <h3 className="details-card-title">📅 Status Timeline</h3>
              {complaint.statusHistory.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No timeline entries yet.</p>
              ) : (
                <div className="details-timeline">
                  {complaint.statusHistory.map((item, i) => {
                    const sConfig = getStatusConfig(item.status)
                    return (
                      <div key={i} className={`dt-item ${i === complaint.statusHistory.length - 1 ? 'current' : ''}`}>
                        <div className="dt-marker" style={{ borderColor: sConfig.color }}>
                          {sConfig.icon}
                        </div>
                        <div className="dt-content">
                          <div className="dt-status">{sConfig.label}</div>
                          <div className="dt-date">{formatDate(item.updatedAt, true)}</div>
                          <div className="dt-desc">{item.note || `Status: ${item.status}`}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="details-sidebar">
            <div className="details-card">
              <h3 className="details-card-title">👤 Assigned Officer</h3>
              {complaint.assignedTo ? (
                <div className="officer-card">
                  <div className="officer-avatar">{complaint.assignedTo.name.charAt(0).toUpperCase()}</div>
                  <div className="officer-name">{complaint.assignedTo.name}</div>
                  <div className="officer-dept">{complaint.department}</div>
                  <div className="officer-contact">
                    <div>📞 {complaint.assignedTo.phone}</div>
                    <div>📧 {complaint.assignedTo.email}</div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Not assigned to an officer yet.</p>
              )}
            </div>

            <div className="details-card">
              <h3 className="details-card-title">📍 Location</h3>
              <p className="location-text">{complaint.locationText}</p>
            </div>

            <div className="details-card">
              <h3 className="details-card-title">📊 Stats</h3>
              <div className="stats-list">
                <div className="stat-row">
                  <span className="stat-key">Affected People</span>
                  <span className="stat-val">👥 {complaint.affectedPeople}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Deadline</span>
                  <span className="stat-val">⏰ {formatDate(complaint.deadline)}</span>
                </div>
              </div>
            </div>

            {/* ✅ FIXED: Added Resolve button */}
            <div className="details-card">
              <h3 className="details-card-title">⚡ Authority Actions</h3>
              <div className="action-buttons">
                <button 
                  className="btn-action primary"
                  onClick={handleResolve}
                  disabled={resolving || complaint.status === 'resolved'}
                  style={{ 
                    background: complaint.status === 'resolved' ? '#A0AEC0' : 'linear-gradient(135deg, #38A169, #2F855A)', 
                    color: 'white',
                    cursor: complaint.status === 'resolved' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {resolving ? '⏳ Resolving...' : complaint.status === 'resolved' ? '✅ Already Resolved' : '✅ Mark as Resolved'}
                </button>
                <button 
                  className="btn-action danger"
                  onClick={() => navigate('/authority/reports')}
                >
                  📄 Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AuthorityComplaintDetails