import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ComplaintInvestigation = () => {
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

  const [complaint, setComplaint] = useState(null)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('observation')
  const [addingNote, setAddingNote] = useState(false)

  // ===================================
  // FETCH REAL COMPLAINT
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
        
        if (c.notes && Array.isArray(c.notes)) {
          setNotes(c.notes)
        } else {
          setNotes([])
        }
      } catch (err) {
        console.error('Failed to load case:', err)
        setError('Failed to load case details. It may have been deleted.')
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
  }, [id])

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.15)' },
      high: { icon: '🟠', label: 'High', color: '#F7931E', bg: 'rgba(247, 147, 30, 0.15)' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B', bg: 'rgba(236, 201, 75, 0.15)' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.15)' }
    }
    return map[p] || map.normal
  }

  const getStatusConfig = (s) => {
    const map = {
      pending: { icon: '⏳', label: 'Pending', color: '#ED8936', bg: 'rgba(237, 137, 54, 0.15)' },
      assigned: { icon: '👤', label: 'Assigned', color: '#4299E1', bg: 'rgba(66, 153, 225, 0.15)' },
      investigating: { icon: '🔍', label: 'Investigating', color: '#805AD5', bg: 'rgba(128, 90, 213, 0.15)' },
      'in-progress': { icon: '🚧', label: 'In Progress', color: '#3182CE', bg: 'rgba(49, 130, 206, 0.15)' },
      resolved: { icon: '✅', label: 'Resolved', color: '#38A169', bg: 'rgba(56, 161, 105, 0.15)' },
      rejected: { icon: '❌', label: 'Rejected', color: '#E53E3E', bg: 'rgba(229, 62, 62, 0.15)' },
      escalated: { icon: '🚨', label: 'Escalated', color: '#C53030', bg: 'rgba(197, 48, 48, 0.15)' }
    }
    return map[s] || map.pending
  }

  const getNoteTypeConfig = (type) => {
    const map = {
      observation: { label: 'Observation', color: '#4299E1', icon: '👁️' },
      action: { label: 'Action', color: '#38A169', icon: '⚡' },
      issue: { label: 'Issue', color: '#E53E3E', icon: '⚠️' },
      update: { label: 'Update', color: '#805AD5', icon: '📝' },
      internal: { label: 'Internal', color: '#718096', icon: '🔒' }
    }
    return map[type] || map.observation
  }

  // ===================================
  // HANDLE ADD NOTE
  // ===================================
  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setAddingNote(true)
    try {
      const res = await api.post(`/complaints/${id}/notes`, {
        text: newNote,
        type: noteType,
        isPrivate: false
      })

      const createdNote = res.data?.note || {
        _id: Date.now(),
        text: newNote,
        type: noteType,
        author: { name: 'You' },
        time: new Date().toISOString()
      }

      setNotes([createdNote, ...notes])
      setNewNote('')
    } catch (err) {
      console.error('Failed to add note:', err)
      alert(err.response?.data?.message || 'Failed to save note.')
    } finally {
      setAddingNote(false)
    }
  }

  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Investigate Case">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>No Case Selected</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>Please open a case from your Assigned Cases first.</p>
          <button onClick={() => navigate('/officer/assigned')} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>← Go to Assigned Cases</button>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Investigate Case">
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>Loading case details...</div>
      </DashboardLayout>
    )
  }

  if (error || !complaint) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Investigate Case">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#E53E3E', marginBottom: '12px' }}>Error</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>{error || 'Case not found.'}</p>
          <button onClick={() => navigate('/officer/assigned')} style={{ padding: '14px 28px', background: 'var(--btn-secondary-bg)', color: 'var(--btn-secondary-text)', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>← Back to Assigned Cases</button>
        </div>
      </DashboardLayout>
    )
  }

  const priority = getPriorityConfig(complaint.priority)
  const status = getStatusConfig(complaint.status)
  const isResolved = complaint.status === 'resolved'

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Investigate Case">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Cases
        </button>

        {/* Header Card */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px', borderTop: `4px solid ${priority.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--brand-primary)', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{complaint.complaintId || complaint._id}</span>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                  {priority.icon} {priority.label}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: status.bg, color: status.color }}>
                  {status.icon} {status.label}
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>{complaint.title}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
                <span>📁 {complaint.category}</span>
                <span>📍 {complaint.location?.address || 'Not specified'}</span>
                <span>👥 {complaint.affectedPeople || 1} affected</span>
                <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                {complaint.deadline && !isResolved && (
                  <span style={{ color: '#E53E3E', fontWeight: '700' }}>⏰ Due: {new Date(complaint.deadline).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/officer/status/${complaint._id}`)}
                style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}
              >
                📊 Update Status
              </button>
              
              {/* ✅ FIXED: Conditionally render the button based on status */}
              {isResolved ? (
                <button
                  onClick={() => navigate(`/officer/report/${complaint._id}`)}
                  style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}
                >
                  📄 View Resolution Report
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/officer/report/${complaint._id}`)}
                  style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}
                >
                  ✅ Mark Resolved
                </button>
              )}
            </div>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>📝 Description</strong>
            {complaint.description}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Left: Notes / Investigation Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Add Note (Hidden if Resolved) */}
            {!isResolved && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>📝 Add Investigation Note</h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Document your findings, actions taken, or observations..."
                  rows="4"
                  disabled={addingNote}
                  style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    disabled={addingNote}
                    style={{ padding: '10px 14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '13px', fontWeight: '600', outline: 'none', fontFamily: 'inherit', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  >
                    <option value="observation">👁️ Observation</option>
                    <option value="action">⚡ Action Taken</option>
                    <option value="issue">⚠️ Issue Found</option>
                    <option value="update">📝 General Update</option>
                  </select>
                  <button
                    onClick={handleAddNote}
                    disabled={addingNote || !newNote.trim()}
                    style={{ padding: '12px 24px', background: (!newNote.trim() || addingNote) ? 'var(--border-medium)' : 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: (!newNote.trim() || addingNote) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginLeft: 'auto', boxShadow: (!newNote.trim() || addingNote) ? 'none' : '0 4px 12px rgba(66, 153, 225, 0.3)' }}
                  >
                    {addingNote ? '⏳ Saving...' : '➕ Add Note'}
                  </button>
                </div>
              </div>
            )}

            {/* Notes Timeline */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>📋 Investigation Log ({notes.length})</h3>

              {notes.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No investigation notes added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notes.map((n, idx) => {
                    const type = getNoteTypeConfig(n.type)
                    const authorName = n.author?.name || n.author || 'Officer'
                    const timeStr = n.time ? new Date(n.time).toLocaleString('en-IN') : ''

                    return (
                      <div key={n._id || idx} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'var(--bg-surface-secondary)', borderRadius: '10px', borderLeft: `3px solid ${type.color}` }}>
                        <div style={{ width: '36px', height: '36px', background: type.color + '20', color: type.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                          {type.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: type.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{type.label}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{timeStr}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '4px' }}>{n.text}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>by {authorName}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Citizen Contact */}
            {complaint.citizen && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>👤 Citizen Contact</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                    {complaint.citizen.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{complaint.citizen.name || 'Citizen'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Complainant</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div>📞 {complaint.citizen.phone || 'Not provided'}</div>
                  <div style={{ wordBreak: 'break-all' }}>📧 {complaint.citizen.email || 'Not provided'}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  {complaint.citizen.phone && (
                    <a href={`tel:${complaint.citizen.phone}`} style={{ flex: 1, padding: '10px', background: '#38A169', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>
                      📞 Call
                    </a>
                  )}
                  {complaint.citizen.email && (
                    <a href={`mailto:${complaint.citizen.email}`} style={{ flex: 1, padding: '10px', background: '#4299E1', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>
                      📧 Email
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Evidence */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                📎 Citizen Evidence ({complaint.evidence?.length || 0})
              </h3>
              {(!complaint.evidence || complaint.evidence.length === 0) ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '13px' }}>No evidence uploaded by citizen.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {complaint.evidence.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'var(--bg-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                        {e.type === 'image' ? '🖼️' : '📄'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {e.url?.split('/').pop() || `File ${i + 1}`}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{e.type || 'file'}</div>
                      </div>
                      <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#FF6B35', textDecoration: 'none' }}>
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Evidence */}
            {complaint.actionEvidence && complaint.actionEvidence.length > 0 && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                  📸 Action Evidence ({complaint.actionEvidence.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {complaint.actionEvidence.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: 'var(--bg-surface-secondary)', borderRadius: '8px' }}>
                      <div style={{ width: '36px', height: '36px', background: 'rgba(56, 161, 105, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                        {e.type === 'image' ? '🖼️' : '📄'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {e.url?.split('/').pop() || `File ${i + 1}`}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{e.note || e.type || 'file'}</div>
                      </div>
                      <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#38A169', textDecoration: 'none' }}>
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions (Hidden if Resolved) */}
            {!isResolved && (
              <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>⚡ Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => navigate(`/officer/evidence/${complaint._id}`)} style={{ padding: '12px', background: '#4299E1', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    📤 Upload Action Evidence
                  </button>
                  <button onClick={() => navigate(`/officer/reassign/${complaint._id}`)} style={{ padding: '12px', background: '#ED8936', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    🔄 Request Reassignment
                  </button>
                  <button onClick={() => navigate(`/officer/escalate/${complaint._id}`)} style={{ padding: '12px', background: '#E53E3E', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    🚨 Escalate to Authority
                  </button>
                </div>
              </div>
            )}

            {/* Timeline (Status History) */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '22px', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>📅 Status Timeline</h3>
              {(!complaint.statusHistory || complaint.statusHistory.length === 0) ? (
                <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '13px' }}>No status updates yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {complaint.statusHistory.map((t, i) => {
                    const sConf = getStatusConfig(t.status)
                    const isCurrent = i === complaint.statusHistory.length - 1
                    return (
                      <div key={i} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: isCurrent ? sConf.color : 'var(--bg-surface)', color: isCurrent ? 'white' : sConf.color, border: `2px solid ${sConf.color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                          {sConf.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: isCurrent ? sConf.color : 'var(--text-primary)' }}>{sConf.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{t.updatedAt ? new Date(t.updatedAt).toLocaleString('en-IN') : ''}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.note}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintInvestigation