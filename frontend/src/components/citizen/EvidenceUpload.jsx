import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../common/DashboardLayout'

const EvidenceUpload = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/citizen/dashboard' },
    { icon: '📝', label: 'Submit Complaint', path: '/citizen/submit' },
    { icon: '📋', label: 'My Complaints', path: '/citizen/complaints' },
    { icon: '🔍', label: 'Track Complaint', path: '/citizen/track' },
    { icon: '🔔', label: 'Notifications', path: '/citizen/notifications' },
    { icon: '👤', label: 'My Profile', path: '/citizen/profile' }
  ]

  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFiles = (newFiles) => {
    const processed = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      progress: 100,
      url: file.type.startsWith('image') ? URL.createObjectURL(file) : null
    }))
    setFiles((prev) => [...prev, ...processed])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e) => handleFiles(e.target.files)

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return '🖼️'
    if (type.startsWith('video')) return '🎥'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('doc')) return '📝'
    return '📎'
  }

  const formatSize = (sizeMB) => `${sizeMB} MB`

  const handleUpload = () => {
    if (files.length === 0) {
      alert('Please add at least one file')
      return
    }
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      alert('Files uploaded successfully!')
    }, 1500)
  }

  return (
    <DashboardLayout role="citizen" menuItems={menuItems} title="Upload Evidence">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 16px',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#4a5568',
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
            📸 Upload Evidence
          </h2>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
            Add photos, videos, or documents that support your complaint.
          </p>

          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              padding: '48px 24px',
              background: dragging ? '#fff5f0' : '#f7fafc',
              border: `2px dashed ${dragging ? '#FF6B35' : '#cbd5e0'}`,
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '6px' }}>
              {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
            </div>
            <div style={{ fontSize: '13px', color: '#718096' }}>
              Images, videos, PDFs (max 10 MB each)
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#4a5568', marginBottom: '12px' }}>
                Uploaded Files ({files.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      background: '#f7fafc',
                      borderRadius: '10px'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {getFileIcon(file.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>{formatSize(file.size)}</div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#fed7d7',
                        color: '#c53030',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  onClick={() => setFiles([])}
                  style={{ padding: '12px 24px', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #FF6B35, #F7931E)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)' }}
                >
                  {uploading ? '⏳ Uploading...' : '✅ Upload Files'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EvidenceUpload