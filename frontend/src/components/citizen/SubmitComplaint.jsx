import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './SubmitComplaint.css'

const SubmitComplaint = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  // ✅ Category IDs match the enum in the backend Complaint model exactly
  const categories = [
    { id: 'roads', name: 'Roads & Infrastructure', icon: '🛣️' },
    { id: 'water', name: 'Water Supply', icon: '💧' },
    { id: 'sanitation', name: 'Sanitation & Waste', icon: '🗑️' },
    { id: 'electricity', name: 'Electricity', icon: '⚡' },
    { id: 'safety', name: 'Public Safety', icon: '🚨' },
    { id: 'transport', name: 'Transport', icon: '🚌' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'environment', name: 'Environment', icon: '🌳' },
    { id: 'other', name: 'Other', icon: '📁' }
  ]

  const priorities = [
    { id: 'emergency', label: 'Emergency', icon: '🔴', desc: 'Immediate danger', color: '#E53E3E' },
    { id: 'high', label: 'High Priority', icon: '🟠', desc: 'Significant impact', color: '#F7931E' },
    { id: 'normal', label: 'Normal', icon: '🟡', desc: 'Routine issue', color: '#ECC94B' },
    { id: 'low', label: 'Low', icon: '🔵', desc: 'Minor issue', color: '#4299E1' }
  ]

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'normal',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    affectedPeople: 1,
    evidence: []
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState('')
  const [serverError, setServerError] = useState('')

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors({ ...errors, [field]: '' })
    setServerError('')
  }

  const updateLocation = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }))
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.trim().length < 10) newErrors.title = 'Title must be at least 10 characters'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    else if (formData.description.trim().length < 20)
      newErrors.description = 'Description must be at least 20 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.location.address.trim()) newErrors.address = 'Address is required'
    if (!formData.location.city.trim()) newErrors.city = 'City is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(step + 1)
  }

  const handleBack = () => setStep(step - 1)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      file
    }))
    setFormData((prev) => ({ ...prev, evidence: [...prev.evidence, ...newFiles] }))
  }

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setServerError('')

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        // ✅ CRITICAL FIX: Send lowercase ID ('roads', 'water') that matches backend enum
        category: formData.category,
        priority: formData.priority,
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          pincode: formData.location.pincode.trim()
        },
        // ✅ Convert affectedPeople to a number, defaulting to 1 if empty
        affectedPeople: parseInt(formData.affectedPeople, 10) || 1,
        evidence: []
      }

      const response = await api.post('/complaints', payload)

      if (response.data.success) {
        setComplaintId(response.data.complaint.complaintId)
        setSubmitted(true)
      } else {
        setServerError(response.data.message || 'Failed to submit complaint')
      }
    } catch (error) {
      console.error('Submit complaint error:', error)
      setServerError(
        error.response?.data?.message ||
          'Failed to submit complaint. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (submitted) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Complaint Submitted">
        <div className="success-screen">
          <div className="success-icon-big">✅</div>
          <h2>Complaint Submitted Successfully!</h2>
          <p>Your complaint has been registered in the system.</p>
          <div className="success-id-box">
            <div className="id-label">Your Complaint ID</div>
            <div className="id-value">{complaintId}</div>
          </div>
          <p className="success-note">
            📧 A confirmation has been sent to your email. You can track your
            complaint using the ID above.
          </p>
          <div className="success-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/citizen/complaints')}
            >
              📋 View My Complaints
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  title: '',
                  category: '',
                  priority: 'normal',
                  description: '',
                  location: { address: '', city: '', state: '', pincode: '' },
                  affectedPeople: 1,
                  evidence: []
                })
                setStep(1)
              }}
            >
              ➕ Submit Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Submit Complaint">
      <div className="submit-container">
        {/* Progress Indicator */}
        <div className="progress-steps">
          {[
            { n: 1, label: 'Basic Info' },
            { n: 2, label: 'Location' },
            { n: 3, label: 'Evidence' },
            { n: 4, label: 'Review' }
          ].map((s) => (
            <div
              key={s.n}
              className={`progress-step ${step === s.n ? 'active' : ''} ${
                step > s.n ? 'completed' : ''
              }`}
            >
              <div className="step-circle">{step > s.n ? '✓' : s.n}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="complaint-form">
          {serverError && (
            <div
              style={{
                background: '#FED7D7',
                color: '#C53030',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            >
              ⚠️ {serverError}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="step-content">
              <h2 className="step-title">📝 Complaint Details</h2>

              <div className="form-group">
                <label>Complaint Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Brief summary (e.g., Broken street light near Anna Nagar)"
                  maxLength="200"
                  className={errors.title ? 'error' : ''}
                />
                <div className="input-hint">
                  {formData.title.length}/200 characters
                  {errors.title && <span className="error-msg"> {errors.title}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <div className="category-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-item ${
                        formData.category === cat.id ? 'selected' : ''
                      }`}
                      onClick={() => updateField('category', cat.id)}
                    >
                      <span className="cat-icon">{cat.icon}</span>
                      <span className="cat-name">{cat.name}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <span className="error-msg">{errors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label>Priority Level *</label>
                <div className="priority-grid">
                  {priorities.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`priority-item ${
                        formData.priority === p.id ? 'selected' : ''
                      }`}
                      onClick={() => updateField('priority', p.id)}
                      style={{ '--priority-color': p.color }}
                    >
                      <span className="priority-icon">{p.icon}</span>
                      <div className="priority-info">
                        <div className="priority-label">{p.label}</div>
                        <div className="priority-desc">{p.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the issue in detail. Include when it happened, how it affects people, etc."
                  rows="6"
                  maxLength="2000"
                  className={errors.description ? 'error' : ''}
                ></textarea>
                <div className="input-hint">
                  {formData.description.length}/2000 characters
                  {errors.description && (
                    <span className="error-msg"> {errors.description}</span>
                  )}
                </div>
              </div>

              {/* ✅ FIXED: Affected People input now allows deleting the default value */}
              <div className="form-group">
                <label>Number of Affected People</label>
                <input
                  type="number"
                  min="1"
                  value={formData.affectedPeople}
                  onChange={(e) => {
                    const value = e.target.value
                    // Allow empty string while typing so user can delete the "1"
                    updateField(
                      'affectedPeople',
                      value === '' ? '' : parseInt(value, 10)
                    )
                  }}
                  onBlur={(e) => {
                    // If left empty on blur, default back to 1
                    if (e.target.value === '') {
                      updateField('affectedPeople', 1)
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="step-content">
              <h2 className="step-title">📍 Location Details</h2>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => updateLocation('address', e.target.value)}
                  placeholder="Street address, landmark"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => updateLocation('city', e.target.value)}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-msg">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) => updateLocation('state', e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={formData.location.pincode}
                    onChange={(e) => updateLocation('pincode', e.target.value)}
                    placeholder="600001"
                    maxLength="6"
                  />
                </div>
              </div>

              <div className="location-tip">
                💡 <strong>Tip:</strong> Provide the exact location so officers
                can find the issue quickly.
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="step-content">
              <h2 className="step-title">📸 Upload Evidence (Optional)</h2>
              <p className="step-desc">
                Attach photos, videos, or documents that help explain the issue.
              </p>

              <label className="upload-dropzone">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  hidden
                />
                <span className="upload-icon">📤</span>
                <div className="upload-title">Click to upload files</div>
                <div className="upload-hint">
                  Images, videos, PDFs (max 10 MB each)
                </div>
              </label>

              {formData.evidence.length > 0 && (
                <div className="file-list">
                  <div className="file-list-header">
                    Uploaded ({formData.evidence.length})
                  </div>
                  {formData.evidence.map((file, i) => (
                    <div key={i} className="file-item">
                      <span className="file-icon">
                        {file.type.startsWith('image')
                          ? '🖼️'
                          : file.type.startsWith('video')
                          ? '🎥'
                          : '📄'}
                      </span>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{file.size} MB</div>
                      </div>
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => removeFile(i)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="step-content">
              <h2 className="step-title">✅ Review & Submit</h2>
              <p className="step-desc">
                Please review your complaint before submitting.
              </p>

              <div className="review-card">
                <div className="review-section">
                  <div className="review-label">Complaint Title</div>
                  <div className="review-value">{formData.title}</div>
                </div>

                <div className="review-row">
                  <div className="review-section">
                    <div className="review-label">Category</div>
                    <div className="review-value">
                      {categories.find((c) => c.id === formData.category)?.icon}{' '}
                      {categories.find((c) => c.id === formData.category)?.name}
                    </div>
                  </div>
                  <div className="review-section">
                    <div className="review-label">Priority</div>
                    <div className="review-value">
                      {priorities.find((p) => p.id === formData.priority)?.icon}{' '}
                      {priorities.find((p) => p.id === formData.priority)?.label}
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <div className="review-label">Description</div>
                  <div className="review-value">{formData.description}</div>
                </div>

                <div className="review-section">
                  <div className="review-label">Location</div>
                  <div className="review-value">
                    📍 {formData.location.address}, {formData.location.city}
                    {formData.location.state && `, ${formData.location.state}`}
                    {formData.location.pincode && ` - ${formData.location.pincode}`}
                  </div>
                </div>

                <div className="review-row">
                  <div className="review-section">
                    <div className="review-label">Affected People</div>
                    <div className="review-value">
                      👥 {formData.affectedPeople}
                    </div>
                  </div>
                  <div className="review-section">
                    <div className="review-label">Evidence Files</div>
                    <div className="review-value">
                      📎 {formData.evidence.length} file(s)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <button type="button" className="btn-nav-back" onClick={handleBack}>
                ← Back
              </button>
            )}
            {step < 4 && (
              <button type="button" className="btn-nav-next" onClick={handleNext}>
                Next →
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="btn-nav-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  <>✅ Submit Complaint</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default SubmitComplaint