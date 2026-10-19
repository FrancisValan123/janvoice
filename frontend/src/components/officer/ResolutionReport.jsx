import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ResolutionReport = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // ✅ FIXED: Removed "Investigate" from sidebar
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  const [formData, setFormData] = useState({
    resolutionSummary: '',
    actionTaken: '',
    resourcesUsed: '',
    followUpRequired: false,
    followUpDate: '',
    citizenSatisfied: 'yes',
    additionalNotes: ''
  })

  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // ===================================
  // FETCH REAL COMPLAINT DETAILS
  // ===================================
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchComplaint = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/complaints/${id}`)
        setComplaint(res.data?.complaint || res.data)
      } catch (err) {
        console.error('Failed to load complaint:', err)
        setFetchError('Failed to load case details.')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
  }, [id])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2),
      file: f // Keep reference for future upload
    }))
    setFiles([...files, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ===================================
  // HANDLE SUBMIT
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (formData.resolutionSummary.trim().length < 30) {
      setSubmitError('Please provide a detailed resolution summary (at least 30 characters)')
      return
    }
    if (formData.actionTaken.trim().length < 20) {
      setSubmitError('Please describe the action taken (at least 20 characters)')
      return
    }

    setSubmitting(true)

    try {
      // We send the resolution summary as a status update note
      const noteText = `
RESOLUTION SUMMARY: ${formData.resolutionSummary}
ACTION TAKEN: ${formData.actionTaken}
${formData.resourcesUsed ? `RESOURCES USED: ${formData.resourcesUsed}\n` : ''}
${formData.additionalNotes ? `ADDITIONAL NOTES: ${formData.additionalNotes}\n` : ''}
FOLLOW-UP: ${formData.followUpRequired ? `Required on ${formData.followUpDate}` : 'Not required'}
CITIZEN SATISFACTION: ${formData.citizenSatisfied.toUpperCase()}
      `.trim()

      await api.put(`/complaints/${id}/status`, {
        status: 'resolved',
        note: noteText
      })

      setSuccess(true)
      setTimeout(() => navigate('/officer/assigned'), 2000)
    } catch (err) {
      console.error('Failed to submit report:', err)
      setSubmitError(err.response?.data?.message || 'Failed to submit resolution report.')
    } finally {
      setSubmitting(false)
    }
  }

  // ===================================
  // NO ID STATE
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Report">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To submit a resolution report, please open a case from your Assigned Cases first.
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Report">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Report">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Resolution report submitted! Case marked as resolved.
          </div>
        )}

        {fetchError && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {fetchError}
          </div>
        )}

        {submitError && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {submitError}
          </div>
        )}

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #38A169, #2F855A)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                ✅
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Resolution Report</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  Case: <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId || id}</strong>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Summary */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                📋 Resolution Summary *
              </label>
              <textarea
                value={formData.resolutionSummary}
                onChange={(e) => handleChange('resolutionSummary', e.target.value)}
                placeholder="Summarize how the issue was resolved..."
                rows="4"
                maxLength="800"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{formData.resolutionSummary.length < 30 ? `${30 - formData.resolutionSummary.length} more chars` : '✓'}</span>
                <span>{formData.resolutionSummary.length}/800</span>
              </div>
            </div>

            {/* Action Taken */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                ⚡ Action Taken *
              </label>
              <textarea
                value={formData.actionTaken}
                onChange={(e) => handleChange('actionTaken', e.target.value)}
                placeholder="Describe the specific actions taken to resolve the issue..."
                rows="4"
                maxLength="800"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Resources Used */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                🔧 Resources Used (Optional)
              </label>
              <input
                type="text"
                value={formData.resourcesUsed}
                onChange={(e) => handleChange('resourcesUsed', e.target.value)}
                placeholder="e.g., 2 officers, 1 truck, 5 kg cement"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Follow-up */}
            <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: formData.followUpRequired ? '14px' : 0 }}>
                <input
                  type="checkbox"
                  checked={formData.followUpRequired}
                  onChange={(e) => handleChange('followUpRequired', e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                📅 Follow-up Required
              </label>
              {formData.followUpRequired && (
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleChange('followUpDate', e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
              )}
            </div>

            {/* Citizen Satisfaction */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                😊 Citizen Satisfied?
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'yes', label: '✅ Yes', color: '#38A169' },
                  { id: 'partial', label: '🟡 Partially', color: '#ED8936' },
                  { id: 'no', label: '❌ No', color: '#E53E3E' }
                ].map((opt) => {
                  const selected = formData.citizenSatisfied === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleChange('citizenSatisfied', opt.id)}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '12px',
                        background: selected ? opt.color + '15' : 'var(--bg-surface)',
                        border: selected ? `2px solid ${opt.color}` : '2px solid var(--border-light)',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: selected ? opt.color : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit'
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Supporting Documents */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                📎 Supporting Documents (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="report-files"
              />
              <label
                htmlFor="report-files"
                style={{ display: 'block', padding: '20px', background: 'var(--bg-surface-secondary)', border: '2px dashed var(--border-medium)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>📤</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Click to upload documents</div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Photos, PDFs, reports</div>
              </label>

              {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--bg-surface-secondary)', borderRadius: '10px' }}>
                      <span style={{ fontSize: '20px' }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{f.size} MB</div>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} style={{ width: '28px', height: '28px', background: 'rgba(197, 48, 48, 0.2)', color: '#c53030', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>✖</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                📝 Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                placeholder="Any additional information..."
                rows="3"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => navigate(`/officer/case/${id}`)}
                disabled={submitting}
                style={{ padding: '14px 28px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.6 : 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}
              >
                {submitting ? '⏳ Submitting...' : '✅ Submit Resolution Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResolutionReport