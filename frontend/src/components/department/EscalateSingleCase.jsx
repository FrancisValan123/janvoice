import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const EscalateSingleCase = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/department/dashboard' },
    { icon: '👥', label: 'Assign Officers', path: '/department/assign' },
    { icon: '⏰', label: 'Monitor Deadlines', path: '/department/deadlines' },
    { icon: '🚨', label: 'Escalate Cases', path: '/department/escalate' },
    { icon: '📈', label: 'Analytics', path: '/department/analytics' },
    { icon: '📄', label: 'SLA Reports', path: '/department/sla' },
    { icon: '👨‍💼', label: 'Officer Performance', path: '/department/officers' },
    { icon: '⚙️', label: 'Settings', path: '/department/settings' }
  ]

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/complaints/${id}`)
        const c = res.data?.complaint || res.data
        setComplaint(c)
      } catch (err) {
        console.error('Failed to load complaint:', err)
        setError('Failed to load complaint details.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchComplaint()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (reason.trim().length < 20) {
      setError('Please provide a detailed reason (at least 20 characters)')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // ✅ FIXED: Call the correct backend endpoint we just created
      await api.put(`/departments/escalate/${id}`, { reason })
      setSuccess(true)
      setTimeout(() => navigate('/department/deadlines'), 2000)
    } catch (err) {
      console.error('Escalation error:', err)
      setError(err.response?.data?.message || 'Failed to escalate case.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Case">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    )
  }

  if (!complaint) {
    return (
      <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Case">
        <div style={{ textAlign: 'center', padding: '60px', color: '#E53E3E' }}>
          ⚠️ {error || 'Complaint not found'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="department_admin" menuItems={menuItems} title="Escalate Case">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Case escalated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Warning Banner */}
        <div style={{ background: 'linear-gradient(135deg, #742A2A, #C53030)', borderRadius: '14px', padding: '24px', color: 'white', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#FFFFFF' }}>
            🚨 Escalate to Higher Authority
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9, color: '#E2E8F0' }}>
            This action will notify the Higher Authority and System Admins to intervene in this case.
          </p>
        </div>

        {/* Case Summary */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #FF6B35' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Case Details</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{complaint.title}</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span>ID: <strong>{complaint.complaintId}</strong></span>
            <span>Category: <strong>{complaint.category}</strong></span>
            <span>Assigned To: <strong>{complaint.assignedTo?.name || 'Unassigned'}</strong></span>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Reason for Escalation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this case requires higher authority intervention..."
                rows="5"
                maxLength="1000"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{reason.length < 20 ? `${20 - reason.length} more chars required` : '✓'}</span>
                <span>{reason.length}/1000</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                style={{ padding: '14px 28px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? '⏳ Escalating...' : '🚨 Confirm Escalation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscalateSingleCase