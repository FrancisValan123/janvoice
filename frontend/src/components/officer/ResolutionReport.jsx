import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ResolutionReport = () => {
  const { id } = useParams()
  const navigate = useNavigate()

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

  // ==========================================
  // STATE
  // ==========================================
  const [reports, setReports] = useState([])
  const [listLoading, setListLoading] = useState(false)

  const [complaint, setComplaint] = useState(null)
  const [existingReport, setExistingReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    resolutionSummary: '',
    actionTaken: '',
    resourcesUsed: '',
    followUpRequired: false,
    followUpDate: '',
    citizenSatisfied: 'yes',
    additionalNotes: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // ==========================================
  // EFFECT 1: LIST VIEW (No ID)
  // ==========================================
  useEffect(() => {
    if (id) return

    const fetchReports = async () => {
      try {
        setListLoading(true)
        const res = await api.get('/reports/my')
        setReports(res.data?.reports || [])
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        setListLoading(false)
      }
    }
    fetchReports()
  }, [id])

  // ==========================================
  // EFFECT 2: FORM/VIEW (With ID)
  // ==========================================
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 1. Fetch complaint details
        const cRes = await api.get(`/complaints/${id}`)
        setComplaint(cRes.data?.complaint || cRes.data)

        // 2. Check if a report already exists
        try {
          const rRes = await api.get(`/reports/complaint/${id}`)
          if (rRes.data.success) {
            setExistingReport(rRes.data.report)
            setFormData({
              resolutionSummary: rRes.data.report.resolutionSummary,
              actionTaken: rRes.data.report.actionTaken,
              resourcesUsed: rRes.data.report.resourcesUsed || '',
              followUpRequired: rRes.data.report.followUpRequired || false,
              followUpDate: rRes.data.report.followUpDate ? new Date(rRes.data.report.followUpDate).toISOString().split('T')[0] : '',
              citizenSatisfied: rRes.data.report.citizenSatisfied || 'yes',
              additionalNotes: rRes.data.report.additionalNotes || ''
            })
          }
        } catch (err) {
          // 404 means no report exists yet (Show Form)
          if (err.response?.status !== 404) {
            console.error('Error checking report:', err)
          }
        }
      } catch (err) {
        console.error('Failed to load complaint:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post(`/reports/submit/${id}`, formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/officer/report')
        window.location.reload() 
      }, 2000) 
    } catch (err) {
      console.error('Submit error:', err)
      // ✅ FIXED: Shows the real error message from the backend
      alert(err.response?.data?.message || err.message || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  // ==========================================
  // RENDER: LIST VIEW
  // ==========================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Reports">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '30px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>📄 Submitted Resolution Reports</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>History of all reports you have submitted.</p>
          </div>

          {listLoading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>⏳ Loading...</div>
          ) : reports.length === 0 ? (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Reports Found</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>You have not submitted any resolution reports yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {reports.map((r) => (
                <div key={r._id} onClick={() => navigate(`/officer/report/${r.complaint?._id}`)} style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', borderLeft: '4px solid #38A169' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--brand-primary)', color: 'white', padding: '3px 10px', borderRadius: '6px' }}>{r.complaint?.complaintId}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#38A169', background: 'rgba(56, 161, 105, 0.15)', padding: '3px 10px', borderRadius: '10px' }}>✅ Resolved</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.complaint?.title}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}><span>📅 {new Date(r.createdAt).toLocaleDateString()}</span></div>
                  <button style={{ width: '100%', padding: '10px', background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', cursor: 'pointer' }}>👁️ View Report →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================
  // RENDER: LOADING
  // ==========================================
  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Report">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>Loading...</div>
      </DashboardLayout>
    )
  }

  // ==========================================
  // RENDER: READ-ONLY (Report Exists)
  // ==========================================
  if (existingReport) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Resolution Report">
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <button onClick={() => navigate('/officer/report')} style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}>← Back to Reports List</button>

          <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', background: '#38A169', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✅</div>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Resolution Report</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Case: <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId}</strong></p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>📋 Resolution Summary</h4>
                <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{existingReport.resolutionSummary}</div>
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>⚡ Action Taken</h4>
                <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{existingReport.actionTaken}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>🔧 Resources Used</h4>
                  <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>{existingReport.resourcesUsed || 'None specified'}</div>
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>😊 Citizen Satisfaction</h4>
                  <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{existingReport.citizenSatisfied}</div>
                </div>
              </div>
              {existingReport.followUpRequired && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>📅 Follow-up Scheduled</h4>
                  <div style={{ padding: '16px', background: 'rgba(237, 137, 54, 0.1)', color: '#DD6B20', borderRadius: '10px', fontSize: '14px', fontWeight: '700' }}>{new Date(existingReport.followUpDate).toLocaleDateString()}</div>
                </div>
              )}
              {existingReport.additionalNotes && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>📝 Additional Notes</h4>
                  <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>{existingReport.additionalNotes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================
  // RENDER: FORM (No Report Exists)
  // ==========================================
  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Submit Resolution Report">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <button onClick={() => navigate('/officer/report')} style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}>← Back to Reports List</button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>✅ Report submitted! Redirecting...</div>
        )}

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #38A169, #2F855A)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✅</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Submit Resolution Report</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Case: <strong style={{ color: '#FF6B35' }}>{complaint?.complaintId || id}</strong></p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>📋 Resolution Summary *</label>
              <textarea value={formData.resolutionSummary} onChange={(e) => handleChange('resolutionSummary', e.target.value)} placeholder="Summarize how the issue was resolved..." rows="4" maxLength="800" style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>⚡ Action Taken *</label>
              <textarea value={formData.actionTaken} onChange={(e) => handleChange('actionTaken', e.target.value)} placeholder="Describe the specific actions taken..." rows="4" maxLength="800" style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <button type="button" onClick={() => navigate('/officer/report')} disabled={submitting} style={{ padding: '14px 28px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}>{submitting ? '⏳ Submitting...' : '✅ Submit Report'}</button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResolutionReport