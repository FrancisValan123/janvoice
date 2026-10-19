import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const EscalationRequest = () => {
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

  const [reason, setReason] = useState('')
  const [category, setCategory] = useState('')
  const [urgency, setUrgency] = useState('high')
  const [requestedAction, setRequestedAction] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const categories = [
    { id: 'authority', icon: '⭐', label: 'Needs Higher Authority', desc: 'Requires intervention above department level', color: '#E53E3E' },
    { id: 'resource', icon: '💰', label: 'Resource Shortage', desc: 'Lacks budget/staff/equipment to resolve', color: '#F7931E' },
    { id: 'jurisdiction', icon: '📍', label: 'Cross-jurisdiction', desc: 'Involves multiple departments', color: '#805AD5' },
    { id: 'political', icon: '🏛️', label: 'Political Sensitivity', desc: 'Sensitive case needs special handling', color: '#C53030' },
    { id: 'safety', icon: '⚠️', label: 'Safety Risk', desc: 'Potential danger to officers or citizens', color: '#DD6B20' },
    { id: 'other', icon: '📝', label: 'Other', desc: 'Other reason (specify below)', color: '#718096' }
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
        setFetchError('Failed to load case details.')
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
    setSubmitError('')

    if (!category) {
      setSubmitError('Please select a reason category')
      return
    }
    if (reason.trim().length < 30) {
      setSubmitError('Please provide a detailed reason (at least 30 characters)')
      return
    }

    setSubmitting(true)

    try {
      const noteText = `
ESCALATION REQUEST
Category: ${category.toUpperCase()}
Urgency: ${urgency.toUpperCase()}
Reason: ${reason}
${requestedAction ? `Requested Action: ${requestedAction}` : ''}
      `.trim()

      // Mark complaint as escalated and log the reason
      await api.put(`/complaints/${id}/status`, {
        status: 'escalated',
        note: noteText
      })

      setSuccess(true)
      setTimeout(() => navigate('/officer/assigned'), 2000)
    } catch (err) {
      console.error('Failed to escalate case:', err)
      setSubmitError(err.response?.data?.message || 'Failed to escalate case.')
    } finally {
      setSubmitting(false)
    }
  }

  // ===================================
  // NO ID STATE
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Escalate Case">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚨</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To escalate a case, please open a case from your Assigned Cases first.
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)' }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Escalate Case">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Escalate Case">
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Case escalated successfully! Redirecting...
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

        {/* Warning */}
        <div style={{ background: 'linear-gradient(135deg, rgba(229, 62, 62, 0.05), rgba(229, 62, 62, 0.15))', border: '2px solid #FC8181', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>🚨</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#742A2A', marginBottom: '4px' }}>Serious Action</div>
            <div style={{ fontSize: '13px', color: '#9B2C2C', lineHeight: 1.5 }}>
              Escalation notifies higher authorities and department admins. Use only when you cannot resolve the case through normal channels.
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              🚨 Escalate Case to Higher Authority
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Escalate case <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId || id}</strong> for higher-level intervention
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Case Info */}
            <div style={{ padding: '16px', background: 'rgba(229, 62, 62, 0.05)', border: '1px solid rgba(229, 62, 62, 0.2)', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#C53030', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Case to Escalate</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {complaint?.title || 'Unknown Case'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                {complaint?.priority === 'emergency' ? '🚨 Emergency' : '📋 ' + (complaint?.priority || 'Normal')} • 📍 {complaint?.location?.address || 'Location not specified'}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                <span>📅 Assigned: {complaint?.assignedAt ? new Date(complaint.assignedAt).toLocaleDateString() : 'N/A'}</span>
                {complaint?.deadline && (
                  <span style={{ color: '#C53030', fontWeight: '700' }}>
                    ⏰ Deadline: {new Date(complaint.deadline).toLocaleDateString()}
                  </span>
                )}
                <span>👥 {complaint?.affectedPeople || 1} citizens affected</span>
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Reason Category *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {categories.map((c) => {
                  const selected = category === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: '14px',
                        background: selected ? c.color + '15' : 'var(--bg-surface-secondary)',
                        border: selected ? `2px solid ${c.color}` : '2px solid var(--border-light)',
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
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{c.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? c.color : 'var(--text-primary)', marginBottom: '2px' }}>
                          {c.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>{c.desc}</div>
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
                placeholder="Explain why this case requires higher authority intervention. Be specific about the challenges faced..."
                rows="6"
                maxLength="1000"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>{reason.length < 30 ? `${30 - reason.length} more characters required` : '✓ Sufficient length'}</span>
                <span>{reason.length}/1000</span>
              </div>
            </div>

            {/* Requested Action */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Requested Action (Optional)
              </label>
              <textarea
                value={requestedAction}
                onChange={(e) => setRequestedAction(e.target.value)}
                placeholder="What specific action do you need from higher authority?"
                rows="3"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Urgency Level
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'high', label: '🟠 High', desc: 'Within 24 hours' },
                  { id: 'critical', label: '🔴 Critical', desc: 'Immediate attention' },
                  { id: 'emergency', label: '🚨 Emergency', desc: 'Within 1 hour' }
                ].map((u) => {
                  const selected = urgency === u.id
                  const color = u.id === 'emergency' ? '#C53030' : u.id === 'critical' ? '#E53E3E' : '#F7931E'
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      style={{
                        flex: 1,
                        minWidth: '140px',
                        padding: '12px 16px',
                        background: selected ? color + '15' : 'var(--bg-surface-secondary)',
                        border: selected ? `2px solid ${color}` : '2px solid var(--border-light)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? color : 'var(--text-primary)', marginBottom: '2px' }}>
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
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #C53030, #9B2C2C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)' }}
              >
                {submitting ? '⏳ Escalating...' : '🚨 Escalate Case'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscalationRequest