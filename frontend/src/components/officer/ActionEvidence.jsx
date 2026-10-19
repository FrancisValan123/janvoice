import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'
import { api } from '../../services/api'

const ActionEvidence = () => {
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

  const [files, setFiles] = useState([])
  const [note, setNote] = useState('')
  const [evidenceType, setEvidenceType] = useState('progress')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
      file, // ✅ Keep the actual File object for upload
      preview: file.type.startsWith('image') ? URL.createObjectURL(file) : null
    }))
    setFiles((prev) => [...prev, ...processed])
    setError('')
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

  // ===================================
  // ✅ REAL UPLOAD — Cloudinary + MongoDB
  // ===================================
  const handleUpload = async () => {
    if (!id) {
      setError('No complaint selected. Please open a case from Assigned Cases first.')
      return
    }
    if (files.length === 0) {
      setError('Please add at least one file')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Step 1: Upload files to Cloudinary
      const uploadData = new FormData()
      files.forEach((f) => {
        uploadData.append('files', f.file)
      })

      const uploadRes = await api.post('/upload/evidence', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || 'File upload failed')
      }

      // Step 2: Save each uploaded file to the complaint
      const uploadedFiles = uploadRes.data.files || []
      for (const file of uploadedFiles) {
        await api.post(`/complaints/${id}/action-evidence`, {
          url: file.url,
          publicId: file.publicId,
          type: file.type,
          note: note || `${evidenceType} evidence`
        })
      }

      setSuccess(true)
      setTimeout(() => {
        setFiles([])
        setNote('')
        setSuccess(false)
        navigate(`/officer/case/${id}`)
      }, 1500)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // ===================================
  // NO ID → Show "select case first" message
  // ===================================
  if (!id) {
    return (
      <DashboardLayout role="officer" menuItems={menuItems} title="Upload Action Evidence">
        <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📤</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
            No Case Selected
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '24px', lineHeight: 1.6 }}>
            To upload action evidence, first open a case from your Assigned Cases and click "Upload Evidence".
          </p>
          <button
            onClick={() => navigate('/officer/assigned')}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #3182CE, #2C5282)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
            }}
          >
            ← Go to Assigned Cases
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="officer" menuItems={menuItems} title="Upload Action Evidence">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(`/officer/case/${id}`)}
          style={{
            padding: '10px 16px',
            background: 'var(--btn-secondary-bg)',
            border: '2px solid var(--btn-secondary-border)',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--btn-secondary-text)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: '20px'
          }}
        >
          ← Back to Case
        </button>

        {success && (
          <div style={{ background: '#38A169', color: 'white', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            ✅ Evidence uploaded successfully! Redirecting...
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#C53030', padding: '14px 20px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              📤 Upload Action Evidence
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Upload photos, videos, or documents proving action taken on case{' '}
              <strong style={{ color: '#FF6B35' }}>{id}</strong>
            </p>
          </div>

          {/* Evidence Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
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
                      background: selected ? t.color + '15' : 'var(--bg-surface-secondary)',
                      border: selected ? `2px solid ${t.color}` : '2px solid var(--border-light)',
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
                    <span style={{ fontSize: '13px', fontWeight: '700', color: selected ? t.color : 'var(--text-primary)' }}>{t.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', textAlign: 'center' }}>{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dropzone */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              📎 Upload Files *
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('evidence-input').click()}
              style={{
                padding: '40px 24px',
                background: dragging ? 'rgba(255, 107, 53, 0.1)' : 'var(--bg-surface-secondary)',
                border: `2px dashed ${dragging ? '#FF6B35' : 'var(--border-medium)'}`,
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>{dragging ? '📥' : '📤'}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
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
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                📎 Files ({files.length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      padding: '12px',
                      background: 'var(--bg-surface-secondary)',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', background: 'var(--bg-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, overflow: 'hidden' }}>
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{file.size} MB</div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '22px',
                        height: '22px',
                        background: 'rgba(197, 48, 48, 0.2)',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
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
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              📝 Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what this evidence shows..."
              rows="4"
              maxLength="500"
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid var(--border-light)',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{note.length}/500</div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={() => navigate(`/officer/case/${id}`)}
              disabled={uploading}
              style={{
                padding: '14px 28px',
                background: 'var(--btn-secondary-bg)',
                border: '2px solid var(--btn-secondary-border)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--btn-secondary-text)',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: uploading ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              style={{
                padding: '14px 32px',
                background: files.length === 0 ? 'var(--border-medium)' : 'linear-gradient(135deg, #3182CE, #2C5282)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: files.length === 0 || uploading ? 'not-allowed' : 'pointer',
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