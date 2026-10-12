import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const ActionEvidence = () => {
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

  const [files, setFiles] = useState([])
  const [note, setNote] = useState('')
  const [evidenceType, setEvidenceType] = useState('progress')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const evidenceTypes = [
    { id: 'before', label: 'Before', icon: '📷', desc: 'Photos before action', color: '#ED8936' },
    { id: 'progress', label: 'In Progress', icon: '🚧', desc: 'Work in progress photos', color: '#4299E1' },
    { id: 'after', label: 'After', icon: '✅', desc: 'Completed work proof', color: '#38A169' },
    { id: 'document', label: 'Document', icon: '📄', desc: 'Reports, receipts, etc.', color: '#805AD5' }
  ]

  const handleFiles = (newFiles) => {
    const processed = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null
    }))
    setFiles((prev) => [...prev, ...processed])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return '🖼️'
    if (type.startsWith('video')) return '🎥'
    if (type.includes('pdf')) return '📄'
    return '📎'
  }

  const handleUpload = () => {
    if (files.length === 0) {
      alert('Please add at least one file')
      return
    }
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setSuccess(true)
      setTimeout(() => {
        setFiles([])
        setNote('')
        setSuccess(false)
        navigate(`/officer/case/${id || 'JV2026100'}`)
      }, 1500)
    }, 1500)
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Upload Action Evidence">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '10px 16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '20px' }}
        >
          ← Back
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Evidence uploaded successfully! Redirecting...
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '14px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '6px' }}>
              📤 Upload Action Evidence
            </h2>
            <p style={{ fontSize: '14px', color: '#718096' }}>
              Upload photos, videos, or documents proving action taken on case{' '}
              <strong style={{ color: '#FF6B35' }}>{id || 'JV2026100'}</strong>
            </p>
          </div>

          {/* Evidence Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
              📌 Evidence Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {evidenceTypes.map((t) => {
                const selected = evidenceType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEvidenceType(t.id)}
                    style={{
                      padding: '14px',
                      background: selected ? t.color + '15' : '#f7fafc',
                      border: selected ? `2px solid ${t.color}` : '2px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{t.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: selected ? t.color : '#1a202c' }}>{t.label}</span>
                    <span style={{ fontSize: '10px', color: '#718096', textAlign: 'center' }}>{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dropzone */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
              📎 Upload Files *
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('evidence-input').click()}
              style={{
                padding: '40px 24px',
                background: dragging ? '#fff5f0' : '#f7fafc',
                border: `2px dashed ${dragging ? '#FF6B35' : '#cbd5e0'}`,
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{dragging ? '📥' : '📤'}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', marginBottom: '4px' }}>
                {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
              </div>
              <div style={{ fontSize: '12px', color: '#718096' }}>
                Images, videos, PDFs (max 10 MB each)
              </div>
              <input
                id="evidence-input"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#4a5568', marginBottom: '12px' }}>
                📎 Files ({files.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{ padding: '12px', background: '#f7fafc', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}
                  >
                    <div style={{ width: '44px', height: '44px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{file.size} MB</div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{ position: 'absolute', top: '6px', right: '6px', width: '22px', height: '22px', background: '#fed7d7', color: '#c53030', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
              📝 Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what this evidence shows..."
              rows="4"
              maxLength="500"
              style={{ width: '100%', padding: '14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>{note.length}/500</div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{ padding: '14px 28px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: '#4a5568', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              style={{
                padding: '14px 32px',
                background: files.length === 0 ? '#cbd5e0' : 'linear-gradient(135deg, #3182CE, #2C5282)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: files.length === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: files.length === 0 ? 'none' : '0 4px 12px rgba(49, 130, 206, 0.3)'
              }}
            >
              {uploading ? '⏳ Uploading...' : `📤 Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ActionEvidence