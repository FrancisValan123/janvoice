import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const ComplaintInvestigation = () => {
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

  const [complaint] = useState({
    id: id || 'JV2026100',
    title: 'Road collapse risk on NH-45',
    category: 'Roads & Infrastructure',
    priority: 'emergency',
    status: 'investigating',
    description: 'Large section of road has caved in near km marker 45, causing significant risk to vehicles. There have been 2 minor accidents reported in the last 48 hours. Immediate barricading and repair required.',
    citizen: { name: 'Francis Valan', phone: '9876543210', email: 'francis@example.com' },
    location: 'NH-45, near km marker 45, Chennai',
    affectedPeople: 340,
    createdAt: '2026-09-30 09:15',
    deadline: '2026-09-30 12:00',
    evidence: [
      { name: 'road_damage_1.jpg', type: 'image', size: '2.4 MB' },
      { name: 'road_damage_2.jpg', type: 'image', size: '1.8 MB' },
      { name: 'accident_report.pdf', type: 'document', size: '450 KB' }
    ],
    timeline: [
      { status: 'Submitted', date: '2026-09-30 09:15', icon: '📝', desc: 'Complaint registered', color: '#4299E1' },
      { status: 'Assigned', date: '2026-09-30 09:30', icon: '👤', desc: 'Assigned to Officer Ravi Kumar', color: '#805AD5' },
      { status: 'Investigating', date: '2026-09-30 10:00', icon: '🔍', desc: 'Investigation started', color: '#ED8936', current: true }
    ]
  })

  const [notes, setNotes] = useState([
    { id: 1, text: 'Visited the site at 10:30 AM. Road collapse confirmed. Approx 4 sq meters affected.', author: 'Ravi Kumar', time: '2026-09-30 10:45', type: 'observation' },
    { id: 2, text: 'Contacted Public Works Dept for repair team. Estimated arrival: 2 hours.', author: 'Ravi Kumar', time: '2026-09-30 11:00', type: 'action' },
    { id: 3, text: 'Set up temporary barricades at location to prevent accidents.', author: 'Ravi Kumar', time: '2026-09-30 11:15', type: 'action' }
  ])

  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState('observation')

  const getPriorityConfig = (p) => {
    const map = {
      emergency: { icon: '🔴', label: 'Emergency', color: '#E53E3E', bg: '#FED7D7' },
      high: { icon: '🟠', label: 'High', color: '#F7931E', bg: '#FEEBC8' },
      normal: { icon: '🟡', label: 'Normal', color: '#ECC94B', bg: '#FEFCBF' },
      low: { icon: '🔵', label: 'Low', color: '#4299E1', bg: '#BEE3F8' }
    }
    return map[p] || map.normal
  }

  const getNoteTypeConfig = (type) => {
    const map = {
      observation: { label: 'Observation', color: '#4299E1', icon: '👁️' },
      action: { label: 'Action', color: '#38A169', icon: '⚡' },
      issue: { label: 'Issue', color: '#E53E3E', icon: '⚠️' },
      update: { label: 'Update', color: '#805AD5', icon: '📝' }
    }
    return map[type] || map.observation
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    setNotes([
      ...notes,
      {
        id: notes.length + 1,
        text: newNote,
        author: 'You',
        time: new Date().toLocaleString('en-IN'),
        type: noteType
      }
    ])
    setNewNote('')
  }

  const priority = getPriorityConfig(complaint.priority)

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Investigate Case">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back to Cases
        </button>

        {/* Header Card */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '20px', borderTop: `4px solid ${priority.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', background: '#1a202c', color: 'white', padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.5px' }}>{complaint.id}</span>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: priority.bg, color: priority.color }}>
                  {priority.icon} {priority.label}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', background: '#E9D8FD', color: '#805AD5' }}>
                  🔍 Investigating
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>{complaint.title}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#718096', flexWrap: 'wrap' }}>
                <span>📁 {complaint.category}</span>
                <span>📍 {complaint.location}</span>
                <span>👥 {complaint.affectedPeople} affected</span>
                <span>📅 {complaint.createdAt}</span>
                <span style={{ color: '#E53E3E', fontWeight: '700' }}>⏰ Due: {complaint.deadline}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/officer/status/${complaint.id}`)}
                style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #3182CE, #2C5282)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}
              >
                📊 Update Status
              </button>
              <button
                onClick={() => navigate(`/officer/report/${complaint.id}`)}
                style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #38A169, #2F855A)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(56, 161, 105, 0.3)' }}
              >
                ✅ Mark Resolved
              </button>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f7fafc', borderRadius: '10px', fontSize: '14px', color: '#4a5568', lineHeight: 1.7 }}>
            <strong style={{ color: '#2d3748', display: 'block', marginBottom: '6px' }}>📝 Description</strong>
            {complaint.description}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Left: Notes / Investigation Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Add Note */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>📝 Add Investigation Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Document your findings, actions taken, or observations..."
                rows="4"
                style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  style={{ padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '600', outline: 'none', fontFamily: 'inherit', background: 'white' }}
                >
                  <option value="observation">👁️ Observation</option>
                  <option value="action">⚡ Action Taken</option>
                  <option value="issue">⚠️ Issue Found</option>
                  <option value="update">📝 General Update</option>
                </select>
                <button
                  onClick={handleAddNote}
                  style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2C5282, #4299E1)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto', boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)' }}
                >
                  ➕ Add Note
                </button>
              </div>
            </div>

            {/* Notes Timeline */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>📋 Investigation Log ({notes.length})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notes.map((n) => {
                  const type = getNoteTypeConfig(n.type)
                  return (
                    <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '14px', background: '#f7fafc', borderRadius: '10px', borderLeft: `3px solid ${type.color}` }}>
                      <div style={{ width: '36px', height: '36px', background: type.color + '20', color: type.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                        {type.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: type.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{type.label}</span>
                          <span style={{ fontSize: '11px', color: '#a0aec0' }}>{n.time}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#2d3748', lineHeight: 1.6, marginBottom: '4px' }}>{n.text}</div>
                        <div style={{ fontSize: '11px', color: '#a0aec0' }}>by {n.author}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Citizen Contact */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>👤 Citizen Contact</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0 }}>
                  {complaint.citizen.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{complaint.citizen.name}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>Complainant</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4a5568' }}>
                <div>📞 {complaint.citizen.phone}</div>
                <div style={{ wordBreak: 'break-all' }}>📧 {complaint.citizen.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <a href={`tel:${complaint.citizen.phone}`} style={{ flex: 1, padding: '10px', background: '#38A169', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>
                  📞 Call
                </a>
                <a href={`mailto:${complaint.citizen.email}`} style={{ flex: 1, padding: '10px', background: '#4299E1', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>
                  📧 Email
                </a>
              </div>
            </div>

            {/* Evidence */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>📎 Evidence ({complaint.evidence.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {complaint.evidence.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: '#f7fafc', borderRadius: '8px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      {e.type === 'image' ? '🖼️' : '📄'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{e.size}</div>
                    </div>
                    <button style={{ padding: '5px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px', fontWeight: '700', color: '#FF6B35', cursor: 'pointer' }}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>⚡ Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => navigate(`/officer/evidence/${complaint.id}`)} style={{ padding: '12px', background: '#4299E1', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  📤 Upload Action Evidence
                </button>
                <button onClick={() => navigate(`/officer/reassign/${complaint.id}`)} style={{ padding: '12px', background: '#ED8936', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  🔄 Request Reassignment
                </button>
                <button onClick={() => navigate(`/officer/escalate/${complaint.id}`)} style={{ padding: '12px', background: '#E53E3E', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                  🚨 Escalate to Authority
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>📅 Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {complaint.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: t.current ? t.color : 'white', color: t.current ? 'white' : t.color, border: `2px solid ${t.color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: t.current ? t.color : '#1a202c' }}>{t.status}</div>
                      <div style={{ fontSize: '11px', color: '#a0aec0', marginBottom: '2px' }}>{t.date}</div>
                      <div style={{ fontSize: '12px', color: '#4a5568' }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ComplaintInvestigation