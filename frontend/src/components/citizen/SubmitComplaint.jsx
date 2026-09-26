import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { saveComplaint } from '../../utils/complaintStorage'
import { calculatePriority } from '../../utils/priorityCalculator'
import './SubmitComplaint.css'

const SubmitComplaint = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'normal',
    description: '',
    location: '',
    affectedPeople: '',
    evidence: null
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [autoPriority, setAutoPriority] = useState(null)
  const [useAuto, setUseAuto] = useState(true)

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const categories = [
    'Roads & Potholes',
    'Street Lights',
    'Water Supply',
    'Sanitation & Garbage',
    'Drainage',
    'Electricity',
    'Public Safety',
    'Illegal Construction',
    'Other'
  ]

  const priorities = [
    { id: 'emergency', label: '🔴 Emergency', desc: 'Immediate attention' },
    { id: 'high', label: '🟠 High Priority', desc: 'Significant impact' },
    { id: 'normal', label: '🟡 Normal', desc: 'Routine civic issue' },
    { id: 'low', label: '🔵 Low', desc: 'Minor issue' }
  ]

  // Auto-calculate priority whenever form data changes
  useEffect(() => {
    if (formData.title || formData.description || formData.category) {
      const result = calculatePriority({
        category: formData.category,
        title: formData.title,
        description: formData.description,
        affectedPeople: formData.affectedPeople
      })
      setAutoPriority(result)

      if (useAuto) {
        setFormData((prev) => ({ ...prev, priority: result.priority }))
      }
    }
  }, [
    formData.title,
    formData.category,
    formData.description,
    formData.affectedPeople,
    useAuto
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, evidence: e.target.files[0] })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 
const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return
  setLoading(true)

  // Save to localStorage
  const saved = saveComplaint({
    ...formData,
    submittedBy: 'citizen@test.com'
  })

  console.log('📝 Complaint Saved:', saved)
  console.log('📝 Complaint Number:', saved.complaintNumber)

  setTimeout(() => {
    setLoading(false)
    setSuccess(true)
    // Redirect after success
    setTimeout(() => navigate('/citizen/complaints'), 2000)  // ← Go to complaints list
  }, 1500)
}

  if (success) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Success">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>Complaint Submitted!</h2>
          <p>Priority: <strong>{formData.priority.toUpperCase()}</strong></p>
          <p>Redirecting to dashboard...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Submit New Complaint">
      <div className="submit-complaint-container">
        <div className="form-header-banner">
          <h2>📝 Submit a New Complaint</h2>
          <p>Fill out the details below. Priority will be auto-detected by system.</p>
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Complaint Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Broken street light on Anna Nagar Main Road"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Category & Location */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Anna Nagar, Chennai"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          {/* Auto Priority Panel */}
          {autoPriority && (
            <div className="auto-priority-panel">
              <div className="auto-priority-header">
                <h3>🤖 System-Calculated Priority</h3>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={useAuto}
                    onChange={(e) => setUseAuto(e.target.checked)}
                  />
                  <span>Use auto priority</span>
                </label>
              </div>

              <div className={`auto-priority-result priority-${autoPriority.priority}`}>
                <span className="result-badge">
                  {autoPriority.priority === 'emergency' && '🔴 Emergency'}
                  {autoPriority.priority === 'high' && '🟠 High Priority'}
                  {autoPriority.priority === 'normal' && '🟡 Normal'}
                  {autoPriority.priority === 'low' && '🔵 Low'}
                </span>
                <span className="result-score">Score: {autoPriority.score}</span>
              </div>

              {autoPriority.reasons.length > 0 && (
                <div className="priority-reasons">
                  <strong>Why this priority?</strong>
                  <ul>
                    {autoPriority.reasons.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Manual Priority */}
          <div className="form-group">
            <label>
              Priority Level * {useAuto && <span style={{ color: '#718096', fontSize: '12px' }}>(auto-selected)</span>}
            </label>
            <div className="priority-grid">
              {priorities.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={useAuto}
                  className={`priority-card ${formData.priority === p.id ? 'active' : ''} priority-${p.id}`}
                  onClick={() => setFormData({ ...formData, priority: p.id })}
                  style={{ opacity: useAuto ? 0.6 : 1, cursor: useAuto ? 'not-allowed' : 'pointer' }}
                >
                  <span className="priority-label">{p.label}</span>
                  <span className="priority-desc">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows="5"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Affected People */}
          <div className="form-group">
            <label htmlFor="affectedPeople">Number of People Affected (Optional)</label>
            <input
              type="number"
              id="affectedPeople"
              name="affectedPeople"
              value={formData.affectedPeople}
              onChange={handleChange}
              placeholder="e.g., 50"
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label htmlFor="evidence">Upload Evidence (Optional)</label>
            <div className="file-upload-box">
              <input
                type="file"
                id="evidence"
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="evidence" className="file-upload-label">
                <span className="upload-icon">📎</span>
                <span>
                  {formData.evidence
                    ? `Selected: ${formData.evidence.name}`
                    : 'Click to upload images, videos, or PDF'}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/citizen/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit-complaint" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>📤 Submit Complaint</>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default SubmitComplaint