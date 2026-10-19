import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const StatusUpdate = () => {
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

  const [selectedStatus, setSelectedStatus] = useState('')
  const [note, setNote] = useState('')
  const [notifyCitizen, setNotifyCitizen] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const statuses = [
    { id: 'assigned', label: 'Assigned', icon: '📥', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.15)', desc: 'Case is assigned but work has not started' },
    { id: 'investigating', label: 'Investigating', icon: '🔍', color: '#805AD5', bg: 'rgba(128, 90, 213, 0.15)', desc: 'Officer is actively investigating the case' },
    { id: 'in-progress', label: 'In Progress', icon: '🚧', color: '#3182CE', bg: 'rgba(49, 130, 206, 0.15)', desc: 'Action is being taken to resolve the issue' },
    { id: 'resolved', label: 'Resolved', icon: '✅', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)', desc: 'Issue has been successfully resolved' },
    { id: 'rejected', label: 'Rejected', icon: '❌', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.15)', desc: 'Complaint is invalid or out of scope' }
  ]

  const getStatusConfig = (status) => {
    return statuses.find(s => s.id === status) || statuses[0]
  }

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
        const c = res.data?.complaint || res.data
        setComplaint(c)
        
        // Set the current status as the selected status by default
        // or leave blank to force a change
        setSelectedStatus(c.status || 'investigating')
      } catch (err) {
        console.error('Failed to load complaint:', err)
        setFetchError('Failed to load case details. The case may not exist.')
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
    if (!selectedStatus) return

    setSubmitting(true)
    setSubmitError('')

    try {
      await api.put(`/complaints/${id}/status`, {
        status: selectedStatus,
        note: note.trim() || undefined
      })

      setSuccess(true)
      setTimeout(() => navigate(`/officer/case/${id}`), 1500)
    } catch (err) {
      console.error('Failed to update status:', err)
      setSubmitError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setSubmitting(false)
    }
  }

  // ===================================
  // NO ID STATE
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Update Status">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To update a status, please open a case from your Assigned Cases first.
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Update Status">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Loading case details...
        </div>
      </DashboardLayout>
    )
  }

  const currentStatusConfig = getStatusConfig(complaint?.status)

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Update Status">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Status updated successfully! Redirecting...
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
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>📊 Update Complaint Status</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Update the status of case <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId || id}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Status */}
            <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Current Status</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: currentStatusConfig.color }}>
                {currentStatusConfig.icon} {currentStatusConfig.label}
              </div>
            </div>

            {/* Status Options */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Select New Status *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statuses.map((s) => {
                  const selected = selectedStatus === s.id
                  const isCurrent = complaint?.status === s.id
                  
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStatus(s.id)}
                      disabled={isCurrent}
                      style={{
                        padding: '16px',
                        background: selected ? s.bg : 'var(--bg-surface)',
                        border: selected ? `2px solid ${s.color}` : '2px solid var(--border-light)',
                        borderRadius: '10px',
                        cursor: isCurrent ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        opacity: isCurrent ? 0.5 : 1
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', background: s.color, color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: selected ? s.color : 'var(--text-primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {s.label}
                          {isCurrent && <span style={{ fontSize: '10px', background: 'var(--border-medium)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>CURRENT</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {s.desc}
                        </div>
                      </div>
                      <div style={{ width: '22px', height: '22px', border: selected ? 'none' : '2px solid var(--border-medium)', background: selected ? s.color : 'var(--bg-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {selected && <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>✓</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Add a Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Explain what action was taken or why the status is changing..."
                rows="4"
                maxLength="500"
                style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              />
              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{note.length}/500</div>
            </div>

            {/* Notify Citizen */}
            <div style={{ padding: '16px', background: 'rgba(66, 153, 225, 0.1)', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
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
                  background: notifyCitizen ? 'linear-gradient(135deg, #38A169, #48BB78)' : 'var(--border-medium)',
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
            {!notifyCitizen && (
              <div style={{ fontSize: '11px', color: '#E53E3E', marginTop: '-16px', marginBottom: '24px', fontWeight: 600 }}>
                * Email notifications are currently disabled for this update.
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
                disabled={submitting || selectedStatus === complaint?.status}
                style={{ padding: '14px 32px', background: selectedStatus === complaint?.status ? 'var(--border-medium)' : 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: (submitting || selectedStatus === complaint?.status) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: (submitting || selectedStatus === complaint?.status) ? 0.7 : 1, boxShadow: selectedStatus === complaint?.status ? 'none' : '0 4px 12px rgba(49, 130, 206, 0.3)' }}
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