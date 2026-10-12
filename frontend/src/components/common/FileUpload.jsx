import React, { useRef, useState } from 'react'

const FileUpload = ({
  onFilesSelected,
  accept = 'image/*,video/*,.pdf,.doc,.docx',
  multiple = true,
  maxSizeMB = 10,
  maxFiles = 10,
  existingFiles = []
}) => {
  const inputRef = useRef(null)
  const [files, setFiles] = useState(existingFiles)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return '🖼️'
    if (type.startsWith('video')) return '🎥'
    if (type.includes('pdf')) return '📄'
    if (type.includes('word') || type.includes('doc')) return '📝'
    if (type.includes('excel') || type.includes('sheet')) return '📊'
    return '📎'
  }

  const processFiles = (newFiles) => {
    setError('')
    const validFiles = []
    const errors = []

    Array.from(newFiles).forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${maxSizeMB} MB limit`)
        return
      }
      validFiles.push(file)
    })

    if (files.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    const updated = [...files, ...validFiles]
    setFiles(updated)
    onFilesSelected?.(updated)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e) => {
    processFiles(e.target.files)
    e.target.value = ''
  }

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesSelected?.(updated)
  }

  const clearAll = () => {
    setFiles([])
    onFilesSelected?.([])
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
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
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
          {dragging ? '📥' : '📤'}
        </div>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '4px'
          }}
        >
          {dragging ? 'Drop files here' : 'Click to upload or drag & drop'}
        </div>
        <div style={{ fontSize: '12px', color: '#718096' }}>
          Max {maxSizeMB} MB per file • Up to {maxFiles} files
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: '#fff5f5',
            color: '#c53030',
            border: '1px solid #feb2b2',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: '#4a5568'
              }}
            >
              📎 Uploaded Files ({files.length})
            </div>
            <button
              onClick={clearAll}
              style={{
                background: 'none',
                border: 'none',
                color: '#c53030',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Clear All
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: '#f7fafc',
                  borderRadius: '10px'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    background: 'white',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}
                >
                  {getFileIcon(file.type || '')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#1a202c',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#718096' }}>
                    {formatSize(file.size)}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    width: '30px',
                    height: '30px',
                    background: '#fed7d7',
                    color: '#c53030',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '700',
                    flexShrink: 0
                  }}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload