import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const RequestReassignment = () => {
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
  const [reasonCategory, setReasonCategory] = useState('')
  const [suggestedOfficer, setSuggestedOfficer] = useState('')
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

  const officers = [
    { id: 1, name: 'Priya Sharma', dept: 'Water Supply', active: 3, capacity: 8 },
    { id: 2, name: 'Meena Rao', dept: 'Sanitation', active: 4, capacity: 8 },
    { id: 3, name: 'Anand Verma', dept: 'Electricity', active: 2, capacity: 8 },
    { id: 4, name: 'Divya Menon', dept: 'Public Works', active: 5, capacity: 8 },
    { id: 5, name: 'Lakshmi Narayan', dept: 'Health', active: 1, capacity: 8 }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reasonCategory) {
      alert('Please select a reason category')
      return
    }
    if (reason.trim().length < 20) {
      alert('Please provide a detailed reason (at least 20 characters)')
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
    <DashboardLayout role="officer" menuItems={menuItems} title="Request Reassignment">
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Reassignment request submitted! Redirecting...
          </div>
        )}

        {/* Warning */}
        <div style={{ background: '#FEF5E7', border: '2px solid #FBD38D', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '24px', flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#744210', marginBottom: '4px' }}>Use Responsibly</div>
            <div style={{ fontSize: '13px', color: '#975A16', lineHeight: 1.5 }}>
              Reassignment requests will be reviewed by your department admin. Provide a valid reason to avoid delays.
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
              🔄 Request Case Reassignment
            </h2>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Request to reassign case <strong style={{ color: '#FF6B35' }}>{id || 'JV2026100'}</strong> to another officer
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Case Info */}
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Case</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>Road collapse risk on NH-45</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>🚨 Emergency • 📍 NH-45, Chennai</div>
            </div>

            {/* Reason Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
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
                        background: selected ? '#EDF2FF' : '#f7fafc',
                        border: selected ? '2px solid #805AD5' : '2px solid #e2e8f0',
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
                        <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? '#805AD5' : '#1a202c', marginBottom: '2px' }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#718096', lineHeight: 1.4 }}>{r.desc}</div>
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
                placeholder="Explain in detail why this case should be reassigned..."
                rows="5"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                <span>{reason.length < 20 ? `${20 - reason.length} more characters required` : '✓ Sufficient length'}</span>
                <span>{reason.length}/500</span>
              </div>
            </div>

            {/* Suggested Officer */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Suggested Officer (Optional)
              </label>
              <select
                value={suggestedOfficer}
                onChange={(e) => setSuggestedOfficer(e.target.value)}
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: 'white' }}
              >
                <option value="">Let admin decide</option>
                {officers.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} — {o.dept} ({o.active}/{o.capacity} active)
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
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
                        background: selected ? 'white' : '#f7fafc',
                        border: selected ? '2px solid #FF6B35' : '2px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: selected ? '#FF6B35' : '#1a202c', marginBottom: '2px' }}>
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