import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ComplaintNotes = () => {
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

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('observation')
  const [isPrivate, setIsPrivate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [saving, setSaving] = useState(false)

  const noteTypes = [
    { id: 'observation', label: 'Observation', icon: '👁️', color: '#4299E1' },
    { id: 'action', label: 'Action', icon: '⚡', color: '#38A169' },
    { id: 'issue', label: 'Issue', icon: '⚠️', color: '#E53E3E' },
    { id: 'update', label: 'Update', icon: '📝', color: '#805AD5' },
    { id: 'internal', label: 'Internal Note', icon: '🔒', color: '#718096' }
  ]

  const getTypeConfig = (type) => noteTypes.find((t) => t.id === type) || noteTypes[0]

  // ===================================
  // FETCH REAL COMPLAINT NOTES
  // ===================================
  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchNotes = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/complaints/${id}`)
        const complaint = res.data?.complaint || res.data
        
        // For now, we map the statusHistory notes as the notes list
        // Ideally you would have a separate `notes` array on the Complaint model
        const historyNotes = (complaint?.statusHistory || []).map((h, index) => ({
          id: h._id || index,
          type: 'update',
          text: h.note || `Status changed to ${h.status}`,
          author: h.updatedBy?.name || 'System',
          time: h.updatedAt ? new Date(h.updatedAt).toLocaleString('en-IN') : 'N/A',
          isPrivate: false
        }))

        setNotes(historyNotes.reverse())
      } catch (err) {
        console.error('Failed to load notes:', err)
        setError('Failed to load case details.')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [id])

  // ===================================
  // HANDLE ADD NOTE
  // ===================================
  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return
    
    setSaving(true)
    try {
      // Send note to backend
      const res = await api.post(`/complaints/${id}/notes`, {
        text: newNote,
        type: noteType,
        isPrivate
      })

      // Add to local state to update UI immediately
      const addedNote = {
        id: res.data?.note?._id || Date.now(),
        type: noteType,
        text: newNote,
        author: 'You',
        time: new Date().toLocaleString('en-IN'),
        isPrivate
      }
      
      setNotes([addedNote, ...notes])
      setNewNote('')
      setIsPrivate(false)
    } catch (err) {
      console.error('Failed to add note:', err)
      setError('Failed to save note to server.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'all' ? notes : notes.filter((n) => n.type === filter)

  // ===================================
  // NO ID STATE
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Complaint Notes">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To view or add notes, please open a case from your Assigned Cases first.
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #2C5282, #4299E1)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
            }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Complaint Notes">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{ padding: '10px 16px', background: 'var(--btn-secondary-bg)', border: '2px solid var(--btn-secondary-border)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--btn-secondary-text)', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Case
        </button>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📝 Complaint Notes</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Maintain detailed notes for case <strong style={{ color: '#FFD700' }}>{id}</strong>
          </p>
        </div>

        {error && (
          <div style={{ padding: '14px 20px', background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Add Note Card */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>➕ Add New Note</h3>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
            maxLength="500"
            disabled={saving}
            style={{ width: '100%', padding: '14px', border: '2px solid var(--border-light)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
          />

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {noteTypes.map((t) => {
                const selected = noteType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setNoteType(t.id)}
                    style={{
                      padding: '8px 14px',
                      background: selected ? t.color : 'var(--bg-surface-secondary)',
                      color: selected ? 'white' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              🔒 Mark as internal (not visible to citizen)
            </label>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{newNote.length}/500</span>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || saving}
                style={{
                  padding: '12px 24px',
                  background: newNote.trim() && !saving ? 'linear-gradient(135deg, #2C5282, #4299E1)' : 'var(--border-medium)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: newNote.trim() && !saving ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  boxShadow: newNote.trim() && !saving ? '0 4px 12px rgba(66, 153, 225, 0.3)' : 'none'
                }}
              >
                {saving ? '⏳ Saving...' : '➕ Add Note'}
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 18px',
              background: filter === 'all' ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'var(--bg-surface)',
              color: filter === 'all' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            📋 All ({notes.length})
          </button>
          {noteTypes.map((t) => {
            const count = notes.filter((n) => n.type === t.id).length
            if (count === 0) return null
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                style={{
                  padding: '10px 18px',
                  background: filter === t.id ? t.color : 'var(--bg-surface)',
                  color: filter === t.id ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                {t.icon} {t.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Notes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
             <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Loading notes...</div>
          ) : filtered.length === 0 ? (
            <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>No Notes Yet</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>Start documenting your investigation by adding your first note above.</p>
            </div>
          ) : (
            filtered.map((n) => {
              const type = getTypeConfig(n.type)
              return (
                <div
                  key={n.id}
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '12px',
                    padding: '18px',
                    boxShadow: 'var(--shadow-sm)',
                    borderLeft: `4px solid ${type.color}`,
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', background: type.color + '20', color: type.color }}>
                        {type.icon} {type.label}
                      </span>
                      {n.isPrivate && (
                        <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', background: 'var(--bg-surface-tertiary)', color: 'var(--text-secondary)' }}>
                          🔒 Internal
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {n.text}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>👤 {n.author}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintNotes