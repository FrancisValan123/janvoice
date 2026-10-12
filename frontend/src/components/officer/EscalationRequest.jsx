import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const EscalationRequest = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/officer/dashboard' },
    { icon: '📋', label: 'Assigned Cases', path: '/officer/assigned', badge: 8 },
    { icon: '🔍', label: 'Investigate', path: '/officer/investigate' },
    { icon: '📤', label: 'Upload Evidence', path: '/officer/evidence' },
    { icon: '📝', label: 'Complaint Notes', path: '/officer/notes' },
    { icon: '🔄', label: 'Reassignment', path: '/officer/reassign' },
    { icon: '🚨', label: 'Escalate Case', path: '/officer/escalate' },
    { icon: '📈', label: 'My Performance', path: '/officer/performance' },
    { icon: '📄', label: 'Resolution Report', path: '/officer/report' }
  ]

  const [reason, setReason] = useState('')
  const [category, setCategory] = useState('')
  const [urgency, setUrgency] = useState('high')
  const [requestedAction, setRequestedAction] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = [
    { id: 'authority', icon: '⭐', label: 'Needs Higher Authority', desc: 'Requires intervention above department level', color: '#E53E3E' },
    { id: 'resource', icon: '💰', label: 'Resource Shortage', desc: 'Lacks budget/staff/equipment to resolve', color: '#F7931E' },
    { id: 'jurisdiction', icon: '📍', label: 'Cross-jurisdiction', desc: 'Involves multiple departments', color: '#805AD5' },
    { id: 'political', icon: '🏛️', label: 'Political Sensitivity', desc: 'Sensitive case needs special handling', color: '#C53030' },
    { id: 'safety', icon: '⚠️', label: 'Safety Risk', desc: 'Potential danger to officers or citizens', color: '#DD6B20' },
    { id: 'other', icon: '📝', label: 'Other', desc: 'Other reason (specify below)', color: '#718096' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!category) {
      alert('Please select a reason category')
      return
    }
    if (reason.trim().length < 30) {
      alert('Please provide a detailed reason (at least 30 characters)')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => navigate('/officer/assigned'), 2000)
    }, 1200)
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Escalate Case">
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Case escalated successfully! Redirecting...
          </div>
        )}

        {/* Warning */}
        <div style={{ background: 'linear-gradient(135deg, #FFF5F5, #FED7D7)', border: '2px solid #FC8181', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>🚨</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#742A2A', marginBottom: '4px' }}>Serious Action</div>
            <div style={{ fontSize: '13px', color: '#9B2C2C', lineHeight: 1.5 }}>
              Escalation notifies higher authorities and department admins. Use only when you cannot resolve the case through normal channels.
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
              🚨 Escalate Case to Higher Authority
            </h2>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Escalate case <strong style={{ color: '#FF6B35' }}>{id || 'JV2026100'}</strong> for higher-level intervention
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Case Info */}
            <div style={{ padding: '16px', background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#C53030', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Case to Escalate</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>Road collapse risk on NH-45</div>
              <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>🚨 Emergency • 📍 NH-45, Chennai</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#718096' }}>
                <span>📅 Assigned: 2026-09-30</span>
                <span style={{ color: '#C53030', fontWeight: '700' }}>⏰ Deadline: 2 hours</span>
                <span>👥 340 citizens affected</span>
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
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
                        background: selected ? c.color + '15' : '#f7fafc',
                        border: selected ? `2px solid ${c.color}` : '2px solid #e2e8f0',
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
                        <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? c.color : '#1a202c', marginBottom: '2px' }}>
                          {c.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096', lineHeight: 1.4 }}>{c.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Detailed Reason */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Detailed Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this case requires higher authority intervention. Be specific about the challenges faced..."
                rows="6"
                maxLength="1000"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                <span>{reason.length < 30 ? `${30 - reason.length} more characters required` : '✓ Sufficient length'}</span>
                <span>{reason.length}/1000</span>
              </div>
            </div>

            {/* Requested Action */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Requested Action (Optional)
              </label>
              <textarea
                value={requestedAction}
                onChange={(e) => setRequestedAction(e.target.value)}
                placeholder="What specific action do you need from higher authority?"
                rows="3"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
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
                        background: selected ? color + '15' : '#f7fafc',
                        border: selected ? `2px solid ${color}` : '2px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? color : '#1a202c', marginBottom: '2px' }}>
                        {u.label}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{u.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ padding: '14px 28px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}
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