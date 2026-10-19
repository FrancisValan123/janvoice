import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const RequestReassignment = () => {
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
  const [error, setError] = useState('')

  const [reason, setReason] = useState('')
  const [reasonCategory, setReasonCategory] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const reasons = [
    { id: 'conflict', icon: '⚔️', label: 'Conflict of Interest', desc: 'Personal or professional conflict with the case' },
    { id: 'jurisdiction', icon: '📍', label: 'Outside Jurisdiction', desc: 'Case is not in my assigned zone' },
    { id: 'expertise', icon: '🎓', label: 'Lacks Expertise', desc: 'Requires specialized skills' },
    { id: 'workload', icon: '⚖️', label: 'Workload Overload', desc: 'Currently handling too many cases' },
    { id: 'personal', icon: '👤', label: 'Personal Reasons', desc: 'Other personal circumstances' },
    { id: 'other', icon: '📝', label: 'Other', desc: 'Other reason (specify below)' }
  ]

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
        setError('Failed to load case details.')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
  }, [id])

  // ===================================
  // HANDLE SUBMIT
  // ===================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reasonCategory) {
      setError('Please select a reason category')
      return
    }
    if (reason.trim().length < 20) {
      setError('Please provide a detailed reason (at least 20 characters)')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await api.post(`/complaints/${id}/request-reassign`, {
        reason: `[${reasonCategory.toUpperCase()}] ${reason.trim()}`,
        urgency // Sending urgency as well, even if backend ignores it for now
      })

      setSuccess(true)
      setTimeout(() => navigate('/officer/assigned'), 2000)
    } catch (err) {
      console.error('Failed to submit request:', err)
      setError(err.response?.data?.message || 'Failed to submit reassignment request.')
    } finally {
      setSubmitting(false)
    }
  }

  // ===================================
  // NO ID STATE
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Request Reassignment">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔄</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To request a reassignment, please open a case from your Assigned Cases first.
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ED8936, #DD6B20)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)' }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Request Reassignment">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Request Reassignment">
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Reassignment request submitted! Redirecting...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Warning */}
        <div style={{ background: 'rgba(237, 137, 54, 0.1)', border: '2px solid #FBD38D', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#744210', marginBottom: '4px' }}>Use Responsibly</div>
            <div style={{ fontSize: '13px', color: '#975A16', lineHeight: 1.5 }}>
              Reassignment requests will be reviewed by your department admin. Provide a valid reason to avoid delays.
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              🔄 Request Case Reassignment
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Request to reassign case <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId || id}</strong> to another officer
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Case Info */}
            <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Case</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {complaint?.title || 'Unknown Case'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {complaint?.priority === 'emergency' ? '🚨 Emergency' : '📋 ' + (complaint?.priority || 'Normal')} • 📍 {complaint?.location?.address || 'Location not specified'}
              </div>
            </div>

            {/* Reason Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Reason Category *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {reasons.map((r) => {
                  const selected = reasonCategory === r.id
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReasonCategory(r.id)}
                      style={{
                        padding: '14px',
                        background: selected ? 'rgba(128, 90, 213, 0.1)' : 'var(--bg-surface-secondary)',
                        border: selected ? '2px solid #805AD5' : '2px solid var(--border-light)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{r.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? '#805AD5' : 'var(--text-primary)', marginBottom: '2px' }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{r.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Detailed Reason */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Detailed Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain in detail why this case should be reassigned..."
                rows="5"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{reason.length < 20 ? `${20 - reason.length} more characters required` : '✓ Sufficient length'}</span>
                <span>{reason.length}/500</span>
              </div>
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Urgency Level
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'low', label: '🟢 Low', desc: 'No time pressure' },
                  { id: 'normal', label: '🟡 Normal', desc: 'Handle within a few days' },
                  { id: 'urgent', label: '🔴 Urgent', desc: 'Needs immediate attention' }
                ].map((u) => {
                  const selected = urgency === u.id
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      style={{
                        flex: 1,
                        minWidth: '140px',
                        padding: '12px 16px',
                        background: selected ? 'var(--bg-surface)' : 'var(--bg-surface-secondary)',
                        border: selected ? '2px solid #FF6B35' : '2px solid var(--border-light)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? '#FF6B35' : 'var(--text-primary)', marginBottom: '2px' }}>
                        {u.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{u.desc}</div>
                    </button>
                  )
                })}
              </div>
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
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #ED8936, #DD6B20)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(237, 137, 54, 0.3)' }}
              >
                {submitting ? '⏳ Submitting...' : '🔄 Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RequestReassignment