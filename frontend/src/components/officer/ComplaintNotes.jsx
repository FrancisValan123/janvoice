import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const ComplaintNotes = () => {
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

  const [notes, setNotes] = useState([
    { id: 1, type: 'observation', text: 'Visited site at 10:30 AM. Confirmed road collapse spanning ~4 sq meters. Traffic diverted.', author: 'Ravi Kumar', time: '2026-09-30 10:45', isPrivate: false },
    { id: 2, type: 'action', text: 'Contacted Public Works Dept. Repair team ETA: 2 hours. Barricades placed.', author: 'Ravi Kumar', time: '2026-09-30 11:15', isPrivate: false },
    { id: 3, type: 'issue', text: 'Repair team delayed by 1 hour due to traffic. Notified citizen via SMS.', author: 'Ravi Kumar', time: '2026-09-30 12:30', isPrivate: false },
    { id: 4, type: 'update', text: 'Repair work started. Expected completion: 4 PM today.', author: 'Ravi Kumar', time: '2026-09-30 14:00', isPrivate: false },
    { id: 5, type: 'internal', text: 'Note to self: Follow up with Public Works supervisor tomorrow for quality check.', author: 'Ravi Kumar', time: '2026-09-30 15:00', isPrivate: true }
  ])

  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('observation')
  const [isPrivate, setIsPrivate] = useState(false)
  const [filter, setFilter] = useState('all')

  const noteTypes = [
    { id: 'observation', label: 'Observation', icon: '👁️', color: '#4299E1' },
    { id: 'action', label: 'Action', icon: '⚡', color: '#38A169' },
    { id: 'issue', label: 'Issue', icon: '⚠️', color: '#E53E3E' },
    { id: 'update', label: 'Update', icon: '📝', color: '#805AD5' },
    { id: 'internal', label: 'Internal Note', icon: '🔒', color: '#718096' }
  ]

  const getTypeConfig = (type) => noteTypes.find((t) => t.id === type) || noteTypes[0]

  const handleAddNote = () => {
    if (!newNote.trim()) return
    setNotes([
      {
        id: notes.length + 1,
        type: noteType,
        text: newNote,
        author: 'You',
        time: new Date().toLocaleString('en-IN'),
        isPrivate
      },
      ...notes
    ])
    setNewNote('')
    setIsPrivate(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter((n) => n.id !== id))
    }
  }

  const filtered = filter === 'all' ? notes : notes.filter((n) => n.type === filter)

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Complaint Notes">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back
        </button>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2C5282, #4299E1)', borderRadius: '14px', padding: '28px', color: 'white', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>📝 Complaint Notes</h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Maintain detailed notes for case <strong>{id || 'JV2026100'}</strong>
          </p>
        </div>

        {/* Add Note Card */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>➕ Add New Note</h3>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
            maxLength="500"
            style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: '12px' }}
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
                      background: selected ? t.color : '#f7fafc',
                      color: selected ? 'white' : '#4a5568',
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4a5568', cursor: 'pointer' }}>
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              🔒 Mark as internal (not visible to citizen)
            </label>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#a0aec0' }}>{newNote.length}/500</span>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                style={{
                  padding: '12px 24px',
                  background: newNote.trim() ? 'linear-gradient(135deg, #2C5282, #4299E1)' : '#cbd5e0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: newNote.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  boxShadow: newNote.trim() ? '0 4px 12px rgba(66, 153, 225, 0.3)' : 'none'
                }}
              >
                ➕ Add Note
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
              background: filter === 'all' ? 'linear-gradient(135deg, #FF6B35, #F7931E)' : 'white',
              color: filter === 'all' ? 'white' : '#4a5568',
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
                  background: filter === t.id ? t.color : 'white',
                  color: filter === t.id ? 'white' : '#4a5568',
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
          {filtered.map((n) => {
            const type = getTypeConfig(n.type)
            return (
              <div
                key={n.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
                      <span style={{ padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', background: '#EDF2F7', color: '#4A5568' }}>
                        🔒 Internal
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#a0aec0' }}>{n.time}</span>
                </div>

                <div style={{ fontSize: '14px', color: '#2d3748', lineHeight: 1.6, marginBottom: '10px' }}>
                  {n.text}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>👤 {n.author}</span>
                  <button
                    onClick={() => handleDelete(n.id)}
                    style={{ padding: '6px 12px', background: '#FEF2F2', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#C53030', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ background: 'white', borderRadius: '14px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>No Notes Yet</h3>
              <p style={{ fontSize: '14px', color: '#718096' }}>Start documenting your investigation by adding your first note above.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintNotes