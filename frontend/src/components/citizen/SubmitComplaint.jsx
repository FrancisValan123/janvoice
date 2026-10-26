import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'
import './SubmitComplaint.css'

// ===================================
// MASTER MAP: Department Name -> Icon
// This maps the DB department names to visual icons
// ===================================
const DEPARTMENT_ICONS = {
  'Public Works': '🛣️',
  'Water Supply': '💧',
  'Sanitation': '🗑️',
  'Electricity': '⚡',
  'Public Safety': '🚨',
  'Transport': '🚌',
  'Health': '🏥',
  'Education': '📚',
  'Environment': '🌳',
  'General': '📁'
}

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

  const priorities = [
    { id: 'emergency', label: 'Emergency', icon: '🔴', desc: 'Immediate danger', color: '#E53E3E' },
    { id: 'high', label: 'High Priority', icon: '🟠', desc: 'Significant impact', color: '#F7931E' },
    { id: 'normal', label: 'Normal', icon: '🟡', desc: 'Routine issue', color: '#ECC94B' },
    { id: 'low', label: 'Low', icon: '🔵', desc: 'Minor issue', color: '#4299E1' }
  ]

  // ✅ State to hold dynamic categories based on DB
  const [availableCategories, setAvailableCategories] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)

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
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState('')
  const [serverError, setServerError] = useState('')

  // ===================================
  // FETCH REAL DEPARTMENTS AND BUILD CATEGORIES
  // ===================================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments')
        const departments = res.data?.departments || []
        
        // Convert the list of departments into the category format the UI needs
        const dynamicCategories = departments.map(dept => {
          const name = dept.name
          // The backend expects the category ID to be a slug (e.g., 'public-works')
          // We also need to make sure it matches the backend's expected categories if it's strict.
          // However, the backend's complaintController maps specific slugs to departments.
          // Let's create a slug from the name.
          const slug = name.toLowerCase().replace(/\s+/g, '-')
          
          return {
            id: slug, // e.g., 'public-works'
            name: name, // e.g., 'Public Works'
            icon: DEPARTMENT_ICONS[name] || '📋', // Use mapped icon or fallback
            department: name
          }
        })

        // Always add "Other" at the end
        if (!dynamicCategories.find(c => c.name === 'General' || c.name === 'Other')) {
             dynamicCategories.push({
                id: 'other',
                name: 'Other',
                icon: '📁',
                department: 'General'
             })
        }

        setAvailableCategories(dynamicCategories)

      } catch (err) {
        console.error('Failed to load departments:', err)
        // Fallback to a basic list if API fails so the form is still usable
        setAvailableCategories([
            { id: 'other', name: 'Other', icon: '📁', department: 'General' }
        ])
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

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
    else if (formData.title.trim().length < 10)
      newErrors.title = 'Title must be at least 10 characters'
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.description.trim())
      newErrors.description = 'Description is required'
    else if (formData.description.trim().length < 20)
      newErrors.description = 'Description must be at least 20 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.location.address.trim())
      newErrors.address = 'Address is required'
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    if (formData.evidence.length + files.length > 5) {
      setServerError('Maximum 5 files allowed')
      return
    }

    setUploading(true)
    setServerError('')

    try {
      const uploadData = new FormData()
      files.forEach((file) => {
        uploadData.append('files', file)
      })

      const response = await api.post('/upload/evidence', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          evidence: [...prev.evidence, ...response.data.files]
        }))
      } else {
        setServerError(response.data.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setServerError(
        err.response?.data?.message || 'File upload failed. Please try again.'
      )
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeFile = async (index) => {
    const file = formData.evidence[index]
    if (!file) return

    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }))

    if (file.publicId) {
      try {
        await api.delete(
          `/upload/evidence/${encodeURIComponent(file.publicId)}`
        )
      } catch (err) {
        console.error('Failed to delete file from Cloudinary:', err)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setServerError('')

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        // ✅ Send the category ID (slug)
        category: formData.category, 
        priority: formData.priority,
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          pincode: formData.location.pincode.trim()
        },
        affectedPeople: parseInt(formData.affectedPeople, 10) || 1,
        evidence: formData.evidence.map((f) => ({
          url: f.url,
          publicId: f.publicId,
          type: f.type,
          name: f.name,
          size: f.size
        }))
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

  // Prevent form render until categories are loaded
  if (loadingDepartments) {
    return (
      <DashboardLayout role="citizen" menuItems={menuItems} title="Submit Complaint">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          ⏳ Loading available categories...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Submit Complaint">
      <div className="submit-container">
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
                background: 'rgba(229, 62, 62, 0.1)',
                color: '#C53030',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            >
              ⚠️ {serverError}
            </div>
          )}

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
                  {/* ✅ Renders categories fetched from DB */}
                  {availableCategories.map((cat) => (
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

              <div className="form-group">
                <label>Number of Affected People</label>
                <input
                  type="number"
                  min="1"
                  value={formData.affectedPeople}
                  onChange={(e) => {
                    const value = e.target.value
                    updateField(
                      'affectedPeople',
                      value === '' ? '' : parseInt(value, 10)
                    )
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      updateField('affectedPeople', 1)
                    }
                  }}
                />
              </div>
            </div>
          )}

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

          {step === 3 && (
            <div className="step-content">
              <h2 className="step-title">📸 Upload Evidence (Optional)</h2>
              <p className="step-desc">
                Attach photos, videos, or documents that help explain the issue.
                Max 5 files, 10MB each.
              </p>

              <label
                className="upload-dropzone"
                style={{
                  opacity: uploading ? 0.6 : 1,
                  pointerEvents: uploading ? 'none' : 'auto'
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  hidden
                  disabled={uploading || formData.evidence.length >= 5}
                />
                {uploading ? (
                  <>
                    <span className="upload-icon">⏳</span>
                    <div className="upload-title">Uploading...</div>
                    <div className="upload-hint">Please wait</div>
                  </>
                ) : (
                  <>
                    <span className="upload-icon">📤</span>
                    <div className="upload-title">
                      {formData.evidence.length >= 5
                        ? 'Maximum 5 files reached'
                        : 'Click to upload files'}
                    </div>
                    <div className="upload-hint">
                      Images, videos, PDFs (max 10 MB each) •{' '}
                      {formData.evidence.length}/5 uploaded
                    </div>
                  </>
                )}
              </label>

              {formData.evidence.length > 0 && (
                <div className="file-list">
                  <div className="file-list-header">
                    Uploaded ({formData.evidence.length})
                  </div>
                  {formData.evidence.map((file, i) => (
                    <div key={file.publicId || i} className="file-item">
                      <span className="file-icon">
                        {file.type === 'image'
                          ? '🖼️'
                          : file.type === 'video'
                          ? '🎥'
                          : '📄'}
                      </span>
                      <div className="file-info">
                        <div className="file-name">
                          {file.name ||
                            file.url?.split('/').pop() ||
                            `File ${i + 1}`}
                        </div>
                        <div className="file-size">
                          {file.size
                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                            : 'Uploaded'}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => removeFile(i)}
                        title="Remove file"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                      {availableCategories.find((c) => c.id === formData.category)?.icon}{' '}
                      {availableCategories.find((c) => c.id === formData.category)?.name}
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

          <div className="form-navigation">
            {step > 1 && (
              <button
                type="button"
                className="btn-nav-back"
                onClick={handleBack}
                disabled={uploading}
              >
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                className="btn-nav-next"
                onClick={handleNext}
                disabled={uploading}
              >
                Next →
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="btn-nav-submit"
                disabled={submitting || uploading}
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