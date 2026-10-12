import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const StatusUpdate = () => {
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

  const [selectedStatus, setSelectedStatus] = useState('investigating')
  const [note, setNote] = useState('')
  const [notifyCitizen, setNotifyCitizen] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const statuses = [
    { id: 'assigned', label: 'Assigned', icon: '📥', color: '#4299E1', bg: '#BEE3F8', desc: 'Case is assigned but work has not started' },
    { id: 'investigating', label: 'Investigating', icon: '🔍', color: '#805AD5', bg: '#E9D8FD', desc: 'Officer is actively investigating the case' },
    { id: 'in-progress', label: 'In Progress', icon: '🚧', color: '#3182CE', bg: '#BEE3F8', desc: 'Action is being taken to resolve the issue' },
    { id: 'resolved', label: 'Resolved', icon: '✅', color: '#38A169', bg: '#C6F6D5', desc: 'Issue has been successfully resolved' },
    { id: 'rejected', label: 'Rejected', icon: '❌', color: '#E53E3E', bg: '#FED7D7', desc: 'Complaint is invalid or out of scope' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => navigate(`/officer/case/${id || 'JV2026100'}`), 1500)
    }, 1200)
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Update Status">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Status updated successfully! Redirecting...
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>📊 Update Complaint Status</h2>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Update the status of case <strong style={{ color: '#FF6B35' }}>{id || 'JV2026100'}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Status */}
            <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#718096', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Current Status</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#805AD5' }}>🔍 Investigating</div>
            </div>

            {/* Status Options */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
                Select New Status *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statuses.map((s) => {
                  const selected = selectedStatus === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStatus(s.id)}
                      style={{
                        padding: '16px',
                        background: selected ? s.bg : 'white',
                        border: selected ? `2px solid ${s.color}` : '2px solid #e2e8f0',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', background: s.color, color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: selected ? s.color : '#1a202c', marginBottom: '2px' }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          {s.desc}
                        </div>
                      </div>
                      <div style={{ width: '22px', height: '22px', border: selected ? 'none' : '2px solid #cbd5e0', background: selected ? s.color : 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {selected && <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                Add a Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain what action was taken or why the status is changing..."
                rows="4"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>{note.length}/500</div>
            </div>

            {/* Notify Citizen */}
            <div style={{ padding: '16px', background: '#EBF8FF', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#2C5282', marginBottom: '2px' }}>
                  🔔 Notify Citizen
                </div>
                <div style={{ fontSize: '12px', color: '#2A4365' }}>
                  Send an email update to the complainant about this status change
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotifyCitizen(!notifyCitizen)}
                style={{
                  width: '50px',
                  height: '28px',
                  borderRadius: '14px',
                  background: notifyCitizen ? 'linear-gradient(135deg, #38A169, #48BB78)' : '#cbd5e0',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.3s ease',
                  flexShrink: 0
                }}
              >
                <span style={{ position: 'absolute', top: '3px', left: notifyCitizen ? '25px' : '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></span>
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
                style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: submitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}
              >
                {submitting ? '⏳ Updating...' : '💾 Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StatusUpdate